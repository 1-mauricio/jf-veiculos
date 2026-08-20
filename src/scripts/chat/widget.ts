import type { ChatMessage, VehicleRef } from '../../lib/chatbot/types';
import { sendChatMessage } from './api';
import { appendBubble, appendVehicleLink, appendWhatsappCta } from './dom';
import { initKeyboardOffset } from './viewport';
import { loadChatEvents, saveChatEvents, type ChatEvent } from './session';

const history: ChatMessage[] = [];
const shownVeiculoIds = new Set<string>();
const events: ChatEvent[] = [];
let sending = false;

/** Registra um evento e persiste a conversa — usado só para conteúdo real, nunca para feedback transitório (digitando, erros). */
function recordEvent(event: ChatEvent) {
  events.push(event);
  saveChatEvents(events);
}

function renderBubble(log: HTMLElement, role: 'user' | 'assistant', text: string) {
  recordEvent({ type: 'bubble', role, text });
  return appendBubble(log, role, text);
}

function renderVehicleLink(log: HTMLElement, veiculo: VehicleRef) {
  recordEvent({ type: 'vehicle', veiculo });
  appendVehicleLink(log, veiculo);
}

function renderWhatsappCta(log: HTMLElement, waNumber: string, resumo: string) {
  recordEvent({ type: 'whatsapp', waNumber, resumo });
  appendWhatsappCta(log, waNumber, resumo);
}

/** Reconstrói o log a partir da sessão salva. Devolve `true` se havia algo para restaurar. */
function restoreSession(log: HTMLElement): boolean {
  const stored = loadChatEvents();
  if (stored.length === 0) return false;

  for (const event of stored) {
    events.push(event);
    if (event.type === 'bubble') {
      appendBubble(log, event.role, event.text);
      history.push({ role: event.role, content: event.text });
    } else if (event.type === 'vehicle') {
      appendVehicleLink(log, event.veiculo);
      shownVeiculoIds.add(event.veiculo.id);
    } else {
      appendWhatsappCta(log, event.waNumber, event.resumo);
    }
  }
  return true;
}

async function sendMessage(panel: HTMLElement, text: string) {
  if (sending) return;
  sending = true;

  const log = panel.querySelector<HTMLElement>('[data-chat-log]');
  const form = panel.querySelector<HTMLFormElement>('[data-chat-form]');
  const input = panel.querySelector<HTMLInputElement>('[data-chat-input]');
  const waNumber = panel.dataset.waNumber ?? '';
  if (!log) {
    sending = false;
    return;
  }

  history.push({ role: 'user', content: text });
  renderBubble(log, 'user', text);
  if (input) input.value = '';
  form?.querySelector('button')?.setAttribute('disabled', 'true');

  const typing = appendBubble(log, 'assistant', 'digitando...');
  typing.classList.add('jf-chat-bubble-typing');

  try {
    const data = await sendChatMessage(history);
    typing.remove();

    if (data.error) {
      appendBubble(log, 'assistant', data.error);
      return;
    }

    history.push({ role: 'assistant', content: data.reply });
    renderBubble(log, 'assistant', data.reply);

    for (const veiculo of data.veiculos ?? []) {
      if (shownVeiculoIds.has(veiculo.id)) continue;
      shownVeiculoIds.add(veiculo.id);
      renderVehicleLink(log, veiculo);
    }

    if (data.ready && data.resumo && waNumber) {
      renderWhatsappCta(log, waNumber, data.resumo);
    }
  } catch {
    typing.remove();
    appendBubble(log, 'assistant', 'Não consegui responder agora. Verifique sua conexão e tente novamente.');
  } finally {
    sending = false;
    form?.querySelector('button')?.removeAttribute('disabled');
    input?.focus();
  }
}

export function initChatWidget() {
  const toggle = document.querySelector<HTMLElement>('[data-chat-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-chat-panel]');
  const closeBtn = document.querySelector<HTMLElement>('[data-chat-close]');
  const form = document.querySelector<HTMLFormElement>('[data-chat-form]');
  const input = document.querySelector<HTMLInputElement>('[data-chat-input]');
  const log = document.querySelector<HTMLElement>('[data-chat-log]');

  if (!toggle || !panel || !form || !input || !log) return;
  if (toggle.dataset.chatInit === 'true') return;
  toggle.dataset.chatInit = 'true';

  initKeyboardOffset();
  restoreSession(log);

  let opened = false;
  toggle.addEventListener('click', () => {
    opened = !opened;
    panel.classList.toggle('is-open', opened);
    toggle.classList.toggle('is-open', opened);
    if (opened) {
      input.focus();
      if (log.children.length === 0) {
        appendBubble(log, 'assistant', 'Olá! Sou a atendente virtual da JF Veículos. Está procurando carro ou moto?');
      }
    }
  });

  closeBtn?.addEventListener('click', () => {
    opened = false;
    panel.classList.remove('is-open');
    toggle.classList.remove('is-open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    sendMessage(panel, text);
  });
}
