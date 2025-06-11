/**
 * Configuration constants for file uploads and validations
 */

export const UPLOAD_CONFIG = {
  // Allowed MIME types for uploads
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  
  // Maximum file size (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  
  // Storage bucket names
  BUCKETS: {
    PROJECT_IMAGES: 'project-images',
    USER_AVATARS: 'user-avatars',
    DOCUMENTS: 'documents'
  },
  
  // Default folders
  FOLDERS: {
    PROJECTS: 'projects',
    USERS: 'users',
    TEMP: 'temp'
  }
};

/**
 * Default error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No estás autorizado para realizar esta acción',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación',
  SERVER_ERROR: 'Error del servidor',
  RATE_LIMIT_EXCEEDED: 'Has excedido el límite de solicitudes',
  MAINTENANCE_MODE: 'El sistema está en mantenimiento',
  FEATURE_DISABLED: 'Esta característica está deshabilitada'
};

/**
 * User roles and permissions
 */
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
  GUEST: 'guest'
};

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};
