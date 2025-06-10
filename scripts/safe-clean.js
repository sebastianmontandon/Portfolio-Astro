const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios a limpiar (solo directorios generados)
const directoriesToClean = [
  '.astro',
  'dist',
  '.svelte-kit',
  'public/_astro'
];

// Archivos temporales a eliminar
const filesToRemove = [
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  '*.tmp',
  '*.swp',
  '*.swo',
  '*.bak',
  '*.backup',
  '*.swn',
  'Thumbs.db',
  '.DS_Store'
];

console.log('🧹 Starting safe project cleanup...');

// Limpiar directorios generados
console.log('\n🗑️  Cleaning build directories:');
directoriesToClean.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`- ${dir}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
});

// Eliminar archivos temporales
console.log('\n🗑️  Removing temporary files:');
filesToRemove.forEach(filePattern => {
  try {
    // Usar PowerShell para encontrar archivos que coincidan con el patrón
    const command = `Get-ChildItem -Path . -Recurse -Force -Include ${filePattern} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName`;
    const files = execSync(`powershell.exe -Command "${command}"`)
      .toString()
      .trim()
      .split('\r\n')
      .filter(Boolean);
    
    files.forEach(file => {
      try {
        // No eliminar archivos en node_modules ni .git
        if (!file.includes('node_modules') && !file.includes('\.git')) {
          console.log(`- ${file}`);
          fs.unlinkSync(file);
        }
      } catch (error) {
        console.error(`  Error removing ${file}:`, error.message);
      }
    });
  } catch (error) {
    // Ignorar errores
  }
});

// Limpiar caché de npm
console.log('\n♻️  Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleaned');
} catch (error) {
  console.error('❌ Error cleaning npm cache:', error.message);
}

// Verificar dependencias
console.log('\n🔍 Verifying dependencies...');
try {
  console.log('Running npm dedupe...');
  execSync('npm dedupe', { stdio: 'inherit' });
  
  console.log('Running npm prune...');
  execSync('npm prune', { stdio: 'inherit' });
  
  console.log('✅ Dependencies verified');
} catch (error) {
  console.error('❌ Error verifying dependencies:', error.message);
}

// Reinstalar dependencias si es necesario
console.log('\n📦 Reinstalling dependencies...');
try {
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled');
  } else {
    console.log('✅ Dependencies are already installed');
  }
} catch (error) {
  console.error('❌ Error reinstalling dependencies:', error.message);
}

console.log('\n✨ Safe cleanup completed!');
