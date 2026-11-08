import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { createHash, timingSafeEqual } from 'node:crypto';

export const prerender = false;

/** Compara dois segredos em tempo constante (o hash iguala o tamanho e evita vazar o comprimento). */
function tokenMatches(received: string, expected: string): boolean {
  const a = createHash('sha256').update(received).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/** O token vai no header `Authorization: Bearer <token>`, nunca na URL (URLs ficam em logs e no histórico). */
export const GET: APIRoute = async ({ request }) => {
  const token = import.meta.env.ADMIN_TOKEN ?? process.env.ADMIN_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'ADMIN_TOKEN não configurado.' }), { status: 503 });
  }
  const header = request.headers.get('authorization') ?? '';
  const received = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!received || !tokenMatches(received, token)) {
    return new Response(JSON.stringify({ error: 'Não autorizado.' }), { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Number(params.get('page')) || 1);
  const pageSize = 20;

  const store = getStore('chat-logs');
  const { blobs } = await store.list();
  const keys = blobs.map((b) => b.key).reverse(); // chave começa com ISO date -> mais recente primeiro
  const totalPages = Math.max(1, Math.ceil(keys.length / pageSize));
  const pageKeys = keys.slice((page - 1) * pageSize, page * pageSize);
  const conversas = await Promise.all(pageKeys.map((k) => store.get(k, { type: 'json' })));

  return new Response(JSON.stringify({ conversas, page, totalPages, total: keys.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
