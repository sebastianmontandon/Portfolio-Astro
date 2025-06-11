// Re-export everything from client and server
import { supabase, getSupabaseClient, type TypedSupabaseClient as ClientType } from './client';
import { supabaseAdmin, getAdminClient, type TypedSupabaseClient as AdminClientType } from './server';

export {
  // Client exports
  supabase,
  getSupabaseClient,
  
  // Server/admin exports
  supabaseAdmin,
  getAdminClient,
  
  // Types
  type ClientType,
  type AdminClientType,
};

// Export types
export type { Database } from '@/types/supabase';

// Export auth utilities
export * from './auth';

// Export constants
export * from './constants';
