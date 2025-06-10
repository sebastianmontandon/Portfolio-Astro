import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar Supabase
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.PUBLIC_SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Las variables de entorno son requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Nombre del bucket en Supabase Storage
const BUCKET_NAME = 'project-images';

/**
 * Sube una imagen a Supabase Storage
 * @param {string} imagePath - Ruta local de la imagen
 * @param {string} projectName - Nombre del proyecto (para el nombre del archivo)
 * @returns {Promise<string>} URL pública de la imagen subida
 */
async function uploadImage(imagePath, projectName) {
  try {
    // Leer la imagen como buffer
    const fileBuffer = readFileSync(imagePath);
    
    // Crear un nombre de archivo único
    const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${imagePath.split('.').pop()}`;
    const filePath = `projects/${fileName}`;
    
    console.log(`Subiendo imagen: ${filePath}`);
    
    // Subir la imagen
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: `image/${imagePath.split('.').pop() === 'png' ? 'png' : 'jpeg'}`
      });
    
    if (error) {
      if (error.message.includes('Bucket not found')) {
        console.log('El bucket no existe. Creando...');
        await createBucket();
        // Reintentar la subida después de crear el bucket
        return uploadImage(imagePath, projectName);
      }
      throw error;
    }
    
    // Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    console.log(`Imagen subida correctamente: ${publicUrl}`);
    return publicUrl;
    
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
}

/**
 * Crea un bucket en Supabase Storage si no existe
 */
async function createBucket() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) throw listError;
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creando bucket: ${BUCKET_NAME}`);
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 1024 * 1024 * 5, // 5MB
      });
      
      if (createError) throw createError;
      console.log(`Bucket ${BUCKET_NAME} creado exitosamente`);
    }
  } catch (error) {
    console.error('Error al crear el bucket:', error);
    throw error;
  }
}

export { uploadImage };
