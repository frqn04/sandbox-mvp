import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  // Optimizaciones de build que funcionan
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});