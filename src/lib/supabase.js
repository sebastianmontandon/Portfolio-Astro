import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

// Configuración
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Necesario para operaciones de administración

// Validar variables de entorno requeridas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan variables de entorno de Supabase. Asegúrate de configurar PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY');
}

// Solo mostrar advertencia si estamos en desarrollo
if (import.meta.env.DEV && !supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY no está configurada. Algunas funciones pueden no estar disponibles.');
}

const JWT_SECRET = new TextEncoder().encode(import.meta.env.JWT_SECRET || 'tu-clave-secreta-segura');

// Constantes de validación
export const UPLOAD_CONFIG = {
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  BUCKET_NAME: 'project-images',
  FOLDER_NAME: 'projects'
};

// Cliente de Supabase para operaciones del lado del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Cliente de Supabase con service role para operaciones administrativas
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

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
