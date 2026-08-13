/**
 * Mantém o widget de chat acima do teclado virtual em mobile.
 *
 * `interactive-widget=resizes-content` (no <meta viewport>) já resolve isso em
 * navegadores recentes, mas nem todos suportam essa diretiva. Como reforço,
 * escutamos a VisualViewport API e expomos duas CSS custom properties que o
 * chat-widget.css usa para se reposicionar/redimensionar quando o teclado abre:
 *   --jf-keyboard-offset  → quanto subir o widget para ficar acima do teclado
 *   --jf-visible-height   → altura realmente visível, para limitar a altura do painel
 */
export function initKeyboardOffset() {
  const viewport = window.visualViewport;
  if (!viewport) return;

  const root = document.documentElement.style;

  const sync = () => {
    const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    root.setProperty('--jf-keyboard-offset', `${offset}px`);
    root.setProperty('--jf-visible-height', `${viewport.height}px`);
  };

  viewport.addEventListener('resize', sync);
  viewport.addEventListener('scroll', sync);
  sync();
}
