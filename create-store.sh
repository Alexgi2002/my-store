#!/bin/bash

# Script para crear una nueva tienda
# Uso: ./create-store.sh "nombre-tienda" "dominio.com" "numero-whatsapp"

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 3 ]; then
    echo -e "${RED}Uso: $0 <nombre-tienda> <dominio> <numero-whatsapp>${NC}"
    echo ""
    echo "Ejemplo: $0 tienda-elegante tienda.com +5491234567890"
    exit 1
fi

STORE_NAME="$1"
DOMAIN="$2"
WHATSAPP="$3"

echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Creador de Nueva Tienda${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo ""
echo -e "Tienda: ${GREEN}$STORE_NAME${NC}"
echo -e "Dominio: ${GREEN}$DOMAIN${NC}"
echo -e "WhatsApp: ${GREEN}$WHATSAPP${NC}"
echo ""

# Generar token de admin (32 caracteres aleatorios)
ADMIN_TOKEN=$(openssl rand -base64 32)

# Crear archivo .env
ENV_FILE=".env.${STORE_NAME}"

cat > "$ENV_FILE" << EOF
# ============================================
# TIENDA: $STORE_NAME
# ============================================
STORE_NAME=$STORE_NAME
PORT=3000

# ============================================
# APLICACIÓN
# ============================================
NEXT_PUBLIC_URL="https://$DOMAIN"
NEXT_PUBLIC_WHATSAPP_NUMBER="$WHATSAPP"

# ============================================
# PUSH (VAPID)
# ============================================
# NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY should be set in your deployment environment

# ============================================
# ADMIN
# ============================================
ADMIN_TOKEN="$ADMIN_TOKEN"
EOF

echo ""
echo -e "${GREEN}✓ Archivo creado: $ENV_FILE${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Ejecutar scripts SQL en Supabase:"
echo "   - scripts/001_create_products_table.sql"
echo "   - scripts/002_seed_products.sql"
echo "   - scripts/003_create_banners_table.sql"
echo "   - scripts/004_create_storage_buckets.sql"
echo "   - scripts/005_create_subscriptions_table.sql"
echo ""
echo "2. Desplegar en Portainer:"
echo "   - Crear nuevo Stack"
echo "   - Usar docker-compose.yml"
echo "   - Copiar variables de: $ENV_FILE"
echo ""
echo -e "${GREEN}Contraseña Admin (guardar en lugar seguro):${NC}"
echo "$ADMIN_PASSWORD"
echo ""
echo "Variables listas para copiar a Portainer"
