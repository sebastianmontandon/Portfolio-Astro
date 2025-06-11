// @ts-check
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL || '',
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
  try {
    console.log('Testing Supabase connection...');

    // Test a simple query
    const { data, error, status } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        status,
        env: {
          hasUrl: !!import.meta.env.PUBLIC_SUPABASE_URL,
          hasKey: !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
          urlLength: import.meta.env.PUBLIC_SUPABASE_URL?.length || 0,
          keyLength: import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.length || 0,
          nodeEnv: import.meta.env.MODE,
          vercelEnv: process.env.VERCEL_ENV
        }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      projectsCount: data?.length || 0,
      sample: data?.[0] || null,
      env: {
        hasUrl: !!import.meta.env.PUBLIC_SUPABASE_URL,
        hasKey: !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: import.meta.env.MODE,
        vercelEnv: process.env.VERCEL_ENV
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Test error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: import.meta.env.MODE === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      env: {
        hasUrl: !!import.meta.env.PUBLIC_SUPABASE_URL,
        hasKey: !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: import.meta.env.MODE,
        vercelEnv: process.env.VERCEL_ENV
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
}
