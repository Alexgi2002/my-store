# ✅ CHECKLIST - Preparación para Portainer

## 📦 Archivos Necesarios

- [x] **Dockerfile** - Containeriza la aplicación
- [x] **docker-compose.yml** - Define servicios
- [x] **.env.example** - Plantilla de variables
- [x] **.dockerignore** - Archivos a ignorar
- [x] **scripts SQL** - Crear BDD (en carpeta scripts/)

## 📖 Documentación

- [x] **DOCKER.md** - Guía completa
- [x] **DOCKER-QUICK.md** - Guía rápida
- [x] **CONFIG-AVANZADA.md** - Producción/SSL
- [x] **EJEMPLO-REAL.md** - Paso a paso real
- [x] **CHECKLIST.md** - Este archivo

## 🛠️ Scripts Helpers

- [x] **create-store.sh** - Crear tiendas (Mac/Linux)
- [x] **create-store.ps1** - Crear tiendas (Windows)
- [x] **SETUP.sh** - Mostrar estructura

## 🔍 Antes de Desplegar

### 1. Variables de Entorno

- [ ] ¿Tienes acceso a Supabase?
- [ ] ¿Creaste proyecto Supabase?
- [ ] ¿Copias de URL y ANON_KEY?
- [ ] ¿Dominio configurado?
- [ ] ¿Número de WhatsApp correcto?
- [ ] ¿Contraseña admin fuerte? (mínimo 12 caracteres)

### 2. Base de Datos Supabase

- [ ] ¿Scripts SQL ejecutados? (001-005)
- [ ] ¿Tablas creadas?
- [ ] ¿Storage bucket existe?
- [ ] ¿Productos de ejemplo cargados?

### 3. Portainer Setup

- [ ] ¿Portainer accesible?
- [ ] ¿Tienes permisos admin?
- [ ] ¿Docker funcionando?
- [ ] ¿Espacio en disco disponible? (>2GB)

### 4. Código Fuente

- [ ] ¿Clonaste el repositorio?
- [ ] ¿Archivos Dockerfile presentes?
- [ ] ¿docker-compose.yml presente?
- [ ] ¿Carpeta scripts/ con SQL?

## 🚀 Flujo de Despliegue

### Opción A: Prueba Local Rápida

```bash
# 1. Clonar repo (si no lo hiciste)
git clone <repo-url> mi-store
cd mi-store

# 2. Crear .env.production
cp .env.example .env.production
# Editar con tus variables

# 3. Build
docker-compose build

# 4. Run
docker-compose up

# 5. Acceder
# http://localhost:3000
```

**Checklist:**
- [ ] Sin errores en build
- [ ] Container inicia
- [ ] Health check: OK
- [ ] Web accesible
- [ ] Admin funciona

### Opción B: Portainer Production

```
1. En Portainer: Crear Stack
2. Pegar docker-compose.yml
3. Agregar variables desde .env.ejemplo
4. Deploy
5. Esperar 2-3 min
6. Verificar en Containers
7. Acceder vía dominio
```

**Checklist:**
- [ ] Stack creado
- [ ] Variables agregadas
- [ ] Build sin errores
- [ ] Container Running
- [ ] Health check: OK
- [ ] Dominio resuelve
- [ ] HTTPS funciona (si tienes SSL)

## 🔐 Seguridad

### Antes de poner en producción

- [ ] ADMIN_PASSWORD ≠ "admin123"
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY no en GitHub
- [ ] .env nunca en control de versiones
- [ ] HTTPS habilitado
- [ ] Firewall configurado
- [ ] Backup de Supabase activado

### Credenciales

- [ ] Contraseña admin guardada (1Password, Bitwarden, etc)
- [ ] URLs de Supabase guardadas
- [ ] Claves de API en lugar seguro

## 📊 Monitoreo

### Después de desplegar

- [ ] Ver logs sin errores
- [ ] CPU usage normal (<20%)
- [ ] Memoria usage normal (<300MB)
- [ ] Uptime registrado
- [ ] Health check green

## 🔄 Duplicar para Otra Tienda

Cuando necesites crear tienda #2:

- [ ] Proyecto Supabase nuevo
- [ ] Scripts SQL ejecutados
- [ ] `./create-store.sh "nombre" "dominio" "whatsapp"`
- [ ] Nuevo stack en Portainer
- [ ] Variables nuevas
- [ ] Deploy

## 📝 Documentación Importante

Asegúrate de tener a mano:

- [ ] URL Supabase
- [ ] ANON_KEY
- [ ] Admin password
- [ ] Dominio
- [ ] Número WhatsApp

## 🆘 En Caso de Error

1. Ver logs: `docker logs nombre-contenedor`
2. Verificar variables de entorno
3. Verificar conectividad Supabase
4. Revisar scripts SQL ejecutados
5. Reintentar build sin cache: `docker-compose build --no-cache`

## ✨ Lista de Verificación Final

- [ ] Todo funciona localmente
- [ ] Portainer accesible
- [ ] Variables correctas
- [ ] Supabase OK
- [ ] Scripts SQL OK
- [ ] Dominio apunta a servidor
- [ ] SSL/HTTPS configurado
- [ ] Backups activados
- [ ] Monitoreo activado
- [ ] Documentación guardada

---

## 🎉 ¡Listo!

Si todas las casillas están marcadas, estás listo para:

1. ✅ Desplegar en Portainer
2. ✅ Abrir tienda al público
3. ✅ Crear nuevas tiendas fácilmente
4. ✅ Escalar sin problemas

**Preguntas frecuentes:**

> ¿Cómo actualizo el código?
- Git pull + Portainer redeploy

> ¿Cómo agrego otra tienda?
- Supabase nuevo + `create-store.sh` + nuevo stack

> ¿Cómo respaldo datos?
- Supabase tiene backups automáticos

> ¿HTTPS automático?
- Con Traefik: sí. Sin Traefik: nginx/Apache

---

Última revisión: 2025-12-09
Versión: 1.0
Estado: ✅ Listo para producción
