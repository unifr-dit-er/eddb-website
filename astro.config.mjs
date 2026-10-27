// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output only, served by nginx: no Node.js at run time.
export default defineConfig({
  site: 'https://eddb.unifr.ch',
  output: 'static',
  // French at the root (eddb.unifr.ch/), German and English under /de/ and
  // /en/. NocoDB (/noco) and the showcases keep their own paths on the same
  // domain: never create a page whose path collides with them.
  i18n: {
    locales: ['fr', 'de', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
