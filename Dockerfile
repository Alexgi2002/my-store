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

RUN pnpm run build

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
