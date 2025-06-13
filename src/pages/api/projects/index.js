// Deshabilitar prerenderizado estático para esta ruta de API
export const prerender = false;

import { projectsService } from '../../../lib/projectsService';
import { requireAuth } from '../../../middleware/auth';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Helper function to handle responses
function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: { ...defaultHeaders, ...headers },
  });
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

// Get all projects (público)
export async function GET() {
  try {
    console.log('API: Fetching projects...');
    
    // Forzar refresh de los datos y limpiar caché
    const projects = await projectsService.getProjects(true);

    // Log the number of projects found
    console.log(`API: Found ${projects?.length || 0} projects`);

    // Always return an array, even if empty
    return jsonResponse({
      success: true,
      data: Array.isArray(projects) ? projects : []
    }, 200, {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

  } catch (error) {
    console.error('API Error fetching projects:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to fetch projects',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, 500);
  }
}

// Crear un nuevo proyecto con imagen (requiere autenticación)
export async function POST(context) {
  try {
    // Verificar autenticación usando el middleware
    const authResponse = await requireAuth(context);
    if (authResponse) {
      // Si hay un error de autenticación, el middleware ya devuelve una Response
      return authResponse;
    }

    // El middleware ya ha verificado la autenticación y añadido el usuario al contexto
    const user = context.locals.user;
    console.log('Usuario autenticado:', user);

    if (!user || !user.userId) {
      return jsonResponse(
        { error: 'Usuario no autenticado correctamente' },
        401
      );
    }

    // Verificar que la solicitud sea multipart/form-data
    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse(
        { error: 'Content-Type must be multipart/form-data' },
        400
      );
    }

    // Parsear el formulario
    const formData = await context.request.formData();

    // Obtener datos del formulario
    const title = formData.get('title');
    const description = formData.get('description');
    const imageFile = formData.get('image');
    const technologies = formData.getAll('technologies') || [];
    const live_url = formData.get('live_url') || '';
    const github_url = formData.get('github_url') || '';
    const category = formData.get('category') || 'Web App';

    // Validar datos requeridos
    if (!title || !description || !imageFile) {
      return jsonResponse(
        { error: 'Title, description, and image are required' },
        400
      );
    }

    // Procesar la imagen
    let imageUrl = '';
    if (imageFile) {
      try {
        // Convertir el archivo a buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const originalSize = buffer.length;

        // Optimizar la imagen con sharp
        const processedImage = await sharp(buffer)
          .resize(1200, 630, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Configuración de Supabase
        const supabase = createClient(
          import.meta.env.PUBLIC_SUPABASE_URL,
          import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: { autoRefreshToken: false, persistSession: false }
          }
        );

        // Subir la imagen a Supabase Storage
        const fileName = `${uuidv4()}.jpg`;
        const filePath = `projects/${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, processedImage, {
            contentType: 'image/jpeg',
            cacheControl: 'public, max-age=31536000',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      } catch (error) {
        console.error('Error procesando la imagen:', error);
        return jsonResponse(
          { error: 'Error al procesar la imagen' },
          500
        );
      }
    }

    // Crear el proyecto con la URL de la imagen
    // Ajustado para usar los nombres de columna correctos de la base de datos
    const projectData = {
      title,
      description,
      image_url: imageUrl, // Asegúrate de que esta columna exista en tu tabla
      technologies,
      live_url,
      github_url,
      category, // Add category field
      // Si tu tabla usa 'author_id' en lugar de 'user_id', cámbialo aquí
      // Si no necesitas guardar el ID del usuario, puedes eliminar esta línea
      // user_id: user.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Datos del proyecto a guardar:', projectData);

    const newProject = await projectsService.createProject(projectData);

    return jsonResponse({
      success: true,
      message: 'Project created successfully',
      data: newProject
    }, 201);
  } catch (error) {
    console.error('Error creating project:', error);
    return jsonResponse(
      { error: error.message || 'Failed to create project' },
      error.status || 500
    );
  }
}
