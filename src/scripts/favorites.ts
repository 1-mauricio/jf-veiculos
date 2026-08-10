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
  const label = btn.querySelector('[data-fav-label]');
  if (label) label.textContent = isFav ? 'Salvo' : 'Favoritar';
}

function syncCountBadges(favs: Set<string>) {
  document.querySelectorAll<HTMLElement>('[data-fav-count]').forEach((el) => {
    el.textContent = String(favs.size);
    el.closest<HTMLElement>('[data-fav-nav]')?.classList.toggle('has-favs', favs.size > 0);
  });
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
      if (current.has(id)) current.delete(id);
      else current.add(id);
      writeFavorites(current);
      document
        .querySelectorAll<HTMLElement>(`[data-fav-btn][data-vehicle-id="${id}"]`)
        .forEach((el) => syncButton(el, current));
      syncCountBadges(current);
      document.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: current }));
    });
  });
}
