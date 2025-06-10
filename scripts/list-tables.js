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

async function listTables() {
  try {
    // Obtener todas las tablas usando una consulta SQL directa
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.error('Error al listar tablas (intentando método alternativo):', error);
      
      // Método alternativo: intentar obtener información de la tabla pg_tables
      const { data: pgTables, error: pgError } = await supabase
        .from('pg_tables')
        .select('*')
        .eq('schemaname', 'public');
        
      if (pgError) {
        console.error('Error al consultar pg_tables:', pgError);
        return;
      }
      
      console.log('Tablas en la base de datos:');
      console.table(pgTables);
      return;
    }
    
    console.log('Tablas en la base de datos:');
    console.table(data);
    
  } catch (error) {
    console.error('Error al listar tablas:', error);
  }
}

listTables();
