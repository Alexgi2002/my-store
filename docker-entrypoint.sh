#!/bin/sh
set -e

# Generate runtime-config.js from environment variables so client can read them at runtime
RUNTIME_FILE="/app/public/runtime-config.js"
MANIFEST_FILE="/app/public/manifest.json"

# Default values
: "${STORE_NAME:=my-store}"
: "${NEXT_PUBLIC_VAPID_PUBLIC_KEY:=}"
: "${NEXT_PUBLIC_URL:=http://localhost:3000}"
: "${NEXT_PUBLIC_WHATSAPP_NUMBER:=}"
: "${STORE_ICON_URL:=/icon.svg}"

cat > "$RUNTIME_FILE" <<-JS
window.__RUNTIME_CONFIG__ = {
  STORE_NAME: "${STORE_NAME}",
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: "${NEXT_PUBLIC_VAPID_PUBLIC_KEY}",
  NEXT_PUBLIC_URL: "${NEXT_PUBLIC_URL}",
  NEXT_PUBLIC_WHATSAPP_NUMBER: "${NEXT_PUBLIC_WHATSAPP_NUMBER}",
  STORE_ICON_URL: "${STORE_ICON_URL}"
};
JS

# Generate manifest.json dynamically so each store can have its own name/icon
cat > "$MANIFEST_FILE" <<-JSON
{
  "name": "${STORE_NAME}",
  "short_name": "${STORE_NAME}",
  "description": "Tienda ${STORE_NAME}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "${STORE_ICON_URL}",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
JSON

# If first arg looks like an option, prefix with pnpm start
if [ "${1#-}" != "$1" ]; then
  set -- pnpm start "$@"
fi

# Execute the command (default: pnpm start)
exec "$@"
