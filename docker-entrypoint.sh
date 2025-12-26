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

# Escapar valores para JSON (escapar comillas dobles y backslashes)
escape_json() {
  echo "$1" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g'
}

# Preparar valores escapados para JSON
STORE_NAME_ESC=$(escape_json "${STORE_NAME:-Mi Tienda}")
SHORT_NAME_ESC=$(escape_json "${SHORT_NAME:-${STORE_NAME:-Tienda}}")
STORE_DESC_ESC=$(escape_json "${STORE_DESCRIPTION:-Encuentra los mejores productos para tu negocio}")
ICON_SRC_ESC=$(escape_json "$ICON_SRC")

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
