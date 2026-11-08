export function brl(n: number): string {
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
}

export function brlDec(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function km(n: number): string {
  return n.toLocaleString('pt-BR') + ' km';
}

/** Condições padrão do financiamento exibido no site (fonte única para cards, detalhe e simulador). */
export const FINANCIAMENTO = { taxaMensal: 0.0159, prazo: 48, entradaPct: 0.2 } as const;

/** Parcela (sistema Price) de um valor financiado, na taxa e prazo informados. */
export function parcela(
  financiado: number,
  taxa: number = FINANCIAMENTO.taxaMensal,
  n: number = FINANCIAMENTO.prazo,
): number {
  const fator = Math.pow(1 + taxa, n);
  return (financiado * taxa * fator) / (fator - 1);
}

/** Parcela estimada (prazo e entrada padrão) usada nos cards de listagem. */
export function parcelaEstimada(preco: number): string {
  return brl(parcela(preco * (1 - FINANCIAMENTO.entradaPct)));
}

export function whatsappLink(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/** Formata um número (com ou sem DDI 55) como "(DDD) XXXXX-XXXX" para exibição. */
export function formatPhone(numero: string): string {
  const digitos = numero.replace(/\D/g, '');
  const semDDI = digitos.startsWith('55') && digitos.length > 11 ? digitos.slice(2) : digitos;
  const ddd = semDDI.slice(0, 2);
  const resto = semDDI.slice(2);
  const corte = resto.length > 8 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}
