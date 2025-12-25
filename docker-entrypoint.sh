#!/bin/sh
set -e

# Entry point for the container.
# - generate a small runtime config for the frontend
# - optionally run prisma migrations if RUN_MIGRATIONS is set
# - exec the CMD (pnpm start)

echo "[entrypoint] Writing manifest.json from environment variables (branding comes from env)"
mkdir -p /app/public

# Write a manifest.json based on environment variables so installed shortcut (PWA) uses the
# container-provided name and icon. This overwrites the static file in /public at container start.
cat > /app/public/manifest.json <<EOF
{
  "name": "${STORE_NAME:-Mi Tienda}",
  "short_name": "${SHORT_NAME:-${STORE_NAME:-Tienda}}",
  "description": "${STORE_DESCRIPTION:-Encuentra los mejores productos para tu negocio}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "${BACKGROUND_COLOR:-#ffffff}",
  "theme_color": "${THEME_COLOR:-#000000}",
  "icons": [
    {
      "src": "${STORE_ICON:-/icon.jpg}",
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
