export function brl(n: number): string {
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
}

export function brlDec(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function km(n: number): string {
  return n.toLocaleString('pt-BR') + ' km';
}

/** Parcela estimada (48x, entrada de 20%) usada nos cards de listagem. */
export function parcelaEstimada(preco: number): string {
  const i = 0.0159;
  const n = 48;
  const financiado = preco * 0.8;
  return brl(financiado * i / (1 - Math.pow(1 + i, -n)));
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
