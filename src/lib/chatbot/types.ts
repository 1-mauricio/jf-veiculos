/** Mensagem trocada entre visitante e assistente. Usado tanto no navegador quanto na rota da API. */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Referência a um veículo do estoque, usada para renderizar o botão "Ver anúncio". */
export interface VehicleRef {
  id: string;
  nome: string;
}

/** Formato de resposta devolvido por POST /api/chat. */
export interface ChatApiResponse {
  reply: string;
  ready: boolean;
  resumo: string;
  veiculos: VehicleRef[];
  error?: string;
}
