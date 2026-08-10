interface Filtros {
  tipo: string;
  marca: string;
  precoMax: number;
  anoMin: number;
  kmMax: number;
  cambio: string;
  combustivel: string;
  cor: string;
  busca: string;
  sort: string;
}

const DEFAULTS: Filtros = {
  tipo: 'todos',
  marca: 'todas',
  precoMax: 200000,
  anoMin: 2016,
  kmMax: 120000,
  cambio: 'todos',
  combustivel: 'todos',
  cor: 'todas',
  busca: '',
  sort: 'recentes',
};

function brl(n: number): string {
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
}

export function initListagem() {
  const grid = document.getElementById('jf-grid');
  const empty = document.getElementById('jf-empty');
  const count = document.getElementById('jf-count');
  const titulo = document.getElementById('jf-titulo');
  const tituloCrumb = document.getElementById('jf-titulo-crumb');
  if (!grid || !empty || !count) return;

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-vehicle-card]'));

  const marcaSelect = document.getElementById('jf-marca') as HTMLSelectElement | null;
  const corSelect = document.getElementById('jf-cor') as HTMLSelectElement | null;
  const sortSelect = document.getElementById('jf-sort') as HTMLSelectElement | null;
  const precoRange = document.getElementById('jf-preco') as HTMLInputElement | null;
  const anoRange = document.getElementById('jf-ano') as HTMLInputElement | null;
  const kmRange = document.getElementById('jf-km') as HTMLInputElement | null;
  const precoVal = document.getElementById('jf-preco-val');
  const anoVal = document.getElementById('jf-ano-val');
  const kmVal = document.getElementById('jf-km-val');
  const limparBtns = [document.getElementById('jf-limpar'), document.getElementById('jf-limpar-2')];
  const filtersAside = document.getElementById('jf-filters');
  const filtersToggle = document.getElementById('jf-filters-toggle');

  filtersToggle?.addEventListener('click', () => {
    const isOpen = filtersAside?.classList.toggle('is-open');
    filtersToggle.setAttribute('aria-expanded', String(!!isOpen));
  });

  const params = new URLSearchParams(window.location.search);
  const state: Filtros = {
    tipo: params.get('tipo') ?? DEFAULTS.tipo,
    marca: params.get('marca') ?? DEFAULTS.marca,
    precoMax: Number(params.get('precoMax') ?? DEFAULTS.precoMax),
    anoMin: Number(params.get('anoMin') ?? DEFAULTS.anoMin),
    kmMax: Number(params.get('kmMax') ?? DEFAULTS.kmMax),
    cambio: params.get('cambio') ?? DEFAULTS.cambio,
    combustivel: params.get('combustivel') ?? DEFAULTS.combustivel,
    cor: params.get('cor') ?? DEFAULTS.cor,
    busca: params.get('busca') ?? DEFAULTS.busca,
    sort: params.get('sort') ?? DEFAULTS.sort,
  };

  function syncControls() {
    document.querySelectorAll<HTMLElement>('[data-chip-group]').forEach((group) => {
      const key = group.dataset.chipGroup as 'tipo' | 'cambio' | 'combustivel';
      group.querySelectorAll<HTMLButtonElement>('.jf-chip-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.value === state[key]);
      });
    });
    if (marcaSelect) marcaSelect.value = state.marca;
    if (corSelect) corSelect.value = state.cor;
    if (sortSelect) sortSelect.value = state.sort;
    if (precoRange) precoRange.value = String(state.precoMax);
    if (anoRange) anoRange.value = String(state.anoMin);
    if (kmRange) kmRange.value = String(state.kmMax);
    if (precoVal) precoVal.textContent = brl(state.precoMax);
    if (anoVal) anoVal.textContent = String(state.anoMin);
    if (kmVal) kmVal.textContent = state.kmMax.toLocaleString('pt-BR') + ' km';
  }

  function updateURL() {
    const p = new URLSearchParams();
    (Object.keys(state) as (keyof Filtros)[]).forEach((k) => {
      if (state[k] !== DEFAULTS[k] && state[k] !== '') p.set(k, String(state[k]));
    });
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }

  function updateTitulo() {
    const label = state.tipo === 'carro' ? 'Carros seminovos' : state.tipo === 'moto' ? 'Motos seminovas' : 'Todos os veículos';
    if (titulo) titulo.textContent = label;
    if (tituloCrumb) tituloCrumb.textContent = label;
  }

  function applyFilters() {
    let visible = cards.filter((card) => {
      const d = card.dataset;
      if (state.tipo !== 'todos' && d.tipo !== state.tipo) return false;
      if (state.marca !== 'todas' && d.marca !== state.marca) return false;
      if (Number(d.preco) > state.precoMax) return false;
      if (Number(d.ano) < state.anoMin) return false;
      if (Number(d.km) > state.kmMax) return false;
      if (state.cambio !== 'todos' && d.cambio !== state.cambio) return false;
      if (state.combustivel !== 'todos' && d.combustivel !== state.combustivel) return false;
      if (state.cor !== 'todas' && d.cor !== state.cor) return false;
      if (state.busca && !d.busca?.includes(state.busca.toLowerCase())) return false;
      return true;
    });

    if (state.sort === 'menor') visible = [...visible].sort((a, b) => Number(a.dataset.preco) - Number(b.dataset.preco));
    else if (state.sort === 'maior') visible = [...visible].sort((a, b) => Number(b.dataset.preco) - Number(a.dataset.preco));
    else if (state.sort === 'km') visible = [...visible].sort((a, b) => Number(a.dataset.km) - Number(b.dataset.km));

    const visibleSet = new Set(visible);
    cards.forEach((card) => {
      card.hidden = !visibleSet.has(card);
    });
    visible.forEach((card) => grid?.appendChild(card));

    const n = visible.length;
    count!.textContent = n + (n === 1 ? ' veículo encontrado' : ' veículos encontrados');
    empty!.hidden = n !== 0;

    updateTitulo();
    updateURL();
  }

  document.querySelectorAll<HTMLElement>('[data-chip-group]').forEach((group) => {
    const key = group.dataset.chipGroup as 'tipo' | 'cambio' | 'combustivel';
    group.querySelectorAll<HTMLButtonElement>('.jf-chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state[key] = btn.dataset.value ?? DEFAULTS[key];
        syncControls();
        applyFilters();
      });
    });
  });

  marcaSelect?.addEventListener('change', () => { state.marca = marcaSelect.value; applyFilters(); });
  corSelect?.addEventListener('change', () => { state.cor = corSelect.value; applyFilters(); });
  sortSelect?.addEventListener('change', () => { state.sort = sortSelect.value; applyFilters(); });

  precoRange?.addEventListener('input', () => {
    state.precoMax = Number(precoRange.value);
    if (precoVal) precoVal.textContent = brl(state.precoMax);
    applyFilters();
  });
  anoRange?.addEventListener('input', () => {
    state.anoMin = Number(anoRange.value);
    if (anoVal) anoVal.textContent = String(state.anoMin);
    applyFilters();
  });
  kmRange?.addEventListener('input', () => {
    state.kmMax = Number(kmRange.value);
    if (kmVal) kmVal.textContent = state.kmMax.toLocaleString('pt-BR') + ' km';
    applyFilters();
  });

  limparBtns.forEach((btn) => btn?.addEventListener('click', () => {
    Object.assign(state, DEFAULTS);
    syncControls();
    applyFilters();
  }));

  syncControls();
  applyFilters();
}
