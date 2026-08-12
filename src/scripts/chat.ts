interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VehicleRef {
  id: string;
  nome: string;
}

interface ChatResponse {
  reply: string;
  ready: boolean;
  resumo: string;
  veiculos: VehicleRef[];
  error?: string;
}

const history: ChatMessage[] = [];
let sending = false;
const shownVeiculoIds = new Set<string>();

function scrollToBottom(log: HTMLElement) {
  log.scrollTop = log.scrollHeight;
}

function appendBubble(log: HTMLElement, role: 'user' | 'assistant', text: string) {
  const bubble = document.createElement('div');
  bubble.className = `jf-chat-bubble jf-chat-bubble-${role}`;
  bubble.textContent = text;
  log.appendChild(bubble);
  scrollToBottom(log);
  return bubble;
}

function appendVehicleLink(log: HTMLElement, veiculo: VehicleRef) {
  const wrap = document.createElement('div');
  wrap.className = 'jf-chat-cta';
  const link = document.createElement('a');
  link.href = `/veiculos/${veiculo.id}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'jf-chat-cta-btn jf-chat-cta-btn-outline';
  link.textContent = `Ver ${veiculo.nome}`;
  wrap.appendChild(link);
  log.appendChild(wrap);
  scrollToBottom(log);
}

function appendWhatsappCta(log: HTMLElement, waNumber: string, resumo: string) {
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
  appendBubble(log, 'user', text);
  if (input) input.value = '';
  if (form) form.querySelector('button')?.setAttribute('disabled', 'true');

  const typing = appendBubble(log, 'assistant', 'digitando...');
  typing.classList.add('jf-chat-bubble-typing');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data: ChatResponse = await res.json();
    typing.remove();

    if (!res.ok || data.error) {
      appendBubble(log, 'assistant', data.error || 'Não consegui responder agora. Tente novamente em instantes.');
    } else {
      history.push({ role: 'assistant', content: data.reply });
      appendBubble(log, 'assistant', data.reply);
      for (const veiculo of data.veiculos ?? []) {
        if (shownVeiculoIds.has(veiculo.id)) continue;
        shownVeiculoIds.add(veiculo.id);
        appendVehicleLink(log, veiculo);
      }
      if (data.ready && data.resumo && waNumber) {
        appendWhatsappCta(log, waNumber, data.resumo);
      }
    }
  } catch {
    typing.remove();
    appendBubble(log, 'assistant', 'Não consegui responder agora. Verifique sua conexão e tente novamente.');
  } finally {
    sending = false;
    if (form) form.querySelector('button')?.removeAttribute('disabled');
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
