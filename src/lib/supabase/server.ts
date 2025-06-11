// @ts-check
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Type-safe environment variables
interface ImportMetaEnv {
  PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  NODE_ENV?: string;
  [key: string]: string | undefined;
}

// Get Supabase URL and Service Role Key from environment variables with type assertion
const env = import.meta.env as unknown as ImportMetaEnv;
const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';

// Type for the Supabase client with database schema
type TypedSupabaseClient = SupabaseClient<Database>;

// Only create the admin client if we're on the server and have the service key
let supabaseAdmin: TypedSupabaseClient | null = null;

// Log environment status for debugging
console.log('Server-side Supabase initialization:', {
  isServer: typeof window === 'undefined',
  hasSupabaseUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  nodeEnv: env.NODE_ENV || 'development'
});

if (typeof window === 'undefined') {
  if (supabaseUrl && supabaseServiceKey) {
    try {
      supabaseAdmin = createClient<Database>(
        supabaseUrl,
        supabaseServiceKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
      console.log('Supabase admin client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase admin client:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error('Failed to initialize Supabase admin client');
    }
  } else {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push('PUBLIC_SUPABASE_URL');
    if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
    
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Helper function to get the admin client with error handling
 * @returns {TypedSupabaseClient} The initialized Supabase admin client
 * @throws {Error} If the admin client is not available
 */
export const getAdminClient = (): TypedSupabaseClient => {
  if (!supabaseAdmin) {
    throw new Error('Admin client is not available. Make sure SUPABASE_SERVICE_ROLE_KEY is set.');
  }
  return supabaseAdmin;
};

/**
 * Type-safe Supabase client for server-side operations
 */
export type { TypedSupabaseClient };

export { supabaseAdmin };
