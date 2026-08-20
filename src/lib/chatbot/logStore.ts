import { getStore } from '@netlify/blobs';
import type { ChatMessage } from './types';

/** Grava o histórico de uma conversa no Netlify Blobs. Falha silenciosamente fora do Netlify (ex: dev local sem contexto de blobs). */
export async function logConversation(clientId: string, history: ChatMessage[]) {
  try {
    const store = getStore('chat-logs');
    const key = `${new Date().toISOString()}-${clientId}`;
    await store.setJSON(key, { clientId, history, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[chatbot] falha ao salvar log da conversa:', err);
  }
}
