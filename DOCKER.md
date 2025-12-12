# 🐳 Guía de Despliegue con Docker y Portainer

## Requisitos Previos

- Docker instalado
- Docker Compose instalado
- Portainer (opcional, pero recomendado)
- Base de datos Postgres accesible y configurada (usaremos Prisma)

---

## 📋 Pasos para Preparar la Tienda

### 1. Preparar la base de datos Postgres y Prisma

1. Tener una instancia Postgres (local o en la nube) y una cadena de conexión `DATABASE_URL`.
2. Ejecutar migraciones de Prisma para crear las tablas necesarias (ver sección "Migraciones").

### 2. Crear archivo `.env.production`

Copiar el contenido de `.env.example` y rellenar las variables (ver lista más abajo). Ejemplo:

```bash
cp .env.example .env.production
```

Editar `.env.production` con los datos de tu tienda:

```properties
# Nombre único de la tienda
STORE_NAME=tienda-ejemplo

# Puerto en el que correrá (cambiar si hay conflictos)
PORT=3000

# Base de datos (Postgres)
DATABASE_URL="postgres://user:pass@host:5432/dbname"

# URL pública de tu tienda
NEXT_PUBLIC_URL="https://tienda.tudominio.com"

# Número de WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+5491234567890"

# Contraseña del panel admin (CAMBIAR!)
ADMIN_PASSWORD="contraseña-muy-segura"
```

---

## 🚀 Despliegue Local (Prueba)

### Opción 1: Con Docker Compose

```bash
# Construir imagen
docker-compose build

# Ejecutar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La tienda estará en: **http://localhost:3000**

### Opción 2: Sin Docker Compose

```bash
# Construir imagen
docker build -t mi-tienda:latest .

# Ejecutar
docker run -d \
  --name mi-tienda \
  -p 3000:3000 \
  --env-file .env.production \
  mi-tienda:latest

# Ver logs
docker logs -f mi-tienda

# Detener
docker stop mi-tienda
```

---

## 🎯 Despliegue en Portainer

### Pasos:

1. **Acceder a Portainer** (ej: `http://portainer.tudominio.com`)

2. **Crear Stack nuevo**:
    - Click en **Stacks → Add stack**
    - Nombre: `tienda-nombre`

3. **Pegar `docker-compose.yml`** (usa el que viene en el repo). Asegúrate de reemplazar/definir las variables de entorno requeridas (ver sección Variables más abajo).

4. **Agregar variables de entorno** (sección Environment):
    - Rellena `DATABASE_URL`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `ADMIN_PASSWORD`, `ADMIN_TOKEN` y `ADMIN_JWT_SECRET`.

5. **Deploy** → Esperar a que construya y levante

---

## 📱 Variables de Entorno Explicadas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `STORE_NAME` | Nombre único de la tienda | `tienda-elegante` |
| `PORT` | Puerto expuesto | `3000` |
| `DATABASE_URL` | Cadena de conexión Postgres para Prisma | `postgres://user:pass@host:5432/dbname` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Clave pública VAPID para notificaciones push | (genera con web-push) |
| `VAPID_PRIVATE_KEY` | Clave privada VAPID (secreta) | (genera con web-push) |
| `NEXT_PUBLIC_URL` | URL pública accesible | `https://tienda.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número para contacto | `+549123456789` |
| `ADMIN_PASSWORD` | Contraseña del panel admin | `MiContraseña123!` |

---

## 🔄 Duplicar Tienda para Otro Negocio

### Pasos rápidos:

1. Crear o apuntar a una base Postgres nueva para la tienda.
2. Copiar `.env.example` → `.env.nueva-tienda` y ajustar `DATABASE_URL`, `NEXT_PUBLIC_URL`, `STORE_NAME`, etc.
3. Ejecutar migraciones de Prisma para la nueva base:
   ```bash
   pnpm prisma:migrate deploy
   ```
4. Desplegar la nueva tienda en Portainer con las variables actualizadas.

5. **Desplegar en Portainer** con las nuevas variables

---

## 🔐 Seguridad (Importante!)

- ✅ Cambiar `ADMIN_PASSWORD` siempre
- ✅ Usar HTTPS en producción (configurar reverse proxy)
- ✅ Guardar `.env` en lugar seguro, nunca en GitHub
- ✅ Usar variables de entorno en Portainer, no archivos `.env`

---

## 🐛 Solución de Problemas

### El contenedor no inicia
```bash
docker logs nombre-contenedor
```

### Error de Supabase
- Verificar URL y clave están correctas
- Probar en: https://app.supabase.com/projects

### Puerto ya en uso
- Cambiar `PORT` en `.env`
- O: `docker port nombre-contenedor`

### Necesito reconstruir
```bash
docker-compose build --no-cache
```

---

## 📞 Scripts SQL para Nueva Tienda

Los scripts están en `scripts/` carpeta. Ejecutarlos en Supabase:

1. Ir a **SQL Editor**
2. Ejecutar en orden:
   - `001_create_products_table.sql`
   - `002_seed_products.sql`
   - `003_create_banners_table.sql`
   - `004_create_storage_buckets.sql`
   - `005_create_subscriptions_table.sql`

---

## 📊 Monitoreo en Portainer

Después de desplegar:
- Ver logs en Portainer
- Monitorear CPU/Memoria
- Health check automático cada 30s
- Restart automático si falla

---

## 🎉 Listo!

Tu tienda estará disponible en la URL configurada con todas las variables personalizadas.

Para más detalles sobre variables, ver `.env.example`
