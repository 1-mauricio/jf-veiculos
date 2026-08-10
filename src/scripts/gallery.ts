function readFotos(el: HTMLElement): string[] {
  try {
    return JSON.parse(el.dataset.fotos ?? '[]') as string[];
  } catch {
    return [];
  }
}

function goTo(el: HTMLElement, fotos: string[], idx: number) {
  const n = fotos.length;
  const next = ((idx % n) + n) % n;
  el.dataset.idx = String(next);
  const img = el.querySelector<HTMLImageElement>('[data-gallery-img]');
  if (img) img.src = fotos[next];

  const thumbs = document.querySelectorAll<HTMLElement>('[data-thumb]');
  thumbs.forEach((t, i) => t.classList.toggle('is-active', i === next));
}

function initGallery(el: HTMLElement) {
  if (el.dataset.galleryInit === 'true') return;
  el.dataset.galleryInit = 'true';

  const fotos = readFotos(el);
  if (fotos.length <= 1) return;

  let idx = Number(el.dataset.idx ?? 0);
  let startX = 0;
  let dx = 0;
  let dragging = false;

  const prevBtn = el.querySelector<HTMLElement>('[data-gallery-prev]');
  const nextBtn = el.querySelector<HTMLElement>('[data-gallery-next]');

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    idx -= 1;
    goTo(el, fotos, idx);
  });
  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    idx += 1;
    goTo(el, fotos, idx);
  });

  el.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    dx = 0;
    dragging = true;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
  });
  el.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(dx) > 40) {
      idx += dx < 0 ? 1 : -1;
      goTo(el, fotos, idx);
    }
  });
  el.addEventListener('pointercancel', () => {
    dragging = false;
  });
  // Evita que um arraste vire um clique (abrindo o veículo sem querer nos cards).
  el.addEventListener(
    'click',
    (e) => {
      if (Math.abs(dx) > 10) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  document.querySelectorAll<HTMLElement>('[data-thumb]').forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      idx = i;
      goTo(el, fotos, idx);
    });
  });
}

export function initGalleries() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(initGallery);
}
