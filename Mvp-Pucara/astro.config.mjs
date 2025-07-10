import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    syntaxHighlight: false,
  },
  // En Astro 5.x, Sharp se usa automáticamente cuando está instalado
  // No necesitamos configuración explícita de image service
  server: {
    // Configuración del servidor de desarrollo
    port: 4321, // Puerto personalizado (opcional)
    host: true  // Permite acceso desde otras IPs (opcional)
  },
  vite: {
    css: {
      postcss: {},
    },
    ssr: {
      noExternal: ['shiki'],
    },
  },
});