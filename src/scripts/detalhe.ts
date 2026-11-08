import { brl, brlDec, parcela } from '../lib/format';

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
    const entradaValor = preco * entradaPct / 100;
    const valorParcela = parcela(preco - entradaValor, undefined, parcelas);
    const total = entradaValor + valorParcela * parcelas;

    if (entradaPctEl) entradaPctEl.textContent = entradaPct + '%';
    if (entradaValorEl) entradaValorEl.textContent = brl(entradaValor);
    if (parcelaValorEl) parcelaValorEl.textContent = brlDec(valorParcela) + ` em ${parcelas}x`;
    if (totalEl) totalEl.textContent = brl(total);
    if (priceParcelaEl) priceParcelaEl.textContent = `ou ${brlDec(valorParcela)} em ${parcelas}x`;
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
