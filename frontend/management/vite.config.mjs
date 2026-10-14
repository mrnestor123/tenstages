import { defineConfig } from 'vite';

export default defineConfig({
  base: '/management/',
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../dist/management', emptyOutDir: true },
});
