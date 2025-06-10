const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios a limpiar
const directoriesToClean = [
  'node_modules',
  '.astro',
  'dist',
  '.svelte-kit',
  'src/.astro'
];

// Archivos a eliminar
const filesToRemove = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*'
];

console.log('🧹 Starting project cleanup...');

// Limpiar directorios
console.log('\n🗑️  Removing directories:');
directoriesToClean.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`- ${dir}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
});

// Eliminar archivos
console.log('\n🗑️  Removing files:');
filesToRemove.forEach(filePattern => {
  try {
    const files = execSync(`find . -name "${filePattern}"`).toString().trim().split('\n');
    files.forEach(file => {
      if (file) {
        console.log(`- ${file}`);
        fs.unlinkSync(file);
      }
    });
  } catch (error) {
    // Ignorar si no hay archivos que coincidan
  }
});

// Limpiar dependencias de npm
console.log('\n♻️  Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleaned');
} catch (error) {
  console.error('❌ Error cleaning npm cache:', error.message);
}

// Reinstalar dependencias
console.log('\n📦 Reinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies reinstalled');
} catch (error) {
  console.error('❌ Error reinstalling dependencies:', error.message);
}

console.log('\n✨ Project cleanup completed!');
