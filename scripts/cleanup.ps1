Write-Host "🧹 Starting project cleanup..." -ForegroundColor Cyan

# Directorios a limpiar
$directoriesToClean = @(
    "node_modules",
    ".astro",
    "dist",
    ".svelte-kit",
    "src\.astro"
)

# Archivos a eliminar
$filesToRemove = @(
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "*.log"
)

# Limpiar directorios
Write-Host "`n🗑️  Removing directories:" -ForegroundColor Yellow
foreach ($dir in $directoriesToClean) {
    if (Test-Path $dir) {
        Write-Host "- $dir"
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Eliminar archivos
Write-Host "`n🗑️  Removing files:" -ForegroundColor Yellow
foreach ($file in $filesToRemove) {
    Get-ChildItem -Path . -Filter $file -Recurse -File | ForEach-Object {
        Write-Host "- $($_.FullName)"
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
}

# Limpiar caché de npm
Write-Host "`n♻️  Cleaning npm cache..." -ForegroundColor Cyan
try {
    npm cache clean --force
    Write-Host "✅ npm cache cleaned" -ForegroundColor Green
} catch {
    Write-Host "❌ Error cleaning npm cache: $_" -ForegroundColor Red
}

# Reinstalar dependencias
Write-Host "`n📦 Reinstalling dependencies..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "✅ Dependencies reinstalled" -ForegroundColor Green
} catch {
    Write-Host "❌ Error reinstalling dependencies: $_" -ForegroundColor Red
}

Write-Host "`n✨ Project cleanup completed!" -ForegroundColor Green
