import type { VehicleRef } from './types';

export interface ParsedReply {
  reply: string;
  ready: boolean;
  resumo: string;
  veiculos: VehicleRef[];
  /** Tipo de veículo que a pessoa quer ser avisada quando chegar no estoque ('carro'/'moto'), ou '' se não pediu. */
  interesseTipo: 'carro' | 'moto' | '';
}

const FALLBACK_REPLY = 'Desculpe, não consegui entender. Pode reformular?';

/**
 * Interpreta o JSON bruto devolvido pelo modelo e o valida contra o estoque real:
 * qualquer `veiculoId` que não exista em `vehicleNames` é descartado, então a IA nunca
 * consegue linkar (ou "confirmar") um veículo inventado.
 */
export function parseAssistantReply(raw: string, vehicleNames: Map<string, string>): ParsedReply {
  const result: ParsedReply = { reply: FALLBACK_REPLY, ready: false, resumo: '', veiculos: [], interesseTipo: '' };
  if (!raw) return result;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    result.reply = raw;
    return result;
  }

  if (typeof parsed !== 'object' || parsed === null) return result;
  const obj = parsed as Record<string, unknown>;

  if (typeof obj.reply === 'string') result.reply = obj.reply;
  if (typeof obj.ready === 'boolean') result.ready = obj.ready;
  if (typeof obj.resumo === 'string') result.resumo = obj.resumo;
  if (obj.interesseTipo === 'carro' || obj.interesseTipo === 'moto') result.interesseTipo = obj.interesseTipo;

  if (Array.isArray(obj.veiculoIds)) {
    const seen = new Set<string>();
    for (const id of obj.veiculoIds) {
      if (typeof id === 'string' && vehicleNames.has(id) && !seen.has(id)) {
        seen.add(id);
        result.veiculos.push({ id, nome: vehicleNames.get(id)! });
      }
    }
  }

  return result;
}
