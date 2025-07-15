import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'hybrid',
  adapter: vercel(),
  // Optimizaciones de build que funcionan
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});