# Script para crear una nueva tienda (Windows)
# Uso: .\create-store.ps1 -StoreName "nombre-tienda" -Domain "dominio.com" -WhatsApp "+5491234567890"

param(
    [Parameter(Mandatory=$true)]
    [string]$StoreName,
    
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$true)]
    [string]$WhatsApp
)

Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║       Creador de Nueva Tienda             ║" -ForegroundColor Yellow
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tienda: " -NoNewline
Write-Host $StoreName -ForegroundColor Green
Write-Host "Dominio: " -NoNewline
Write-Host $Domain -ForegroundColor Green
Write-Host "WhatsApp: " -NoNewline
Write-Host $WhatsApp -ForegroundColor Green
Write-Host ""

# Generar token admin
$bytes = @(0..31 | ForEach-Object { [byte](Get-Random -Maximum 256) })
$AdminToken = [Convert]::ToBase64String($bytes)

# Crear archivo .env
$EnvFile = ".env.$StoreName"

$content = @"
# ============================================
# TIENDA: $StoreName
# ============================================
STORE_NAME=$StoreName
PORT=3000

# ============================================
# APLICACIÓN
# ============================================
NEXT_PUBLIC_URL="https://$Domain"
NEXT_PUBLIC_WHATSAPP_NUMBER="$WhatsApp"

# ============================================
# PUSH (VAPID)
# ============================================
# NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY should be set in your deployment environment

# ============================================
# ADMIN
# ============================================
ADMIN_TOKEN="$AdminToken"
"@

Set-Content -Path $EnvFile -Value $content

Write-Host "✓ Archivo creado: $EnvFile" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ajustar DATABASE_URL en Portainer para apuntar a su Postgres/Postgres cluster" 
Write-Host "2. Ejecutar migraciones de Prisma localmente o en el entorno (pnpm prisma:migrate)"
Write-Host "   - Las migraciones usan el contenido de /prisma/schema.prisma"
Write-Host "3. Desplegar en Portainer:" 
Write-Host "   - Crear nuevo Stack"
Write-Host "   - Usar docker-compose.yml"
Write-Host "   - Copiar variables de: $EnvFile"
Write-Host ""
Write-Host "Token Admin (guardar en lugar seguro):" -ForegroundColor Green
Write-Host $AdminToken
Write-Host ""
Write-Host "Variables listas para copiar a Portainer"
