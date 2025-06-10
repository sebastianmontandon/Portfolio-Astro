import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const supabaseUrl = "https://uxbwxuvynchiyobdjuca.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Ynd4dXZ5bmNoaXlvYmRqdWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MTE4ODksImV4cCI6MjA2NTA4Nzg4OX0.LNaNCw7DmleGB_oP81VOSauXsLV1R3L-WKms-PAzJw8";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Ynd4dXZ5bmNoaXlvYmRqdWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUxMTg4OSwiZXhwIjoyMDY1MDg3ODg5fQ.YaAGKxyFBw5wOkbQ1RxvmEZb_Vr_xk6eG5SDJkV2Ne8";
const JWT_SECRET = new TextEncoder().encode("tu-clave-secreta-segura");
const UPLOAD_CONFIG = {
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  // 5MB
  BUCKET_NAME: "project-images",
  FOLDER_NAME: "projects"
};
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) ;
const verifyAuth = async (token) => {
  try {
    if (!token) {
      return { user: null, error: new Error("No se proporcionó token de autenticación") };
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.userId) {
      return { user: null, error: new Error("Token inválido: falta el ID de usuario") };
    }
    if (!supabaseAdmin) {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) {
          return {
            user: null,
            error: userError || new Error("Usuario no encontrado")
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
        console.error("Error al verificar usuario con cliente normal:", error);
        throw error;
      }
    }
    try {
      const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(payload.userId);
      if (error || !user) {
        return {
          user: null,
          error: error || new Error("Usuario no encontrado")
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
      console.error("Error con cliente de administración, intentando con cliente normal:", adminError);
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return {
          user: null,
          error: userError || new Error("No se pudo verificar el usuario")
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
    console.error("Error en verificación de autenticación:", error);
    return {
      user: null,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
};
const logAuditEvent = async ({ userId, action, entity, metadata = {} }) => {
  const { data, error } = await supabase.from("audit_logs").insert([{
    user_id: userId,
    action,
    entity,
    metadata,
    ip_address: metadata.ipAddress || null,
    user_agent: metadata.userAgent || null
  }]).select().single();
  return { data, error };
};

export { UPLOAD_CONFIG as U, supabaseAdmin as a, logAuditEvent as l, supabase as s, verifyAuth as v };
