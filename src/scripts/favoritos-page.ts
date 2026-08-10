import { readFavorites, FAVORITES_CHANGED_EVENT } from './favorites';

function applyFilter() {
  const favs = readFavorites();
  const cards = document.querySelectorAll<HTMLElement>('[data-vehicle-card]');
  const grid = document.getElementById('jf-fav-grid');
  const empty = document.getElementById('jf-fav-empty');
  const count = document.getElementById('jf-fav-count-label');

  let visible = 0;
  cards.forEach((card) => {
    const id = card.dataset.id;
    const show = !!id && favs.has(id);
    card.hidden = !show;
    if (show) visible += 1;
  });

  if (grid) grid.hidden = visible === 0;
  if (empty) empty.hidden = visible !== 0;
  if (count) count.textContent = visible + (visible === 1 ? ' veículo favoritado' : ' veículos favoritados');
}

export function initFavoritosPage() {
  applyFilter();
  document.addEventListener(FAVORITES_CHANGED_EVENT, applyFilter);
}
