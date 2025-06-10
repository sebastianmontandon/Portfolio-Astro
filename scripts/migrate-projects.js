import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { uploadImage } from './upload-image.js';

// Cargar variables de entorno
dotenv.config();

// Configurar Supabase
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.PUBLIC_SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Las variables de entorno PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_SERVICE_ROLE son requeridas');
  process.exit(1);
}

// Crear cliente con la clave de servicio (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Obtener la ruta al archivo projects.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectsPath = join(__dirname, '..', 'src', 'data', 'projects.json');

// Leer y migrar proyectos
async function migrateProjects() {
  try {
    // Leer el archivo JSON
    const projectsData = JSON.parse(readFileSync(projectsPath, 'utf-8'));
    
    console.log(`Encontrados ${projectsData.length} proyectos para migrar`);
    
    // Insertar cada proyecto en Supabase
    for (const project of projectsData) {
      console.log(`Migrando proyecto: ${project.title}`);
      
      // Procesar la imagen
      let imageUrl = project.imageUrl || '';
      
      // Si la imagen es una ruta local, subirla a Supabase Storage
      if (project.imageUrl && !project.imageUrl.startsWith('http')) {
        const imagePath = join(__dirname, '..', 'public', project.imageUrl);
        if (existsSync(imagePath)) {
          try {
            imageUrl = await uploadImage(imagePath, project.title);
            console.log(`Imagen subida para ${project.title}: ${imageUrl}`);
          } catch (error) {
            console.error(`Error al subir la imagen para ${project.title}:`, error.message);
          }
        } else {
          console.warn(`No se encontró la imagen en la ruta: ${imagePath}`);
        }
      }
      
      // Mapear los campos según el esquema de la base de datos
      const projectToInsert = {
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        github_url: project.githubUrl || null,
        live_url: project.liveUrl || null,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert(projectToInsert);
      
      if (error) {
        console.error(`Error al migrar proyecto ${project.title}:`, error);
      } else {
        console.log(`Proyecto migrado exitosamente: ${project.title}`);
      }
    }
    
    console.log('Migración completada');
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar la migración
migrateProjects();
