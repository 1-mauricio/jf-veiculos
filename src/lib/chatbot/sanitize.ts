import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from './config';
import type { ChatMessage } from './types';

/**
 * Valida e recorta o histórico enviado pelo cliente: mantém só o formato esperado,
 * limita quantidade e tamanho das mensagens para conter o consumo de tokens por turno.
 * Retorna `null` quando o payload não é uma lista.
 */
export function sanitizeHistory(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;

  const messages: ChatMessage[] = [];
  for (const item of input.slice(-MAX_HISTORY_MESSAGES)) {
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
