export const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODEL = 'llama-3.1-8b-instant';
export const GROQ_TEMPERATURE = 0.4;
export const GROQ_MAX_TOKENS = 300;

/** Quantas mensagens do histórico (por conversa) são reenviadas à Groq a cada turno. */
export const MAX_HISTORY_MESSAGES = 10;
/** Tamanho máximo (em caracteres) de cada mensagem do histórico, para conter o consumo de tokens. */
export const MAX_MESSAGE_LENGTH = 400;

/** Freio simples de abuso por IP. Estado em memória: reseta a cada cold start da function. */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 20;
