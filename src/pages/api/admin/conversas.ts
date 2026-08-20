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

  const store = getStore('chat-logs');
  const { blobs } = await store.list();
  const conversas = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));

  return new Response(JSON.stringify(conversas.reverse()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
