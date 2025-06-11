// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import { loadEnv } from 'vite';

// Load environment variables from .env file
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Log environment variables for debugging (be careful with sensitive data in production)
console.log('Environment variables loaded:', {
  hasSupabaseUrl: !!env.PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!env.PUBLIC_SUPABASE_ANON_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
});

// https://astro.build/config
export default defineConfig({
  // Server output para rutas server-rendered
  output: 'server',

  // Adapter para server-rendered routes
  adapter: node({
    mode: 'standalone'
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
    envPrefix: ['PUBLIC_', 'NEXT_PUBLIC_']
  },

  // Integrations
  integrations: [tailwind()],

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