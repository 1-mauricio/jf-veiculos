type Slide = { src: string; srcset: string };

function readSlides(el: HTMLElement): Slide[] {
  try {
    return JSON.parse(el.dataset.slides ?? '[]') as Slide[];
  } catch {
    return [];
  }
}

function initGallery(el: HTMLElement) {
  if (el.dataset.galleryInit === 'true') return;
  el.dataset.galleryInit = 'true';

  const slides = readSlides(el);
  const n = slides.length;
  if (n === 0) return;

  const q = <T extends HTMLElement>(s: string) => el.querySelector<T>(s);
  const main = q<HTMLImageElement>('[data-gallery-img]')!;
  const counter = q('[data-gallery-count]');
  const thumbs = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-thumb]'));
  const dialog = q<HTMLDialogElement>('[data-gallery-dialog]')!;
  const fsImg = dialog.querySelector<HTMLImageElement>('[data-fs-img]')!;
  const fsCount = dialog.querySelector('[data-fs-count]');

  let idx = 0;

  const frame = main.closest<HTMLElement>('[data-gallery-stage]');
  const fit = () => {
    if (!frame || !main.naturalWidth) return;
    const ar = Math.min(4 / 3, Math.max(3 / 4, main.naturalWidth / main.naturalHeight));
    frame.style.setProperty('--ar', String(ar));
  };
  main.addEventListener('load', fit);
  if (main.complete) fit();

  function show(next: number) {
    idx = ((next % n) + n) % n;
    const s = slides[idx];
    main.src = s.src;
    main.srcset = s.srcset;
    const txt = `Foto ${idx + 1} de ${n}`;
    if (counter) counter.textContent = txt;
    thumbs.forEach((t, i) => {
      if (i === idx) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
      t.setAttribute('aria-pressed', String(i === idx));
    });
    const t = thumbs[idx];
    if (t && t.parentElement) t.parentElement.scrollLeft = t.offsetLeft - (t.parentElement.clientWidth - t.offsetWidth) / 2;
    if (dialog.open) syncDialog();
  }

  function syncDialog() {
    const s = slides[idx];
    fsImg.src = s.src;
    fsImg.srcset = s.srcset;
    if (fsCount) fsCount.textContent = `Foto ${idx + 1} de ${n}`;
  }

  function openDialog() {
    syncDialog();
    dialog.showModal();
  }

  el.querySelectorAll('[data-gallery-prev]').forEach((b) => b.addEventListener('click', () => show(idx - 1)));
  el.querySelectorAll('[data-gallery-next]').forEach((b) => b.addEventListener('click', () => show(idx + 1)));
  q('[data-gallery-open]')?.addEventListener('click', openDialog);
  dialog.querySelector('[data-fs-close]')?.addEventListener('click', () => dialog.close());

  thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  // Setas nas miniaturas: move seleção e foco.
  q('[data-thumbs]')?.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight') return;
    e.preventDefault();
    show(idx + (k === 'ArrowRight' ? 1 : -1));
    thumbs[idx]?.focus();
  });

  // Setas dentro da tela cheia (Esc já fecha o <dialog>).
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  // Clique fora da imagem (no backdrop/área vazia) fecha.
  dialog.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === dialog || t.matches('[data-fs-stage]')) dialog.close();
  });
  dialog.querySelectorAll('[data-fs-prev]').forEach((b) => b.addEventListener('click', () => show(idx - 1)));
  dialog.querySelectorAll('[data-fs-next]').forEach((b) => b.addEventListener('click', () => show(idx + 1)));

  // Arraste/toque horizontal no palco principal; toque sem arraste abre a tela cheia.
  const stage = q('[data-gallery-stage]')!;
  let startX = 0;
  let dx = 0;
  let down = false;
  stage.addEventListener('pointerdown', (e) => {
    const pe = e as PointerEvent;
    if ((pe.target as HTMLElement).closest('button')) return;
    startX = pe.clientX;
    dx = 0;
    down = true;
  });
  stage.addEventListener('pointermove', (e) => {
    if (down) dx = (e as PointerEvent).clientX - startX;
  });
  stage.addEventListener('pointerup', (e) => {
    if (!down) return;
    down = false;
    if ((e.target as HTMLElement).closest('button')) return;
    if (Math.abs(dx) > 40 && n > 1) show(idx + (dx < 0 ? 1 : -1));
    else if (Math.abs(dx) <= 10) openDialog();
  });
  stage.addEventListener('pointercancel', () => (down = false));

}

export function initGalleries() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(initGallery);
}
