# 🔧 Configuración Avanzada - Portainer + Traefik

## Opción A: Con Traefik (Recomendado para Producción)

Si tienes Traefik configurado en tu servidor, usa `docker-compose.prod.yml`:

### Paso 1: Variables de Entorno

```properties
STORE_NAME=tienda-elegante
DOMAIN=tienda.com
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_URL=https://tienda.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+5491234567890
ADMIN_PASSWORD=contraseña-super-segura
```

### Paso 2: En Portainer

- Stack name: `tienda-elegante`
- Docker Compose: Copiar contenido de `docker-compose.prod.yml`
- Variables de entorno: Las de arriba
- Network: Debe coincidir con la de Traefik (ej: `traefik-network`)

### Paso 3: Traefik automáticamente:
- Creará certificado SSL
- Expondrá en https://tienda.com
- Renovará certificados automáticamente

---

## Opción B: Sin Traefik (Más Simple)

Usa `docker-compose.yml` normal:
- Expone puerto directo
- Acceso via `http://servidor:puerto`
- Configura HTTPS con reverse proxy (nginx, Apache) si necesitas

---

## 🔐 SSL/HTTPS sin Traefik

Si usas Nginx reverse proxy:

```nginx
server {
    listen 443 ssl http2;
    server_name tienda.com;

    ssl_certificate /etc/letsencrypt/live/tienda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tienda.com/privkey.pem;

    location / {
        proxy_pass http://mi-tienda-store:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoreo

### Ver logs
```bash
docker-compose logs -f store
```

### Ver recursos
```bash
docker stats nombre-contenedor
```

### Reiniciar
```bash
docker-compose restart store
```

---

## 🔄 Actualizar Aplicación

```bash
# Descargar cambios
git pull

# Reconstruir imagen
docker-compose build --no-cache

# Reiniciar
docker-compose up -d
```

---

## 📝 Notas de Producción

✅ Siempre usar HTTPS  
✅ Health checks habilitados  
✅ Restart policy en `unless-stopped`  
✅ Variables sensibles en Portainer, no en archivos  
✅ Backups regulares de Supabase  
✅ Monitorear logs  
✅ Actualizar Node/Docker regularmente  

---

## ⚠️ Limitaciones

- Next.js en `standalone` mode (optimizado para Docker)
- Sin SSG estático (cada request es dinámico)
- Base de datos en Supabase (no local)

Para más, ver `DOCKER.md`
