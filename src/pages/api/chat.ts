import type { APIRoute } from 'astro';
import { isRateLimited } from '../../lib/chatbot/rateLimit';
import { sanitizeHistory } from '../../lib/chatbot/sanitize';
import { buildSystemPrompt } from '../../lib/chatbot/prompt';
import { askGroq, GroqRateLimitError } from '../../lib/chatbot/groqClient';
import { parseAssistantReply } from '../../lib/chatbot/parseReply';
import { logConversation } from '../../lib/chatbot/logStore';

export const prerender = false;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const apiKey = import.meta.env.GROQ_API_KEY ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'Chat indisponível no momento.' }, 503);
  }

  if (isRateLimited(clientAddress || 'unknown')) {
    return jsonResponse({ error: 'Muitas mensagens em pouco tempo. Tente novamente em instantes.' }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Corpo da requisição inválido.' }, 400);
  }

  const history = sanitizeHistory((body as { messages?: unknown })?.messages);
  if (!history || history.length === 0) {
    return jsonResponse({ error: 'Nenhuma mensagem enviada.' }, 400);
  }

  const { prompt: systemPrompt, vehicleNames } = await buildSystemPrompt();

  let raw: string;
  try {
    raw = await askGroq(apiKey, systemPrompt, history);
  } catch (err) {
    if (err instanceof GroqRateLimitError) {
      return jsonResponse(
        { error: 'Estamos com muita gente conversando agora. Aguarde alguns segundos e tente de novo.' },
        429,
      );
    }
    console.error('[chatbot] falha ao chamar a Groq:', err);
    return jsonResponse({ error: 'Falha ao contatar o assistente. Tente novamente.' }, 502);
  }

  const { reply, ready, resumo, veiculos } = parseAssistantReply(raw, vehicleNames);
  void logConversation(clientAddress || 'unknown', [...history, { role: 'assistant', content: reply }]);
  return jsonResponse({ reply, ready, resumo, veiculos }, 200);
};
