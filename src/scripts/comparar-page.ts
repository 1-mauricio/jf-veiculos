import { pruneFavorites, FAVORITES_CHANGED_EVENT } from './favorites';

function applyFilter() {
  const cells = document.querySelectorAll<HTMLElement>('[data-vehicle-cell]');
  const validIds = [...new Set([...cells].map((c) => c.dataset.id).filter((id): id is string => !!id))];
  const favs = pruneFavorites(validIds);
  const scroll = document.getElementById('jf-cmp-scroll');
  const empty = document.getElementById('jf-cmp-empty');

  cells.forEach((cell) => {
    cell.hidden = !(cell.dataset.id && favs.has(cell.dataset.id));
  });

  const show = favs.size >= 2;
  if (scroll) scroll.hidden = !show;
  if (empty) empty.hidden = show;
}

export function initComparar() {
  applyFilter();
  document.addEventListener(FAVORITES_CHANGED_EVENT, applyFilter);
}
