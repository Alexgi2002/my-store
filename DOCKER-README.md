# 🏪 My Store - Docker & Portainer Ready

Tu plataforma de tienda online lista para Docker. **Configurable, escalable y lista para producción.**

## 🎯 Lo que hay aquí

Esta carpeta contiene TODO lo que necesitas para:

✅ Correr la tienda localmente en Docker  
✅ Desplegar en Portainer (o cualquier servidor)  
✅ Duplicar la tienda para otros negocios  
✅ Cambiar nombres, URLs, Supabase fácilmente  
✅ Escalar sin problemas  

## 📚 Documentación

### 🚀 Para Comenzar AHORA

1. **[DOCKER-QUICK.md](DOCKER-QUICK.md)** - 5 minutos
   - Guía rápida de inicio
   - Comandos básicos
   - Crear nuevas tiendas

### 📖 Guías Completas

2. **[DOCKER.md](DOCKER.md)** - 20 minutos
   - Explicación detallada
   - Todos los pasos
   - Solución de problemas

3. **[EJEMPLO-REAL.md](EJEMPLO-REAL.md)** - Paso a paso real
   - Escenario: Fashion Store
   - Desde cero hasta producción
   - Portainer incluido

4. **[CONFIG-AVANZADA.md](CONFIG-AVANZADA.md)** - Producción
   - Traefik para SSL automático
   - Nginx reverse proxy
   - Actualizaciones

### ✅ Verificación

5. **[CHECKLIST.md](CHECKLIST.md)** - No olvides nada
   - Antes de desplegar
   - Variables necesarias
   - Seguridad

## 🚀 Quick Start (3 pasos)

### 1. Prueba Local
```bash
docker-compose up --build
```

Accede: http://localhost:3000

### 2. Crear Nueva Tienda (opcional)
```bash
./create-store.sh "tienda-elegante" "tienda.com" "+5491234567890"
```

### 3. Desplegar en Portainer
- Copia contenido de `docker-compose.yml`
- Crea Stack en Portainer
- Pega variables de `.env.example`
- Deploy!

## 📁 Archivos Importantes

```
.
├── 📄 Dockerfile              → Configura el contenedor
├── 📄 docker-compose.yml      → Desarrollo/simple
├── 📄 docker-compose.prod.yml → Producción con Traefik
├── 📄 .env.example            → Plantilla de variables
├── 📄 .env.local              → Desarrollo local
├── 📄 .dockerignore           → Archivos a ignorar
│
├── 📚 DOCKER-QUICK.md         → [LEE PRIMERO]
├── 📚 DOCKER.md               → Guía completa
├── 📚 EJEMPLO-REAL.md         → Paso a paso real
├── 📚 CONFIG-AVANZADA.md      → Producción
├── 📚 CHECKLIST.md            → No olvides nada
│
├── 🛠️  create-store.sh        → Crear tiendas (Mac/Linux)
├── 🛠️  create-store.ps1       → Crear tiendas (Windows)
└── 🛠️  SETUP.sh               → Mostrar estructura
```

## 🎯 Casos de Uso

### Caso 1: Quiero probar localmente
```bash
docker-compose up --build
# Listo en http://localhost:3000
```

### Caso 2: Quiero desplegar en mi servidor
1. Leer **DOCKER.md**
2. Configurar Portainer
3. Pegar `docker-compose.yml`
4. Agregar variables
5. Deploy!

### Caso 3: Tengo 5 clientes, quiero una tienda para cada uno
```bash
# Cliente 1
./create-store.sh "tienda-1" "tienda1.com" "+549..."

# Cliente 2
./create-store.sh "tienda-2" "tienda2.com" "+549..."

# Cliente 3
./create-store.sh "tienda-3" "tienda3.com" "+549..."

# Cada una es independiente, con su Supabase y dominio
```

### Caso 4: Tengo Traefik, quiero SSL automático
1. Leer **CONFIG-AVANZADA.md**
2. Usar `docker-compose.prod.yml`
3. Configurar variables
4. Traefik maneja SSL automáticamente

## 📊 Variables Configurables

| Variable | Cambio Fácil | Descripción |
|----------|:---:|----------|
| `STORE_NAME` | ✅ | Nombre de la tienda |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL de tu BD |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clave API |
| `NEXT_PUBLIC_URL` | ✅ | Dominio público |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | Número para contacto |
| `ADMIN_PASSWORD` | ✅ | Panel admin |
| `PORT` | ✅ | Puerto expuesto |

## 🔄 Flujo: Crear Nueva Tienda en 10 Minutos

1. **Supabase** (3 min)
   - Crear proyecto nuevo
   - Obtener URL y ANON_KEY

2. **Scripts** (2 min)
   - Ejecutar 5 scripts SQL en Supabase
   - Crear tablas

3. **Generar Variables** (1 min)
   ```bash
   ./create-store.sh "nombre" "dominio.com" "+549..."
   ```

4. **Portainer** (4 min)
   - Crear Stack nuevo
   - Copiar variables
   - Deploy

5. **Listo** ✅
   - Tienda activa
   - Independiente
   - Con su propia BD

## 🔐 Seguridad

**Nunca:**
- Subir `.env` a GitHub
- Usar contraseña "admin123"
- Compartir ANON_KEY
- Guardar credenciales en texto plano

**Siempre:**
- Usar HTTPS en producción
- Cambiar contraseña admin
- Guardar credenciales en gestor seguro (1Password, Bitwarden)
- Hacer backups de Supabase
- Monitorear logs

## 🚨 Troubleshooting

### ¿El contenedor no inicia?
```bash
docker logs nombre-contenedor
```
Ver el error y revisar variables de entorno

### ¿No puedo conectar a Supabase?
- Verificar URL y ANON_KEY
- Verificar que Supabase está activo
- Verificar firewall

### ¿El puerto está en uso?
```bash
# Ver qué ocupa el puerto
lsof -i :3000

# Cambiar puerto en .env
PORT=3001
```

### ¿Necesito actualizar?
```bash
git pull
docker-compose build --no-cache
docker-compose up
```

## 📞 Soporte Rápido

### Localmente
```bash
# Ver estado
docker ps

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down
```

### En Portainer
- Ver Containers
- Clickear en tu tienda
- Ver Logs
- Monitorear Stats
- Redeploy si es necesario

## 🎓 Aprende Más

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Portainer Docs](https://docs.portainer.io/)
- [Next.js in Docker](https://nextjs.org/docs/deployment)
- [Supabase Setup](https://supabase.com/docs)

## 📋 Siguiente Paso

👉 **Abre [DOCKER-QUICK.md](DOCKER-QUICK.md) ahora**

---

## 🆘 Resumen de Documentos

| Archivo | Tiempo | Para Qué |
|---------|--------|----------|
| **DOCKER-QUICK.md** | 5 min | Empezar rápido |
| **DOCKER.md** | 20 min | Entender todo |
| **EJEMPLO-REAL.md** | 15 min | Ver un ejemplo completo |
| **CONFIG-AVANZADA.md** | 10 min | Traefik y SSL |
| **CHECKLIST.md** | 5 min | Verificar antes de ir live |

---

## 📌 Estado

- ✅ Dockerizado
- ✅ Docker Compose listo
- ✅ Variables configurables
- ✅ Scripts para duplicación
- ✅ Documentación completa
- ✅ Ejemplos reales
- ✅ Listo para Portainer
- ✅ Listo para producción

## 🎉 Resultado Final

Con esta configuración puedes:

✅ Desplegar una tienda en 10 minutos  
✅ Crear 100 tiendas sin duplicar código  
✅ Cambiar nombres/URLs sin tocar Docker  
✅ Escalar sin problemas  
✅ Monitorear todo en Portainer  
✅ Hacer actualizaciones fácilmente  

---

**¡Ahora sí! 👉 Lee [DOCKER-QUICK.md](DOCKER-QUICK.md) y comienza!**

Last updated: 2025-12-09
