# 🚀 Desplegar en Docker & Portainer - Guía Rápida

## ¿Qué hay de nuevo?

✅ **Dockerfile** - Containeriza tu aplicación Next.js  
✅ **docker-compose.yml** - Despliegue fácil  
✅ **.env.example** - Plantilla de configuración  
✅ **DOCKER.md** - Guía detallada  
✅ **create-store.sh** - Script para crear nuevas tiendas (Mac/Linux)  
✅ **create-store.ps1** - Script para crear nuevas tiendas (Windows)  

---

## 🎯 Opción 1: Prueba Local (Rápido)

```bash
# Construir y ejecutar
docker-compose up --build

# Acceder a: http://localhost:3000
```

---

## 🎯 Opción 2: Crear Nueva Tienda (Duplicar)

### En Mac/Linux:
```bash
./create-store.sh "tienda-elegante" "tienda.com" "+5491234567890"
```

### En Windows:
```powershell
.\create-store.ps1 -StoreName "tienda-elegante" -Domain "tienda.com" -WhatsApp "+5491234567890"
```

El script generará un `.env.tienda-elegante` con valores por defecto; revisa y ajusta `DATABASE_URL` y las variables `ADMIN_*` antes de desplegar.

---

## 🐳 Opción 3: Despliegue en Portainer

1. **Acceder a Portainer** (tu servidor)
2. **Crear Stack** → Pegar contenido de `docker-compose.yml`
3. **Agregar variables de entorno** (desde `.env.example` o el generado)
4. **Deploy** → ¡Listo!

---

## 📦 Variables Importantes

| Variable | Dónde obtenerla |
|----------|-----------------|
| `DATABASE_URL` | Cadena de conexión Postgres (p. ej. postgres://user:pass@host:5432/dbname) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Clave pública VAPID (genera con web-push) |
| `VAPID_PRIVATE_KEY` | Clave privada VAPID (secreta) |
| `NEXT_PUBLIC_URL` | Tu dominio público (http o https) |
| `ADMIN_PASSWORD` | Generar una contraseña fuerte |

---

## 📖 Para más detalles

Leer: `DOCKER.md`

---

## 🔄 Flujo de Duplicación (Múltiples Tiendas)

1. Crear proyecto Supabase
2. Ejecutar scripts SQL
3. Usar script `create-store.sh` o `create-store.ps1`
4. Copiar variables a Portainer
5. Deploy!

---

## 💡 Pro Tips

- Cambiar `ADMIN_PASSWORD` siempre
- Usar HTTPS en producción
- Monitorear con Portainer
- Health checks automáticos cada 30s

¡A vender! 🎉
