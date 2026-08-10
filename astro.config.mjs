// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: trocar pelo domínio real antes de publicar (usado em canonical/OG/sitemap).
  site: 'https://jfveiculos.example.com',
  integrations: [sitemap()],
});
