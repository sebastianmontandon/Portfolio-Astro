import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

console.log('🔧 Ejecutando post-build script...');

const vercelOutputDir = '.vercel/output';
const configFile = join(vercelOutputDir, 'config.json');

// Verificar que el directorio .vercel/output existe
if (!existsSync(vercelOutputDir)) {
    console.log('📁 Creando directorio .vercel/output...');
    mkdirSync(vercelOutputDir, { recursive: true });
}

// Verificar que config.json existe
if (existsSync(configFile)) {
    console.log('✅ config.json encontrado en:', configFile);

    // Leer el contenido para verificar que es válido
    try {
        const configContent = readFileSync(configFile, 'utf8');
        const config = JSON.parse(configContent);
        console.log('✅ config.json es válido JSON');
        console.log('📊 Rutas configuradas:', config.routes?.length || 0);

        // Verificar que tiene la versión correcta
        if (config.version !== 3) {
            console.log('⚠️  Actualizando versión del config.json...');
            config.version = 3;
            writeFileSync(configFile, JSON.stringify(config, null, 2));
        }

    } catch (error) {
        console.error('❌ Error parseando config.json:', error.message);
        process.exit(1);
    }
} else {
    console.error('❌ config.json no encontrado en:', configFile);
    console.log('📁 Contenido del directorio .vercel/output:');

    try {
        const fs = await import('fs');
        const files = fs.readdirSync(vercelOutputDir);
        files.forEach(file => console.log('  -', file));
    } catch (error) {
        console.log('   (directorio vacío o no existe)');
    }

    process.exit(1);
}

console.log('✅ Post-build script completado exitosamente'); 