# JF Veículos

Site da JF Veículos: catálogo de carros e motos seminovos, com painel de edição visual (sem precisar mexer em código) para cadastrar veículos, depoimentos, dados da loja, textos/logo do site e até trocar o tema de cores e fontes.

## Stack

- **[Astro](https://astro.build)** — gera um site estático (HTML/CSS/JS), rápido e simples de hospedar.
- **[Decap CMS](https://decapcms.org)** — painel de edição em `/admin`, com formulários e upload de fotos. Cada publicação vira um commit no repositório.
- Conteúdo (veículos, depoimentos, dados da loja) fica em `src/content/`, como arquivos JSON.

## Rodando localmente

```sh
npm install
npm run dev
```

Abre em `http://localhost:4321`.

Para testar o painel de edição (`/admin`) localmente, sem precisar de Netlify, rode em outro terminal:

```sh
npx decap-server
```

E acesse `http://localhost:4321/admin/index.html`.

## Estrutura do projeto

```text
public/
  admin/            → painel de edição (Decap CMS): config.yml define os campos
src/
  components/        → componentes reutilizáveis (Header, Footer, VehicleCard, Button, Icon)
  content/
    veiculos/         → um arquivo .json por veículo
    depoimentos/       → um arquivo .json por depoimento
    loja/loja.json     → dados da loja (WhatsApp, endereço, horários...)
    site/site.json      → logo e textos gerais do site (banner, vantagens, CTA, rodapé)
    aparencia/aparencia.json → tema de cores e fontes
  content.config.ts   → define os campos (schema) de cada tipo de conteúdo
  layouts/            → layout base (head, header, footer, injeta o tema escolhido)
  lib/
    format.ts           → funções de formatação (preço, km, link do WhatsApp)
    themes.ts            → paletas de cor e combinações de fonte disponíveis
  pages/
    index.astro           → home
    veiculos/index.astro  → listagem com filtros
    veiculos/[slug].astro → página de detalhe de um veículo
    loja.astro             → página institucional da loja
  scripts/            → JS que roda no navegador (filtros da listagem, galeria de fotos)
  styles/tokens/       → cores, tipografia e espaçamentos (identidade visual)
```

## Editando conteúdo

**Pelo painel (recomendado para quem não mexe em código):** acesse `/admin` no site publicado, faça login e edite veículos, depoimentos ou dados da loja por formulário.

**Direto no código:** edite os arquivos `.json` em `src/content/`. Os campos aceitos de cada tipo estão descritos em `src/content.config.ts`.

## Comandos

| Comando           | Ação                                      |
| :----------------- | :----------------------------------------- |
| `npm install`       | Instala as dependências                     |
| `npm run dev`        | Sobe o servidor local em `localhost:4321`    |
| `npm run build`      | Gera o site de produção em `./dist/`         |
| `npm run preview`    | Pré-visualiza o build de produção localmente |
| `npx astro check`   | Checa erros de tipo/template                |

## Deploy

O site é feito para hospedar no [Netlify](https://netlify.com) (build command `npm run build`, pasta `dist`, já configurado em `netlify.toml`). Depois do primeiro deploy, ative **Identity** e **Git Gateway** em Site configuration para o painel `/admin` funcionar em produção, e convide por e-mail quem for editar o conteúdo.

## Chatbot

O site tem um chatbot (bolha no canto inferior direito) que responde dúvidas sobre o estoque usando a API gratuita da [Groq](https://console.groq.com) (modelo `llama-3.1-8b-instant`) e, ao final da conversa, oferece um link de WhatsApp já com um resumo do interesse do visitante.

- Para rodar localmente, copie `.env.example` para `.env` e preencha `GROQ_API_KEY` com uma chave gratuita gerada em [console.groq.com/keys](https://console.groq.com/keys).
- Em produção, configure a mesma variável em Netlify: **Site configuration > Environment variables > `GROQ_API_KEY`**.
- Sem a chave configurada, o chat responde com uma mensagem de indisponibilidade — o resto do site continua funcionando normalmente.

Documentação completa (arquitetura, prompt, fluxo de conversa, limitações): [`docs/chatbot.md`](docs/chatbot.md).
