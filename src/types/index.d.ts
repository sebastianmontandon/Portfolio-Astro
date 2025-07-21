// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url: string;
  category?: string;
  is_featured: boolean;
  slug: string;
  content?: string;
  demo_video_url?: string;
  tags?: string[];
  featured_image?: string;
  gallery?: string[];
  published: boolean;
  published_at?: string;
  ai_assisted: boolean;
  in_development: boolean;
  project_type: 'personal' | 'paid'; // Nueva propiedad para distinguir proyectos personales vs pagados
  created_at: string;
  updated_at: string;
  [key: string]: any; // For any additional fields
}

// User types
export interface User {
  id: string;
  email: string;
  role?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // For any additional fields
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Auth types
export interface AuthResponse {
  user: User | null;
  session: {
    access_token: string;
    refresh_token: string;
  } | null;
  error?: string;
}

// File upload types
export interface FileUploadResponse {
  path: string;
  fullPath: string;
  publicUrl: string;
  error?: string;
}

// Environment variables
export interface ImportMetaEnv {
  PUBLIC_SUPABASE_URL: string;
  PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
  [key: string]: string | undefined;
}

// Extend the global namespace to include our environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }
}
