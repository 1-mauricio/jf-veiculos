function brl(n: number): string {
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
}
function brlDec(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function initGaleria() {
  const hero = document.getElementById('jf-galeria-hero') as HTMLImageElement | null;
  const thumbs = Array.from(document.querySelectorAll<HTMLElement>('[data-thumb]'));
  if (!hero || thumbs.length === 0) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      if (src) hero.src = src;
      thumbs.forEach((t) => t.classList.toggle('is-active', t === thumb));
    });
  });
}

export function initSimulador(preco: number) {
  const root = document.getElementById('jf-sim');
  if (!root) return;

  const entradaRange = document.getElementById('jf-sim-entrada') as HTMLInputElement;
  const entradaPctEl = document.getElementById('jf-sim-entrada-pct');
  const entradaValorEl = document.getElementById('jf-sim-entrada-valor');
  const parcelaValorEl = document.getElementById('jf-sim-parcela-valor');
  const totalEl = document.getElementById('jf-sim-total');
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-parcelas]'));
  const priceParcelaEl = document.getElementById('jf-price-parcela');

  let entradaPct = Number(entradaRange?.value ?? 20);
  let parcelas = Number(chips.find((c) => c.classList.contains('is-active'))?.dataset.parcelas ?? 48);

  function recalc() {
    const i = 0.0159;
    const entradaValor = preco * entradaPct / 100;
    const fin = preco - entradaValor;
    const parcela = (fin * (i * Math.pow(1 + i, parcelas))) / (Math.pow(1 + i, parcelas) - 1);
    const total = entradaValor + parcela * parcelas;

    if (entradaPctEl) entradaPctEl.textContent = entradaPct + '%';
    if (entradaValorEl) entradaValorEl.textContent = brl(entradaValor);
    if (parcelaValorEl) parcelaValorEl.textContent = brlDec(parcela) + ` em ${parcelas}x`;
    if (totalEl) totalEl.textContent = brl(total);
    if (priceParcelaEl) priceParcelaEl.textContent = `ou ${brlDec(parcela)} em ${parcelas}x`;
  }

  entradaRange?.addEventListener('input', () => {
    entradaPct = Number(entradaRange.value);
    recalc();
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      parcelas = Number(chip.dataset.parcelas);
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      recalc();
    });
  });

  recalc();
}
