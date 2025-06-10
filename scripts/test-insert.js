import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar Supabase
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY son requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    const testProject = {
      title: 'Proyecto de prueba',
      description: 'Este es un proyecto de prueba para verificar el esquema',
      technologies: ['Test', 'Supabase'],
      github_url: 'https://github.com/test',
      demo_url: 'https://test.com',
      image_url: '/images/test.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Intentando insertar proyecto de prueba...');
    
    const { data, error } = await supabase
      .from('projects')
      .insert([testProject])
      .select();

    if (error) {
      console.error('Error al insertar proyecto de prueba:');
      console.error(error);
      return;
    }

    console.log('Proyecto de prueba insertado exitosamente:');
    console.log(data);
    
    // Limpiar: eliminar el proyecto de prueba
    if (data && data.length > 0) {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', data[0].id);
      
      if (deleteError) {
        console.error('Error al limpiar proyecto de prueba:', deleteError);
      } else {
        console.log('Proyecto de prueba eliminado');
      }
    }
  } catch (error) {
    console.error('Error en testInsert:', error);
  }
}

testInsert();
