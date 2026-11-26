// Netlify Image CDN redimensiona e entrega AVIF/WebP conforme o navegador. Em dev serve o original.
export function img(src: string, w: number): string {
  if (!import.meta.env.PROD || !src.startsWith('/')) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&q=75`;
}

export function srcset(src: string, widths: number[]): string {
  return widths.map((w) => `${img(src, w)} ${w}w`).join(', ');
}
