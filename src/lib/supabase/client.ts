// @ts-check
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Type-safe environment variables
interface ImportMetaEnv {
  PUBLIC_SUPABASE_URL: string;
  PUBLIC_SUPABASE_ANON_KEY: string;
  [key: string]: string | undefined;
}

// Get Supabase URL and Anon Key from environment variables with type assertion
const env = import.meta.env as unknown as ImportMetaEnv;
const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || '';

// Type for the Supabase client with database schema
type TypedSupabaseClient = SupabaseClient<Database>;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables. Please check your configuration.';
  
  if (typeof window !== 'undefined') {
    console.error(errorMessage);
    console.error('Supabase URL:', supabaseUrl);
    console.error('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined');
  } else {
    console.error(errorMessage);
  }
}

// Create and export the Supabase client
export const supabase: TypedSupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Helper function to safely access Supabase client
 * @returns {TypedSupabaseClient} The initialized Supabase client
 * @throws {Error} If the client is not properly initialized
 */
export const getSupabaseClient = (): TypedSupabaseClient => {
  if (!supabase) {
    throw new Error('Supabase client is not properly initialized. Check your environment variables.');
  }
  return supabase;
};

// Export the typed client type
export type { TypedSupabaseClient };
