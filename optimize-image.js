import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'public', 'profile-pic.jpg');
const outputPath = path.join(__dirname, 'public', 'profile-pic-optimized.jpg');

async function optimizeImage() {
  try {
    // Optimizar la imagen
    await sharp(inputPath)
      .resize(800) // Redimensionar a un ancho máximo de 800px (puedes ajustar este valor)
      .jpeg({ 
        quality: 80, // Calidad del 80% (equilibrio entre calidad y tamaño)
        mozjpeg: true // Usar compresión mozjpeg para mejor relación calidad/tamaño
      })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    console.log('Optimización completada:');
    console.log(`- Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`- Tamaño optimizado: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`- Ahorro: ${savings}%`);
    
    // Opcional: Reemplazar la imagen original por la optimizada
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    console.log('Imagen optimizada reemplazada exitosamente.');
    
  } catch (error) {
    console.error('Error al optimizar la imagen:', error);
  }
}

optimizeImage().catch(console.error);
