/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
  // Astro built-in env vars
  readonly MODE: 'development' | 'production' | string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
  
  // Project env vars
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  
  // Email configuration
  readonly EMAIL_USER?: string;
  readonly EMAIL_PASSWORD?: string;
  readonly EMAIL_RECIPIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
