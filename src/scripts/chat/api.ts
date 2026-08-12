import type { ChatApiResponse, ChatMessage } from '../../lib/chatbot/types';

/** Chama a rota /api/chat com o histórico da conversa e devolve a resposta já tipada. */
export async function sendChatMessage(history: ChatMessage[]): Promise<ChatApiResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
  });
  const data: ChatApiResponse = await res.json();
  if (!res.ok && !data.error) {
    data.error = 'Não consegui responder agora. Tente novamente em instantes.';
  }
  return data;
}
