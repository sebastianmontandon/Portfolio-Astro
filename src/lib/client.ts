import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Helper function to safely get environment variables
function getEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (value === undefined || value === null) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  // Convert boolean values to string if needed
  return String(value);
}

// Get Supabase configuration from environment variables
const supabaseUrl = getEnvVar('PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('PUBLIC_SUPABASE_ANON_KEY');

// Debug log environment variables
console.log('Supabase Client Initialization:', {
  hasUrl: !!supabaseUrl,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined',
  hasKey: !!supabaseAnonKey,
  keySuffix: supabaseAnonKey ? `...${supabaseAnonKey.slice(-4)}` : 'undefined',
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL
});

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const error = new Error('Missing required Supabase environment variables');
  console.error('Supabase configuration error:', {
    error: error.message,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    availableVars: Object.keys(import.meta.env).filter(k => k.startsWith('PUBLIC_'))
  });
  throw error;
}

// Initialize Supabase client
let supabaseClient;
try {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Failed to initialize Supabase client:', error);
  throw new Error(`Failed to initialize Supabase: ${errorMessage}`);
}

export const supabase = supabaseClient;
export type TypedSupabaseClient = typeof supabase;
