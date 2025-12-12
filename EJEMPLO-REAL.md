# 📝 EJEMPLO REAL: Despliegue en Portainer

## Escenario: Tienda "Fashion Store"

### Paso 1: Crear Proyecto en Supabase

1. Ir a https://app.supabase.com
2. Crear proyecto "fashion-store"
3. Obtener datos en **Settings → API**:
   ```
   Project URL: https://abcdef123456.supabase.co
   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Paso 2: Ejecutar Scripts SQL

En Supabase SQL Editor, ejecutar en orden:
```sql
-- Script 1: Crear tabla de productos
1. scripts/001_create_products_table.sql

-- Script 2: Agregar productos de ejemplo
2. scripts/002_seed_products.sql

-- Script 3: Crear tabla de banners
3. scripts/003_create_banners_table.sql

-- Script 4: Configurar almacenamiento
4. scripts/004_create_storage_buckets.sql

-- Script 5: Crear tabla de suscriptores
5. scripts/005_create_subscriptions_table.sql
```

### Paso 3: Generar Variables

**Opción A - Automático (Mac/Linux):**
```bash
./create-store.sh "fashion-store" "fashionstyle.com" "+5491234567890"
```

**Opción B - Manual:**
```properties
STORE_NAME=fashion-store
PORT=3000
NEXT_PUBLIC_SUPABASE_URL="https://abcdef123456.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_URL="https://fashionstyle.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="+5491234567890"
ADMIN_PASSWORD="G8k$mL9@xQ2pR5nT7vW4y6Z1"
```

### Paso 4: En Portainer

#### 4.1. Acceder a Portainer
```
http://tu-servidor:9000
```

#### 4.2. Ir a Stacks
```
Stacks → Add stack
```

#### 4.3. Crear Stack
- **Name:** `fashion-store`
- **Build method:** Paste compose content

#### 4.4. Pegar docker-compose.yml
```yaml
version: '3.8'

services:
  store:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${STORE_NAME}-store
    ports:
      - "${PORT}:3000"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      NEXT_PUBLIC_URL: ${NEXT_PUBLIC_URL}
      NEXT_PUBLIC_WHATSAPP_NUMBER: ${NEXT_PUBLIC_WHATSAPP_NUMBER}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      NODE_ENV: production
    restart: unless-stopped
    networks:
      - my-store-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  my-store-network:
    driver: bridge
```

#### 4.5. Agregar Variables de Entorno
En la sección **"Environment variables"**, agregar:

```
STORE_NAME=fashion-store
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=https://abcdef123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_URL=https://fashionstyle.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+5491234567890
ADMIN_PASSWORD=G8k$mL9@xQ2pR5nT7vW4y6Z1
```

#### 4.6. Deploy
- Click **Deploy the stack**
- Esperar 2-3 minutos mientras construye la imagen
- Ver logs en Portainer

#### 4.7. Acceder
```
https://fashionstyle.com  (si tienes reverse proxy)
O
http://tu-servidor:3000
```

---

## ✅ Verificación

### En Portainer:
- Ir a **Containers**
- Buscar `fashion-store-store`
- Ver estado: **Running** ✅
- Ver logs (no errores)

### En tu navegador:
```
https://fashionstyle.com
```

Deberías ver:
- ✅ Página de inicio con productos
- ✅ Carrito funcionando
- ✅ Admin panel en `/admin`
- ✅ Notificaciones push

### Para acceder al admin:
```
URL: https://fashionstyle.com/admin
Password: G8k$mL9@xQ2pR5nT7vW4y6Z1
```

---

## 🔄 Agregar Más Tiendas (Ejemplo 2)

### Nueva tienda: "Jewelry Store"

**Crear proyecto Supabase** → Obtener credenciales

**Generar variables:**
```bash
./create-store.sh "jewelry-store" "jewelryboutique.com" "+5491987654321"
```

**En Portainer:** Crear nuevo stack `jewelry-store` con las variables nuevas

**Resultado:**
- `fashion-store-store` corriendo en puerto 3000
- `jewelry-store-store` corriendo en puerto 3001 (o distinto)
- Ambas con BDD separadas (Supabase proyectos distintos)
- Totalmente independientes

---

## 🚨 Solución de Problemas

### Error: "Cannot connect to Supabase"
```
✗ Verificar NEXT_PUBLIC_SUPABASE_URL está correcto
✗ Verificar NEXT_PUBLIC_SUPABASE_ANON_KEY está correcto
✗ Verificar que el proyecto Supabase está activo
```

### Error: "Health check failing"
```
- Dar más tiempo (40s) a que inicie
- Ver logs: docker logs fashion-store-store
- Verificar puerto 3000 no está en uso
```

### Cambiar contraseña admin
```
Editar variable ADMIN_PASSWORD en Portainer
Redeploy el stack
```

### Actualizar código
```
Git pull cambios
En Portainer: 
  - Redeploy (reconstruirá imagen)
  O
  - Stack → Pull & Redeploy
```

---

## 📊 Monitoreo

En Portainer:

**Containers:**
- Ver estado (Running/Exited)
- Ver CPU/Memoria
- Ver uptime

**Logs:**
- Clic en contenedor
- Ver logs en tiempo real
- Buscar errores

**Stats:**
```
Nombre: fashion-store-store
Estado: Running
CPU: ~5-15%
Memoria: ~150-200MB
```

---

## 🎯 Checklist Final

- [ ] Proyecto Supabase creado
- [ ] Scripts SQL ejecutados
- [ ] Variables generadas
- [ ] Stack creado en Portainer
- [ ] Variables agregadas
- [ ] Deploy exitoso
- [ ] Health check: OK
- [ ] Acceso web: OK
- [ ] Admin panel: OK
- [ ] Contraseña guardada en lugar seguro

¡Listo para vender! 🚀
