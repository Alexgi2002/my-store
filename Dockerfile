# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma:generate
RUN pnpm run build

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app
RUN npm install -g pnpm@9

# Instalar utilidades necesarias
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

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
