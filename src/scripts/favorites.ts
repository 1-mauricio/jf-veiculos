const STORAGE_KEY = 'jf-favoritos';
export const FAVORITES_CHANGED_EVENT = 'jf:favorites-changed';

export function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeFavorites(favs: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
}

function syncButton(btn: HTMLElement, favs: Set<string>) {
  const id = btn.dataset.vehicleId;
  if (!id) return;
  const isFav = favs.has(id);
  btn.classList.toggle('is-active', isFav);
  if (btn.hasAttribute('aria-pressed')) btn.setAttribute('aria-pressed', String(isFav));
  const label = btn.querySelector('[data-fav-label]');
  if (label) label.textContent = isFav ? 'Salvo' : 'Favoritar';
}

function syncCountBadges(favs: Set<string>) {
  document.querySelectorAll<HTMLElement>('[data-fav-count]').forEach((el) => {
    el.textContent = String(favs.size);
    el.closest<HTMLElement>('[data-fav-nav]')?.classList.toggle('has-favs', favs.size > 0);
  });
}

export function pruneFavorites(validIds: Iterable<string>): Set<string> {
  const valid = new Set(validIds);
  const current = readFavorites();
  const pruned = new Set([...current].filter((id) => valid.has(id)));
  if (pruned.size !== current.size) {
    writeFavorites(pruned);
    syncCountBadges(pruned);
    document.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: pruned }));
  }
  return pruned;
}

let toast: HTMLElement | null = null;
let toastTimer: number | undefined;

function announce(text: string) {
  if (!toast) {
    toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText =
      'position:fixed;left:50%;bottom:24px;translate:-50% 0;z-index:100;padding:10px 18px;border-radius:var(--radius-md);' +
      'background:var(--text-primary);color:var(--surface-card);font:600 14px var(--font-body);pointer-events:none;transition:opacity 150ms;opacity:0';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { if (toast) toast.style.opacity = '0'; }, 1600);
}

export function initFavorites() {
  const favs = readFavorites();
  syncCountBadges(favs);

  const buttons = document.querySelectorAll<HTMLElement>('[data-fav-btn]');
  buttons.forEach((btn) => {
    if (btn.dataset.favInit === 'true') return;
    btn.dataset.favInit = 'true';
    syncButton(btn, favs);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.vehicleId;
      if (!id) return;
      const current = readFavorites();
      const removed = current.delete(id);
      if (!removed) current.add(id);
      announce(removed ? 'Removido' : 'Salvo');
      writeFavorites(current);
      document
        .querySelectorAll<HTMLElement>(`[data-fav-btn][data-vehicle-id="${id}"]`)
        .forEach((el) => syncButton(el, current));
      syncCountBadges(current);
      document.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: current }));
    });
  });
}
