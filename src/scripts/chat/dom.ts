import type { VehicleRef } from '../../lib/chatbot/types';

export function scrollToBottom(log: HTMLElement) {
  log.scrollTop = log.scrollHeight;
}

export function appendBubble(log: HTMLElement, role: 'user' | 'assistant', text: string): HTMLElement {
  const bubble = document.createElement('div');
  bubble.className = `jf-chat-bubble jf-chat-bubble-${role}`;
  bubble.textContent = text;
  log.appendChild(bubble);
  scrollToBottom(log);
  return bubble;
}

export function appendVehicleLink(log: HTMLElement, veiculo: VehicleRef) {
  const wrap = document.createElement('div');
  wrap.className = 'jf-chat-cta';
  const link = document.createElement('a');
  link.href = `/veiculos/${veiculo.id}`;
  link.className = 'jf-chat-cta-btn jf-chat-cta-btn-outline';
  link.textContent = `Ver ${veiculo.nome}`;
  wrap.appendChild(link);
  log.appendChild(wrap);
  scrollToBottom(log);
}

export function appendWhatsappCta(log: HTMLElement, waNumber: string, resumo: string) {
  const wrap = document.createElement('div');
  wrap.className = 'jf-chat-cta';
  const link = document.createElement('a');
  link.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(resumo)}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'jf-chat-cta-btn';
  link.textContent = 'Falar no WhatsApp';
  wrap.appendChild(link);
  log.appendChild(wrap);
  scrollToBottom(log);
}
