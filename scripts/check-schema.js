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

async function checkTableSchema() {
  try {
    // Obtener información del esquema de la tabla
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'projects');

    if (error) {
      console.error('Error al obtener el esquema de la tabla:', error);
      return;
    }

    console.log('Columnas en la tabla "projects":');
    console.table(columns);
    
    // Obtener datos de ejemplo
    const { data: sampleData, error: sampleError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('Error al obtener datos de ejemplo:', sampleError);
      return;
    }

    console.log('\nEstructura de datos de ejemplo:');
    console.log(sampleData);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTableSchema();
