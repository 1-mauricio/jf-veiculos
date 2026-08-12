import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from './config';

interface Bucket {
  count: number;
  resetAt: number;
}

/** Estado em memória (reseta a cada cold start da function). Suficiente para um freio simples de abuso. */
const buckets = new Map<string, Bucket>();

/** Retorna `true` quando o IP excedeu o limite de requisições na janela atual. */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}
