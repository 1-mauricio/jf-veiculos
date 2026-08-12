import { GROQ_MAX_TOKENS, GROQ_MODEL, GROQ_TEMPERATURE, GROQ_URL } from './config';
import type { ChatMessage } from './types';

/** A Groq recusou a chamada por limite de uso do tier gratuito (429). */
export class GroqRateLimitError extends Error {
  constructor() {
    super('Groq rate limit exceeded');
    this.name = 'GroqRateLimitError';
  }
}

/** Falha de rede, timeout, ou qualquer resposta não-ok da Groq que não seja rate limit. */
export class GroqRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroqRequestError';
  }
}

/**
 * Chama a API de chat completions da Groq e devolve o texto bruto da resposta do modelo
 * (esperado como um JSON string, já que a chamada usa response_format "json_object").
 */
export async function askGroq(apiKey: string, systemPrompt: string, history: ChatMessage[]): Promise<string> {
  let response: Response;
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        temperature: GROQ_TEMPERATURE,
        max_tokens: GROQ_MAX_TOKENS,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (err) {
    throw new GroqRequestError(err instanceof Error ? err.message : 'network error');
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error(`[chatbot] Groq respondeu ${response.status}:`, errorBody);
    if (response.status === 429) throw new GroqRateLimitError();
    throw new GroqRequestError(`Groq respondeu ${response.status}`);
  }

  const data = await response.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  return content ?? '';
}
