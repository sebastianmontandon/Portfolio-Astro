// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // Configuración para generación de sitios estáticos
  output: 'server',

  integrations: [tailwind()],

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true,
  },

  // Configuración base
  base: '/',

  // Configuración de build
  build: {
    format: 'file',
  },

  // Configuración de Vite
  vite: {
    // Configuración específica de Vite si es necesaria
  },

  adapter: vercel({
    // Configuración opcional del adaptador
  })
});