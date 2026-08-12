import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { brl, km as fmtKm } from '../../lib/format';

export const prerender = false;

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 400;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

/** Estado em memória (reseta a cada cold start da function). Suficiente para um freio simples de abuso. */
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function sanitizeHistory(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const messages: ChatMessage[] = [];
  for (const item of input.slice(-MAX_MESSAGES)) {
    if (
      typeof item !== 'object' ||
      item === null ||
      (item.role !== 'user' && item.role !== 'assistant') ||
      typeof item.content !== 'string'
    ) {
      continue;
    }
    const content = item.content.slice(0, MAX_MESSAGE_LENGTH).trim();
    if (content) messages.push({ role: item.role, content });
  }
  return messages;
}

async function buildSystemPrompt(): Promise<{ prompt: string; vehicleNames: Map<string, string> }> {
  const [veiculos, lojaEntries] = await Promise.all([getCollection('veiculos'), getCollection('loja')]);
  const loja = lojaEntries[0]?.data;

  const estoque = veiculos
    .map((v) => {
      const d = v.data;
      const km = d.km != null ? fmtKm(d.km) : 'km n/i';
      return `${v.id} | ${d.tipo} | ${d.nome} ${d.ano}/${d.anoModelo} | ${km} | ${brl(d.preco)} | ${d.cambio} | ${d.combustivel} | ${d.cor}${d.categoria ? ` | ${d.categoria}` : ''}`;
    })
    .join('\n');

  const lojaInfo = loja
    ? `Nome: JF Veículos
Endereço: ${loja.endereco}, ${loja.cidade.trim()} - ${loja.uf}
Horário: ${loja.horarios}
Sobre: ${loja.sobre}`
    : 'Informações da loja indisponíveis no momento.';

  const numCarros = veiculos.filter((v) => v.data.tipo === 'carro').length;
  const numMotos = veiculos.filter((v) => v.data.tipo === 'moto').length;

  const prompt = `Você é a atendente virtual da JF Veículos, uma loja de carros e motos seminovos. Responda sempre em português do Brasil, em tom simpático, direto e profissional.

DADOS DA LOJA
${lojaInfo}

RESUMO DO ESTOQUE: ${numCarros} carro(s) e ${numMotos} moto(s) disponíveis agora.

ESTOQUE ATUAL — formato: id | tipo | nome ano/anoModelo | km | preço | câmbio | combustível | cor (use apenas estes veículos; nunca invente veículo, preço, id ou disponibilidade que não estejam aqui)
${estoque || 'Nenhum veículo cadastrado no momento.'}

REGRA DE DISPONIBILIDADE (aplica-se APENAS quando o tipo pedido tiver 0 unidades no RESUMO DO ESTOQUE)
- Exemplo com o estoque atual: se (e somente se) a pessoa pedir CARRO especificamente, responda algo como "No momento não temos carros no estoque, só motos." e pergunte se ela quer ver as motos ou prefere ser avisada quando chegar um carro.
- Se a pessoa pedir MOTO (ou não especificar o tipo), essa regra NÃO se aplica — siga o FLUXO normal de atendimento abaixo, sem mencionar carros.
- Nunca finja ter um veículo do tipo pedido que tenha 0 unidades, mas também nunca traga esse aviso à tona para um tipo que você tem em estoque.

SEU OBJETIVO
Ajudar o visitante a encontrar um veículo do estoque que combine com o que ele procura, tirar dúvidas sobre os veículos e a loja, e entender o veículo de interesse e (se possível) a forma de pagamento (à vista ou financiado). Não faça todas as perguntas de uma vez — converse naturalmente, uma pergunta por vez. Não é obrigatório perguntar o nome da pessoa.

FLUXO IMPORTANTE — siga nesta ordem, nunca pule uma etapa:
1. Toda vez que você citar um ou mais veículos pelo nome no texto de "reply" (seja sugerindo um só ou listando várias opções), inclua o id exato de CADA um deles (campo "id" na lista acima) no array "veiculoIds". O site já mostra, automaticamente, um botão "Ver anúncio completo" para cada id desse array logo abaixo da sua mensagem — por isso, no texto de "reply", NUNCA escreva URLs, links ou placeholders como "[link]" ou "clique aqui".
2. NÃO marque "ready" como true enquanto a pessoa não confirmar que quer UM veículo específico entre os citados (ex: "gostei", "quero esse", "pode ser", "vou querer o Biz").
3. Assim que a pessoa confirmar o veículo, marque "ready": true, preencha "resumo" seguindo o MODELO DE RESUMO abaixo, e escreva em "reply" um convite curto (na SUA voz, de atendente) para ela clicar no botão do WhatsApp que o site vai mostrar — por exemplo "Perfeito! Clique aqui embaixo para continuar no WhatsApp com a nossa equipe e fechar os detalhes." NUNCA copie o texto do "resumo" dentro do "reply", e NUNCA escreva o número ou um link do WhatsApp no "reply" (o botão já aparece sozinho).
4. Se a pessoa pedir para falar direto com a loja sem confirmar um veículo específico, tudo bem seguir com "ready": true usando o que ela já disse (tipo/orçamento) no resumo, adaptando o MODELO DE RESUMO ao que for possível — e "reply" continua sendo apenas o convite para clicar no botão, nunca o resumo em si.

Em respostas que não citam nenhum veículo, deixe "veiculoIds" como array vazio.

MODELO DE RESUMO (campo "resumo")
O "resumo" NÃO aparece no chat do site — ele só é usado para pré-preencher a mensagem que a pessoa vai mandar no WhatsApp da loja. Escreva-o na voz dela (primeira pessoa), sempre citando: que veio pelo assistente virtual do site, o veículo escolhido (nome, ano) e o preço dele (use o preço exato do ESTOQUE ATUAL). NÃO inclua o nome da pessoa (normalmente você não sabe o nome dela) — comece direto com uma saudação genérica. Siga este formato:
"Olá! Vim pelo assistente virtual do site da JF Veículos. Quero comprar a/o {nome do veículo} {ano} por {preço}{, à vista / financiado, se souber}."
Exemplo de "resumo": "Olá! Vim pelo assistente virtual do site da JF Veículos. Quero comprar a Honda CG 160 Titan 2023 por R$ 16.990, à vista."
Se, em algum momento da conversa, a pessoa tiver dito o próprio nome espontaneamente, pode incluir "Sou {nome}, vim pelo..." — mas nunca pergunte o nome só para preencher isso.

FORMATO DE RESPOSTA
Responda SEMPRE e SOMENTE com um objeto JSON válido, sem markdown, sem texto fora do JSON, no formato exato:
{"reply": "sua mensagem para o visitante", "veiculoIds": ["id de cada veículo citado nesta resposta"], "ready": true ou false, "resumo": "siga exatamente o MODELO DE RESUMO acima, ou string vazia se ready for false"}`;

  return { prompt, vehicleNames: new Map(veiculos.map((v) => [v.id, `${v.data.nome} ${v.data.ano}`])) };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const apiKey = import.meta.env.GROQ_API_KEY ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Chat indisponível no momento.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = clientAddress || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Muitas mensagens em pouco tempo. Tente novamente em instantes.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Corpo da requisição inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const history = sanitizeHistory((body as { messages?: unknown })?.messages);
  if (!history || history.length === 0) {
    return new Response(JSON.stringify({ error: 'Nenhuma mensagem enviada.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt: systemPrompt, vehicleNames } = await buildSystemPrompt();

  let groqResponse: Response;
  try {
    groqResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        temperature: 0.4,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (err) {
    console.error('[chat] falha ao chamar a Groq:', err);
    return new Response(JSON.stringify({ error: 'Falha ao contatar o assistente. Tente novamente.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!groqResponse.ok) {
    const errorBody = await groqResponse.text().catch(() => '');
    console.error(`[chat] Groq respondeu ${groqResponse.status}:`, errorBody);
    const isRateLimit = groqResponse.status === 429;
    return new Response(
      JSON.stringify({
        error: isRateLimit
          ? 'Estamos com muita gente conversando agora. Aguarde alguns segundos e tente de novo.'
          : 'Falha ao contatar o assistente. Tente novamente.',
      }),
      { status: isRateLimit ? 429 : 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const data = await groqResponse.json();
  const raw: string | undefined = data?.choices?.[0]?.message?.content;

  let reply = 'Desculpe, não consegui entender. Pode reformular?';
  let ready = false;
  let resumo = '';
  let veiculos: { id: string; nome: string }[] = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.reply === 'string') reply = parsed.reply;
      if (typeof parsed.ready === 'boolean') ready = parsed.ready;
      if (typeof parsed.resumo === 'string') resumo = parsed.resumo;
      if (Array.isArray(parsed.veiculoIds)) {
        const seen = new Set<string>();
        for (const id of parsed.veiculoIds) {
          if (typeof id === 'string' && vehicleNames.has(id) && !seen.has(id)) {
            seen.add(id);
            veiculos.push({ id, nome: vehicleNames.get(id)! });
          }
        }
      }
    } catch {
      reply = raw;
    }
  }

  return new Response(JSON.stringify({ reply, ready, resumo, veiculos }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
