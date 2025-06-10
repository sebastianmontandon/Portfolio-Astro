const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios a limpiar
const directoriesToClean = [
  'node_modules',
  '.astro',
  'dist',
  '.svelte-kit',
  '.vercel',
  '.bolt',
  '.codesandbox',
  'src/.astro',
  'public/_astro'
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
  'yarn-error.log*',
  '*.tmp',
  '*.swp',
  '*.swo',
  '*.bak',
  '*.backup',
  '*.swn'
];

// Extensiones de archivos para buscar código innecesario
const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.astro'];

// Patrones de código innecesario
const unnecessaryCodePatterns = [
  /console\.log\([^)]*\)/g,  // console.log()
  /\/\*\*\*\*+[\s\S]*?\*\*\*\*+\//g,  // Comentarios de bloque con múltiples asteriscos
  /\/\/\s*TODO:.*/g,  // Comentarios TODO
  /\/\/\s*FIXME:.*/g,  // Comentarios FIXME
  /\/\/\s*XXX:.*/g,  // Comentarios XXX
  /\/\/\s*HACK:.*/g,  // Comentarios HACK
  /\/\/\s*NOTE:.*/g,  // Comentarios NOTE
  /\/\/\s*REMOVE:.*/g,  // Comentarios REMOVE
  /\/\/\s*DEBUG:.*/g,  // Comentarios DEBUG
  /import\s+[\w\d\{\s,\}\*]+\s+from\s+['"][\w\d\.\/]+['"]\s*;/g  // Imports no utilizados (esto es básico, se puede mejorar)
];

console.log('🧹 Starting deep project cleanup...');

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
    const files = execSync(`Get-ChildItem -Path . -Recurse -Force -Include ${filePattern} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName`, { shell: 'powershell.exe' })
      .toString()
      .trim()
      .split('\r\n')
      .filter(Boolean);
    
    files.forEach(file => {
      try {
        console.log(`- ${file}`);
        fs.unlinkSync(file);
      } catch (error) {
        console.error(`  Error removing ${file}:`, error.message);
      }
    });
  } catch (error) {
    // Ignorar si no hay archivos que coincidan
  }
});

// Buscar y eliminar código innecesario
console.log('\n🔍 Searching for unnecessary code...');

function processDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory() && !['node_modules', '.git', '.next', '.vercel', 'dist'].includes(file.name)) {
      processDirectory(fullPath);
    } else if (codeExtensions.includes(path.extname(file.name).toLowerCase())) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        unnecessaryCodePatterns.forEach(pattern => {
          content = content.replace(pattern, '');
        });
        
        // Eliminar líneas vacías adicionales
        content = content.replace(/\n{3,}/g, '\n\n');
        
        if (content !== originalContent) {
          console.log(`- Cleaned: ${fullPath}`);
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    }
  });
}

// Procesar directorio src
try {
  processDirectory(path.join(process.cwd(), 'src'));
} catch (error) {
  console.error('Error processing source files:', error.message);
}

// Limpiar dependencias no utilizadas
console.log('\n♻️  Cleaning up dependencies...');
try {
  console.log('Running npm dedupe...');
  execSync('npm dedupe', { stdio: 'inherit' });
  
  console.log('Running npm prune...');
  execSync('npm prune', { stdio: 'inherit' });
  
  console.log('Running npm cache clean...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  console.log('✅ Dependencies cleaned');
} catch (error) {
  console.error('❌ Error cleaning dependencies:', error.message);
}

// Reinstalar dependencias
console.log('\n📦 Reinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies reinstalled');
} catch (error) {
  console.error('❌ Error reinstalling dependencies:', error.message);
}

console.log('\n✨ Deep cleanup completed!');
