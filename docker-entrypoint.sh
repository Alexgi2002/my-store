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
};
EOF

# Run Prisma migrations automatically on container start (safe no-op if nothing to apply)
echo "[entrypoint] Running Prisma migrations (deploy) if any..."
# Prefer using the script alias if present
if command -v pnpm >/dev/null 2>&1; then
  pnpm prisma:migrate deploy || pnpm prisma migrate deploy || npx prisma migrate deploy || true
else
  npx prisma migrate deploy || true
fi

# Start the app
echo "[entrypoint] Starting app: $@"
exec "$@"
