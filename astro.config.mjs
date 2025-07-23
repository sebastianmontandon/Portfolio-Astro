// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// Load environment variables from .env file
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Log environment variables for debugging (be careful with sensitive data in production)
console.log('Environment variables loaded:', {
  hasSupabaseUrl: !!env.PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!env.PUBLIC_SUPABASE_ANON_KEY,
  hasN8nUrl: !!env.PUBLIC_N8N_WEBHOOK_URL,
  hasN8nUsername: !!env.PUBLIC_N8N_USERNAME,
  hasN8nPassword: !!env.PUBLIC_N8N_PASSWORD,
  nodeEnv: process.env.NODE_ENV || 'development'
});

// https://astro.build/config
export default defineConfig({
  // Server output para API routes y páginas dinámicas
  output: 'server',

  // Adapter de Vercel para serverless functions
  adapter: vercel({
    webAnalytics: { enabled: true },
    edgeMiddleware: false,
    // Configuración específica para Vercel
    maxDuration: 30
  }),

  // Vite configuration
  vite: {
    define: {
      // Environment variables will be automatically loaded by Vite
    },
    server: {
      fs: {
        // Allow serving files from one level up from the package root
        allow: ['..']
      }
    },
    // Explicitly load environment variables
    envPrefix: ['PUBLIC_', 'NEXT_PUBLIC_', 'N8N_'],
    // Configuración para mejor manejo de variables de entorno
    build: {
      rollupOptions: {
        external: []
      }
    }
  },

  // Site URL for sitemap generation
  site: 'https://sebastianmontandon.dev',

  // Integrations
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
    })
  ],

  // Development server configuration
  server: {
    port: 3000,
    host: true,
  },

  // Base URL
  base: '/',

  // Build configuration
  build: {
    format: 'file',
  }
});