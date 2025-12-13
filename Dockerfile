# Build stage
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar cliente Prisma (necesario para que @prisma/client encuentre .prisma/client)
RUN pnpm prisma:generate

# Build de la aplicación
RUN pnpm run build

# Production stage
FROM node:20-bullseye-slim

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar node_modules generados en el builder (incluye @prisma/client generado)
COPY --from=builder /app/node_modules ./node_modules

# Copiar package files (kept for metadata)
COPY package.json pnpm-lock.yaml ./

# Copiar archivos compilados desde builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copiar entrypoint
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar entrypoint que genera runtime config y arranca la app
ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
CMD ["pnpm", "start"]
