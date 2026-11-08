# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Instalar openssl y ca-certificates (necesarios para que Prisma descargue sus motores HTTPS)
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9

# Instalar dependencias permitiendo scripts de postinstall de Prisma
RUN pnpm install --frozen-lockfile

COPY . .

# Ejecutar prisma generate indicando explícitamente la ruta del schema
RUN npx prisma generate --schema=./prisma/schema.prisma

# === VARIABLES PARA TIEMPO DE COMPILACIÓN ===
# Desactiva la telemetría de Next.js para ahorrar recursos
ENV NEXT_TELEMETRY_DISABLED=1
# Evita que librerías como Zod fallen si validan esquemas en el build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV JWT_SECRET="dummy_secret_for_building_purposes_only"
ENV NODE_ENV=production

# Optimizar el uso de memoria RAM reduciendo los hilos de Next.js y limitando Node.js
ENV NEXT_PRIVATE_LOCAL_WEBPACK=true
ENV NODE_OPTIONS="--max-old-space-size=2048"

#RUN pnpm run build
RUN pnpm run build 2>&1 | tail -n 40

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app

RUN npm install -g pnpm@9

# Instalar utilidades necesarias incluyendo openssl para Prisma en runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
CMD ["pnpm", "start"]
