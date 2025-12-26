#!/bin/sh
set -e

# Entry point for the container.
# - generate a small runtime config for the frontend
# - optionally run prisma migrations if RUN_MIGRATIONS is set
# - exec the CMD (pnpm start)

echo "[entrypoint] Writing manifest.json from environment variables (branding comes from env)"
mkdir -p /app/public

# Debug: mostrar variables de entorno relevantes
echo "[entrypoint] STORE_NAME=${STORE_NAME:-(not set)}"
echo "[entrypoint] STORE_DESCRIPTION=${STORE_DESCRIPTION:-(not set)}"
echo "[entrypoint] STORE_ICON=${STORE_ICON:-(not set)}"
echo "[entrypoint] STORE_ICON_URL=${STORE_ICON_URL:-(not set)}"

# Determinar el icono a usar (prioridad: STORE_ICON > STORE_ICON_URL > default)
ICON_SRC="${STORE_ICON:-${STORE_ICON_URL:-/icon.jpg}}"

# Arreglar URLs que puedan tener problemas de formato (ej: https:/ en lugar de https://)
if echo "$ICON_SRC" | grep -q "^https:/[^/]"; then
  ICON_SRC=$(echo "$ICON_SRC" | sed 's|^https:/|https://|')
  echo "[entrypoint] Fixed icon URL: $ICON_SRC"
fi

# Escapar valores para JSON
# Usar node si está disponible para un escape correcto, sino usar sed básico
escape_json() {
  if command -v node >/dev/null 2>&1; then
    # Usar node para escape JSON correcto
    node -e "console.log(JSON.stringify(process.argv[1]))" "$1" | sed 's/^"//;s/"$//'
  else
    # Fallback: escape básico con sed (puede no manejar perfectamente saltos de línea)
    # Primero backslashes, luego comillas
    echo "$1" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/  */ /g' | sed 's/^ *//;s/ *$//'
  fi
}

# Preparar valores escapados para JSON
STORE_NAME_ESC=$(escape_json "${STORE_NAME:-Mi Tienda}")
SHORT_NAME_ESC=$(escape_json "${SHORT_NAME:-${STORE_NAME:-Tienda}}")
STORE_DESC_ESC=$(escape_json "${STORE_DESCRIPTION:-Encuentra los mejores productos para tu negocio}")
ICON_SRC_ESC=$(escape_json "$ICON_SRC")
WHATSAPP_ESC=$(escape_json "${WHATSAPP_NUMBER:-}")
NEXT_PUBLIC_URL_ESC=$(escape_json "${NEXT_PUBLIC_URL:-http://localhost:3000}")
VAPID_KEY_ESC=$(escape_json "${NEXT_PUBLIC_VAPID_PUBLIC_KEY:-}")

# Debug: mostrar valores escapados
echo "[entrypoint] STORE_DESCRIPTION (escaped): ${STORE_DESC_ESC}"

# Write a manifest.json based on environment variables so installed shortcut (PWA) uses the
# container-provided name and icon. This overwrites the static file in /public at container start.
cat > /app/public/manifest.json <<EOF
{
  "name": "${STORE_NAME_ESC}",
  "short_name": "${SHORT_NAME_ESC}",
  "description": "${STORE_DESC_ESC}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "${BACKGROUND_COLOR:-#ffffff}",
  "theme_color": "${THEME_COLOR:-#000000}",
  "icons": [
    {
      "src": "${ICON_SRC_ESC}",
      "sizes": "any",
      "type": "image/png"
    }
  ]
}
EOF

echo "[entrypoint] manifest.json written to /app/public/manifest.json"

# Write runtime-config.js for frontend
echo "[entrypoint] Writing runtime-config.js from environment variables"
cat > /app/public/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  "NEXT_PUBLIC_URL": "${NEXT_PUBLIC_URL_ESC}",
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY": "${VAPID_KEY_ESC}",
  "STORE_NAME": "${STORE_NAME_ESC}",
  "STORE_DESCRIPTION": "${STORE_DESC_ESC}",
  "STORE_ICON": "${ICON_SRC_ESC}",
  "STORE_OG_IMAGE": "${STORE_OG_IMAGE:-${STORE_OG_IMAGE_URL:-${ICON_SRC_ESC}}}",
  "WHATSAPP_NUMBER": "${WHATSAPP_ESC}"
};
EOF

# Also write runtime-config.json for compatibility
cat > /app/public/runtime-config.json <<EOF
{
  "NEXT_PUBLIC_URL": "${NEXT_PUBLIC_URL_ESC}",
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY": "${VAPID_KEY_ESC}",
  "STORE_NAME": "${STORE_NAME_ESC}",
  "STORE_DESCRIPTION": "${STORE_DESC_ESC}",
  "STORE_ICON": "${ICON_SRC_ESC}",
  "STORE_OG_IMAGE": "${STORE_OG_IMAGE:-${STORE_OG_IMAGE_URL:-${ICON_SRC_ESC}}}",
  "WHATSAPP_NUMBER": "${WHATSAPP_ESC}"
}
EOF

echo "[entrypoint] runtime-config.js and runtime-config.json written to /app/public/"

# Run Prisma migrations automatically on container start (safe no-op if nothing to apply)
echo "[entrypoint] Running Prisma migrations (deploy) if any..."
# Call the direct deploy command to avoid accidentally invoking a package.json 'prisma:migrate' dev script.
# Try npx first (works even if pnpm script alias exists), then try pnpm exec as fallback.
if command -v npx >/dev/null 2>&1; then
  npx prisma migrate deploy || true
elif command -v pnpm >/dev/null 2>&1; then
  pnpm exec prisma migrate deploy || true
else
  echo "[entrypoint] prisma CLI not found; skipping migrations"
fi

# Start the app
echo "[entrypoint] Starting app: $@"
exec "$@"
