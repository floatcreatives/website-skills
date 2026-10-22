// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // Set the real client domain before deploy — affects sitemap + canonical URLs.
  site: 'https://example.com',
  integrations: [sitemap(), icon()],
  vite: { plugins: [tailwindcss()] },
});
