import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const token = import.meta.env.ADMIN_TOKEN ?? process.env.ADMIN_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'ADMIN_TOKEN não configurado.' }), { status: 503 });
  }
  if (new URL(request.url).searchParams.get('token') !== token) {
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
