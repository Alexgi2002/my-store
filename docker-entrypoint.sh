#!/bin/sh
set -e

# Entry point for the container.
# - generate a small runtime config for the frontend
# - optionally run prisma migrations if RUN_MIGRATIONS is set
# - exec the CMD (pnpm start)

echo "[entrypoint] Generating runtime config..."
mkdir -p /app/public
cat > /app/public/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  NEXT_PUBLIC_URL: "${NEXT_PUBLIC_URL:-http://localhost:3000}",
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: "${NEXT_PUBLIC_VAPID_PUBLIC_KEY:-}",
  STORE_NAME: "${STORE_NAME:-}",
  STORE_DESCRIPTION: "${STORE_DESCRIPTION:-}",
  STORE_ICON: "${STORE_ICON:-/icon.jpg}",
  STORE_OG_IMAGE: "${STORE_OG_IMAGE:-/icon.jpg}",
  WHATSAPP_NUMBER: "${WHATSAPP_NUMBER:-}",
};
EOF

# Also write a JSON copy so server-side code can read it without parsing JS
cat > /app/public/runtime-config.json <<EOF
{
  "NEXT_PUBLIC_URL": "${NEXT_PUBLIC_URL:-http://localhost:3000}",
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY": "${NEXT_PUBLIC_VAPID_PUBLIC_KEY:-}",
  "STORE_NAME": "${STORE_NAME:-}",
  "STORE_DESCRIPTION": "${STORE_DESCRIPTION:-}",
  "STORE_ICON": "${STORE_ICON:-/icon.jpg}",
  "STORE_OG_IMAGE": "${STORE_OG_IMAGE:-/icon.jpg}",
  "WHATSAPP_NUMBER": "${WHATSAPP_NUMBER:-}"
}
EOF

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
