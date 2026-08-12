# Chatbot de atendimento

O site tem um chatbot (bolha no canto inferior direito, em todas as páginas) que conversa sobre o estoque em tempo real e, quando o visitante confirma interesse em um veículo, encaminha para o WhatsApp da loja com uma mensagem já pré-preenchida.

## Visão geral da arquitetura

```
Visitante digita no widget (ChatWidget.astro + src/scripts/chat/*)
        │  POST /api/chat  { messages: [...] }
        ▼
src/pages/api/chat.ts  (rota on-demand, roda como Netlify Function — só orquestra)
        │  sanitiza histórico, monta o system prompt, chama a Groq, valida a resposta
        │  (cada etapa vive em um módulo próprio de src/lib/chatbot/)
        ▼
Groq (llama-3.1-8b-instant) responde em JSON estruturado
        │
        ▼
rota devolve { reply, ready, resumo, veiculos } para o navegador
```

O site em si continua **estático** (gerado em build). Só essa rota (`/api/chat`) roda sob demanda, no servidor, porque é a única parte que precisa de uma chave secreta (a da Groq) — chave essa que nunca pode ir para o código que roda no navegador.

A lógica de negócio fica dividida em módulos de responsabilidade única sob `src/lib/chatbot/`, e a rota (`src/pages/api/chat.ts`) é só um orquestrador fino que os compõe — ver tabela abaixo.

## Por que Groq

A Groq oferece um tier gratuito com modelos pequenos e muito rápidos (usamos o `llama-3.1-8b-instant`). Não há custo de infraestrutura própria — é só uma API HTTP chamada a partir da function.

**Limite do tier gratuito:** 6.000 tokens por minuto por organização. Isso é suficiente para o uso normal do chat, mas uma rajada de mensagens muito rápidas (testes automatizados, por exemplo) pode esbarrar nesse limite. Quando isso acontece, a rota retorna 429 e o widget mostra "Estamos com muita gente conversando agora. Aguarde alguns segundos e tente de novo." em vez de travar silenciosamente.

## Arquivos envolvidos

**Backend**

| Arquivo | Papel |
| :-- | :-- |
| [`src/pages/api/chat.ts`](../src/pages/api/chat.ts) | Rota: só orquestra os módulos abaixo e traduz erros em status HTTP |
| [`src/lib/chatbot/types.ts`](../src/lib/chatbot/types.ts) | Tipos do contrato da API (`ChatMessage`, `VehicleRef`, `ChatApiResponse`), compartilhados com o frontend |
| [`src/lib/chatbot/config.ts`](../src/lib/chatbot/config.ts) | Constantes: modelo/URL da Groq, limites de histórico, parâmetros do rate limit |
| [`src/lib/chatbot/sanitize.ts`](../src/lib/chatbot/sanitize.ts) | Valida e recorta o histórico recebido do cliente |
| [`src/lib/chatbot/rateLimit.ts`](../src/lib/chatbot/rateLimit.ts) | Freio simples de abuso por IP (em memória) |
| [`src/lib/chatbot/prompt.ts`](../src/lib/chatbot/prompt.ts) | Monta o system prompt a partir do estoque e dos dados da loja |
| [`src/lib/chatbot/groqClient.ts`](../src/lib/chatbot/groqClient.ts) | Chamada HTTP à Groq; expõe `GroqRateLimitError` e `GroqRequestError` |
| [`src/lib/chatbot/parseReply.ts`](../src/lib/chatbot/parseReply.ts) | Interpreta e valida o JSON devolvido pelo modelo contra o estoque real |

**Frontend**

| Arquivo | Papel |
| :-- | :-- |
| [`src/components/ChatWidget.astro`](../src/components/ChatWidget.astro) | Markup da bolha/painel de chat; importa o CSS e inicializa o script |
| [`src/styles/chat-widget.css`](../src/styles/chat-widget.css) | Estilos do widget |
| [`src/scripts/chat/widget.ts`](../src/scripts/chat/widget.ts) | Orquestração: estado da conversa, eventos de abrir/fechar/enviar |
| [`src/scripts/chat/api.ts`](../src/scripts/chat/api.ts) | Chamada `fetch` para `/api/chat` |
| [`src/scripts/chat/dom.ts`](../src/scripts/chat/dom.ts) | Helpers de renderização (balões, botão de veículo, botão do WhatsApp) |
| [`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) | Inclui `<ChatWidget />` em todas as páginas |

**Infra**

| Arquivo | Papel |
| :-- | :-- |
| [`astro.config.mjs`](../astro.config.mjs) | Adapter `@astrojs/netlify`, necessário para a rota on-demand existir em produção |
| `.env` (local, não versionado) / variável `GROQ_API_KEY` no Netlify | Chave da API da Groq |

## O que a rota `/api/chat` faz a cada mensagem

A rota (`src/pages/api/chat.ts`) só orquestra — cada passo é delegado a um módulo de `src/lib/chatbot/` com uma responsabilidade única:

1. **Confere a chave da Groq.** Sem `GROQ_API_KEY` configurada, responde 503 com uma mensagem amigável — o resto do site continua funcionando normalmente.
2. **`rateLimit.isRateLimited(ip)`** — freio simples de abuso por IP (20 requisições a cada 10 minutos, em memória; reseta a cada cold start da function — é um freio básico, não uma solução de produção robusta).
3. **`sanitize.sanitizeHistory(body.messages)`** — valida o histórico recebido do navegador: mantém só as últimas 10 mensagens, corta cada uma em até 400 caracteres, e descarta qualquer coisa que não seja `{ role: 'user' | 'assistant', content: string }`.
4. **`prompt.buildSystemPrompt()`** — monta o system prompt lendo as content collections `veiculos` e `loja` do próprio Astro:
   - Dados da loja (endereço, horário, sobre).
   - Um resumo numérico do estoque (`X carro(s) e Y moto(s)`), usado para a IA saber avisar quando o tipo pedido está zerado.
   - A lista completa do estoque, em formato compacto (`id | tipo | nome ano/anoModelo | km | preço | câmbio | combustível | cor`) — compacto de propósito, para gastar menos tokens a cada chamada.
   - As instruções de comportamento (ver seção abaixo).
   - Devolve também `vehicleNames` (um `Map<id, "nome ano">`), usado na validação do passo 6.
5. **`groqClient.askGroq(apiKey, systemPrompt, history)`** — chama a Groq (`POST https://api.groq.com/openai/v1/chat/completions`) com `response_format: { type: 'json_object' }`, pedindo que o modelo responda só com um JSON. Lança `GroqRateLimitError` (429) ou `GroqRequestError` (qualquer outra falha), que a rota traduz em status HTTP.
6. **`parseReply.parseAssistantReply(raw, vehicleNames)`** — interpreta e valida o JSON do modelo antes de repassar ao navegador:
   - `veiculoIds` citados são filtrados contra `vehicleNames` (o estoque real), então a IA nunca consegue linkar ou "inventar" um veículo que não existe.
   - Se o JSON vier malformado, cai para uma mensagem de erro genérica em vez de quebrar.

## O contrato de resposta da IA

O prompt exige que o modelo responda **sempre e só** com este JSON:

```json
{
  "reply": "mensagem mostrada no balão do chat, na voz da atendente",
  "veiculoIds": ["ids do estoque citados nesta resposta"],
  "ready": true ou false,
  "resumo": "mensagem pronta para o WhatsApp, na voz do cliente (só quando ready = true)"
}
```

Os quatro campos têm papéis bem separados de propósito:

- **`reply`** — o que aparece no balão de chat. Nunca deve conter links, URLs nem repetir o `resumo`.
- **`veiculoIds`** — toda vez que a IA cita um veículo pelo nome (seja sugerindo um só ou listando vários), ela inclui o id de cada um aqui. O frontend transforma cada id em um botão "Ver `<nome> <ano>`" que linka para `/veiculos/{id}` — sem a IA precisar (ou poder) escrever a URL manualmente.
- **`ready`** — só vira `true` depois que o visitante **confirma** um veículo específico (não basta a IA sugerir; a pessoa precisa dizer algo como "quero esse", "gostei", "pode ser").
- **`resumo`** — a mensagem que vai pré-preencher o WhatsApp, escrita em primeira pessoa (voz do cliente), citando o veículo, ano e preço exatos do estoque. Não pede nem exige o nome da pessoa (só inclui se ela tiver se apresentado espontaneamente na conversa).

### Fluxo de uma conversa até o WhatsApp

1. Visitante descreve o que procura → IA sugere um ou mais veículos do estoque real, cada um virando um botão "Ver anúncio" para a página do veículo no próprio site.
2. Visitante confirma um veículo específico.
3. Só então a IA marca `ready: true`. O `reply` desse turno é um convite curto ("Clique aqui embaixo para continuar no WhatsApp..."), e o `resumo` é a mensagem que vai para o WhatsApp.
4. O frontend mostra o botão **"Falar no WhatsApp"**, que abre `https://wa.me/<número-da-loja>?text=<resumo urlencoded>`.

### Regra de disponibilidade

Como o estoque pode não ter nenhum veículo de um tipo (por exemplo, zero carros, só motos), o prompt recebe um resumo explícito (`RESUMO DO ESTOQUE: 0 carro(s) e 13 moto(s)`) e uma regra condicional clara: só avisar "não temos X" quando o visitante pedir especificamente o tipo zerado — nunca por engano quando ele pede o tipo que existe. Isso evitou um bug real de teste em que o modelo confundia os dois casos.

## Frontend (`src/scripts/chat/*` + `ChatWidget.astro`)

- `widget.ts` guarda o estado da conversa em memória no navegador (`history`, `shownVeiculoIds`) e reenvia o histórico por inteiro a cada mensagem — a rota é stateless, não guarda conversa no servidor.
- `api.ts` isola a chamada `fetch('/api/chat')` do resto da lógica, para poder trocar a forma de comunicação sem tocar em estado ou renderização.
- `dom.ts` só sabe criar elementos (balão, botão de veículo, botão do WhatsApp) — não conhece o estado da conversa.
- `shownVeiculoIds` evita repetir o mesmo botão de veículo se a IA citar o mesmo id em turnos seguintes.
- Erros de rede ou de API viram uma mensagem de assistente amigável no próprio balão de chat, nunca um erro "cru".

## Configuração

1. Criar uma conta gratuita em [console.groq.com](https://console.groq.com) e gerar uma API key em [console.groq.com/keys](https://console.groq.com/keys).
2. Local: copiar `.env.example` para `.env` e preencher `GROQ_API_KEY`.
3. Produção (Netlify): Site configuration → Environment variables → `GROQ_API_KEY`.

Sem a chave, a rota responde 503 e o widget mostra uma mensagem de indisponibilidade — o restante do site não é afetado.

## Limitações conhecidas / próximos passos possíveis

- **Rate limit da Groq (6.000 TPM)** pode ser atingido em picos de uso real, não só em testes. Se isso passar a ser um problema recorrente, as opções são: reduzir ainda mais o prompt, cachear o system prompt (não é possível hoje porque o Groq não suporta prompt caching no tier gratuito), ou migrar para um tier pago.
- **Rate limit por IP é em memória** — reseta a cada cold start da function e não é compartilhado entre instâncias. Serve como freio básico, não como proteção definitiva contra abuso.
- **Sem persistência de conversa** — se a pessoa recarregar a página, o histórico do chat é perdido.
