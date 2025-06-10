import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Anon Key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectsDates() {
  console.log('Obteniendo proyectos ordenados por fecha de creación...');
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener proyectos:', error);
    return;
  }

  console.log('\nProyectos ordenados por fecha de creación (más recientes primero):');
  console.log('----------------------------------------');
  
  projects.forEach(project => {
    console.log(`ID: ${project.id}`);
    console.log(`Título: ${project.title}`);
    console.log(`Creado: ${project.created_at}`);
    console.log(`Actualizado: ${project.updated_at}`);
    console.log('----------------------------------------');
  });
}

checkProjectsDates();
