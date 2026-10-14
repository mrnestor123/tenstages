// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tenstages.app',
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es-ES' } } })],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Hosting sirve frontend/dist; management se compila después en dist/management
  outDir: '../dist',
  build: { inlineStylesheets: 'auto' },
});
