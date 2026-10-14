import { defineConfig } from 'vite';

// En producción /assets/* lo sirve dist/assets (copiado por el build de landing), por eso publicDir: false
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/management/' : '/',
  publicDir: command === 'build' ? false : '../public',
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../dist/management', emptyOutDir: true },
}));
