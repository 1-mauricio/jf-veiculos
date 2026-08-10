const STORAGE_KEY = 'jf-favoritos';

function readFavorites(): Set<string> {
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
  btn.classList.toggle('is-active', favs.has(id));
}

function initFavorites() {
  const favs = readFavorites();
  const buttons = document.querySelectorAll<HTMLElement>('[data-fav-btn]');
  buttons.forEach((btn) => {
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
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFavorites);
} else {
  initFavorites();
}

document.addEventListener('astro:page-load', initFavorites);
