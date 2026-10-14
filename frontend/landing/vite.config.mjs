import { defineConfig } from 'vite';

// ponytail: se reemplaza por Astro; mientras tanto la landing sigue siendo Mithril + Vite.
// Va primero en el build: emptyOutDir limpia dist/ y management se añade en dist/management
export default defineConfig({
  publicDir: '../public',
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../dist', emptyOutDir: true },
});
