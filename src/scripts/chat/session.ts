import type { ChatMessage, VehicleRef } from '../../lib/chatbot/types';

const STORAGE_KEY = 'jf-chat-session';
/** Limite de eventos guardados, só para não deixar o sessionStorage crescer sem limite. */
const MAX_STORED_EVENTS = 40;

/**
 * Um evento de UI do chat, na ordem em que apareceu no log. Guardamos eventos (não só o
 * histórico de mensagens) para conseguir reconstruir a conversa inteira — balões, botões
 * de veículo e o CTA do WhatsApp — exatamente como ela estava antes do reload.
 */
export type ChatEvent =
  | { type: 'bubble'; role: ChatMessage['role']; text: string }
  | { type: 'vehicle'; veiculo: VehicleRef }
  | { type: 'whatsapp'; waNumber: string; resumo: string };

/**
 * Lê a conversa salva na sessionStorage (dura enquanto a aba estiver aberta; some ao
 * fechá-la). Falha silenciosamente se o storage estiver indisponível (ex: modo privado).
 */
export function loadChatEvents(): ChatEvent[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatEvent[]) : [];
  } catch {
    return [];
  }
}

export function saveChatEvents(events: ChatEvent[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_STORED_EVENTS)));
  } catch {
    // sessionStorage indisponível (modo privado, quota excedida etc.) — segue sem persistir.
  }
}
