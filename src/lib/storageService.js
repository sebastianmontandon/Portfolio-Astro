import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'projects';

export const storageService = {
  // Subir un archivo a Supabase Storage
  async uploadFile(file, fileName, path = '') {
    try {
      // Verificar si el bucket existe, si no, crearlo
      const { data: buckets, error: bucketError } = await supabase.storage
        .listBuckets();

      if (bucketError) throw bucketError;

      const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

      if (!bucketExists) {
        const { error: createError } = await supabase.storage
          .createBucket(BUCKET_NAME, { public: true });
        
        if (createError) throw createError;
      }

      // Subir el archivo
      const filePath = path ? `${path}/${fileName}` : fileName;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        success: true,
        path: data.path,
        publicUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Eliminar un archivo
  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
