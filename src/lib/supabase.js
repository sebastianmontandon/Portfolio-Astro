import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Get environment variables with fallback for both Vite and Node.js environments
const getEnv = (key, defaultValue = '') => {
  // In the browser, we can only access import.meta.env
  if (isBrowser) {
    return import.meta.env[key] || defaultValue;
  }
  // In Node.js server environments, try both import.meta.env and process.env
  try {
    // In Astro, import.meta.env is available in both client and server
    if (import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Fallback to process.env if import.meta.env is not available
  }
  return process.env[key] || defaultValue;
};

// Get Supabase configuration
const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

// Debug logging
console.log('Supabase.js configuration:', {
  isBrowser,
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceRoleKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined'
});

// Validate environment variables
const validateConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = 'Missing Supabase environment variables. Please check your configuration.';
    console.error(errorMessage);
    console.error('Supabase URL:', supabaseUrl);
    console.error('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined');

    if (isBrowser) {
      console.error('Supabase URL:', supabaseUrl);
      console.error('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined');
    } else {
      console.error('Supabase URL:', supabaseUrl);
      console.error('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined');
    }

    throw new Error(errorMessage);
  }
};

// Create Supabase client with validation
let supabase;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Cannot create Supabase client: missing environment variables');
    console.error(`URL available: ${!!supabaseUrl}, Key available: ${!!supabaseAnonKey}`);
    throw new Error('Missing Supabase environment variables');
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      // Add custom headers if needed
      headers: {}
    }
  });

  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a dummy client to prevent import errors
  supabase = {
    from: () => ({ select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }) })
  };
}

export { supabase };

// Admin client (server-side only)
let supabaseAdmin = null;

if (!isBrowser && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Validate configuration on module load
if (typeof window === 'undefined') {
  try {
    validateConfig();
  } catch (error) {
    console.error('Supabase configuration error:', error.message);
  }
}

export { supabaseAdmin };

// Constantes de validación
export const UPLOAD_CONFIG = {
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  BUCKET_NAME: 'project-images',
  FOLDER_NAME: 'projects'
};

const JWT_SECRET = new TextEncoder().encode(getEnv('JWT_SECRET') || 'tu-clave-secreta-segura');

/**
 * Verifica si el usuario está autenticado usando JWT
 * @param {string} token - Token JWT del usuario
 * @returns {Promise<{user: Object|null, error: Error|null}>}
 */
export const verifyAuth = async (token) => {
  try {
    if (!token) {
      return { user: null, error: new Error('No se proporcionó token de autenticación') };
    }

    // Verificar el token JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload || !payload.userId) {
      return { user: null, error: new Error('Token inválido: falta el ID de usuario') };
    }

    // Si no hay cliente de administración, verificar usando el cliente normal
    if (!supabaseAdmin) {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
          return {
            user: null,
            error: userError || new Error('Usuario no encontrado')
          };
        }

        return {
          user: {
            id: user.id,
            email: user.email
          },
          error: null
        };
      } catch (error) {
        console.error('Error al verificar usuario con cliente normal:', error);
        throw error;
      }
    }

    // Usar el cliente de administración si está disponible
    try {
      const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(payload.userId);

      if (error || !user) {
        return {
          user: null,
          error: error || new Error('Usuario no encontrado')
        };
      }

      return {
        user: {
          id: user.user.id,
          email: user.user.email
        },
        error: null
      };
    } catch (adminError) {
      console.error('Error con cliente de administración, intentando con cliente normal:', adminError);

      // Fallback al cliente normal si falla el de administración
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        return {
          user: null,
          error: userError || new Error('No se pudo verificar el usuario')
        };
      }

      return {
        user: {
          id: user.id,
          email: user.email
        },
        error: null
      };
    }
  } catch (error) {
    console.error('Error en verificación de autenticación:', error);
    return {
      user: null,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
};

/**
 * Registra un evento de auditoría
 * @param {Object} params - Parámetros del evento
 * @param {string} params.userId - ID del usuario
 * @param {string} params.action - Acción realizada
 * @param {string} params.entity - Entidad afectada
 * @param {Object} params.metadata - Metadatos adicionales
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const logAuditEvent = async ({ userId, action, entity, metadata = {} }) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([{
      user_id: userId,
      action,
      entity,
      metadata,
      ip_address: metadata.ipAddress || null,
      user_agent: metadata.userAgent || null
    }])
    .select()
    .single();

  return { data, error };
};
