// @ts-check
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Service Role Key from environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only create the admin client if we're on the server and have the service key
let supabaseAdmin = null;

if (typeof window === 'undefined' && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else if (typeof window === 'undefined') {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin features will be limited.');
}

export { supabaseAdmin };

// Helper function to get the admin client with error handling
export const getAdminClient = () => {
  if (!supabaseAdmin) {
    throw new Error('Admin client is not available. Make sure SUPABASE_SERVICE_ROLE_KEY is set.');
  }
  return supabaseAdmin;
};
