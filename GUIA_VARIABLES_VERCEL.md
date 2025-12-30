# 🔐 Guía: Variables de Entorno en Vercel

Esta guía te ayudará a configurar correctamente las variables de entorno en Vercel para que tu aplicación funcione.

## 📋 Variables Requeridas

### Opción 1: Usando Supabase (Recomendado) ⭐

Si usas Supabase, solo necesitas **1 variable**:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:TU_PASSWORD@db.xxxxx.supabase.co:5432/postgres` | URL completa de conexión a Supabase |
| `DB_TYPE` | `postgresql` | Tipo de base de datos |
| `NODE_ENV` | `production` | Entorno de producción |

**Cómo obtener DATABASE_URL:**
1. Ve a https://supabase.com
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Busca **Connection string** → **URI**
5. Copia la URL (se ve así: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
6. Reemplaza `[YOUR-PASSWORD]` con tu contraseña real

### Opción 2: PostgreSQL Individual

Si usas PostgreSQL en otro servicio (Railway, Render, etc.):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DB_TYPE` | `postgresql` | Tipo de base de datos |
| `PG_HOST` | `tu-host.com` | Host de PostgreSQL |
| `PG_PORT` | `5432` | Puerto (generalmente 5432) |
| `PG_DATABASE` | `nombre_base_datos` | Nombre de la base de datos |
| `PG_USER` | `usuario` | Usuario de PostgreSQL |
| `PG_PASSWORD` | `contraseña` | Contraseña de PostgreSQL |
| `NODE_ENV` | `production` | Entorno de producción |

### Opción 3: SQLite (NO recomendado para producción)

⚠️ **SQLite no funciona bien en Vercel** porque es un sistema de archivos y Vercel es serverless.

## 🚀 Cómo Configurar en Vercel

### Paso 1: Acceder a Variables de Entorno

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto **parqueadero-laguarda**
3. Ve a **Settings** (Configuración)
4. En el menú lateral, haz clic en **Environment Variables**

### Paso 2: Agregar Variables

Para cada variable:

1. Haz clic en **Add New**
2. Ingresa el **Name** (nombre de la variable)
3. Ingresa el **Value** (valor)
4. Selecciona los **Environments** donde aplica:
   - ✅ **Production** (obligatorio)
   - ✅ **Preview** (recomendado)
   - ✅ **Development** (opcional)
5. Haz clic en **Save**

### Paso 3: Verificar Variables

Después de agregar las variables, deberías ver algo así:

```
DATABASE_URL    [Hidden]  Production, Preview
DB_TYPE         postgresql  Production, Preview
NODE_ENV        production  Production, Preview
```

### Paso 4: Redesplegar

⚠️ **IMPORTANTE**: Después de agregar/modificar variables de entorno:

1. Ve a la pestaña **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deploy
3. Selecciona **Redeploy**
4. Espera 1-2 minutos

O simplemente haz un nuevo commit y push (Vercel redesplegará automáticamente).

## ✅ Verificar que Funciona

### 1. Verificar Health Endpoint

Abre en tu navegador:
```
https://parqueadero-laguarda-y9x7.vercel.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Servidor funcionando",
  "timestamp": "2025-01-XX...",
  "nodeEnv": "production",
  "db_type": "postgresql"
}
```

Si `db_type` dice `"not set"` o `"sqlite"`, las variables no están configuradas correctamente.

### 2. Insertar Usuarios de Prueba

Después de configurar las variables, ejecuta el script para crear usuarios:

**Opción A: Desde tu computadora (local)**
```bash
# Configura las variables en un archivo .env primero
npm run setup-vercel-users
```

**Opción B: Desde Vercel (recomendado)**

Crea un endpoint temporal o usa el script `setup-vercel-users.js` ejecutándolo una vez.

## 🔧 Script para Insertar Usuarios

He creado el script `setup-vercel-users.js` que puedes ejecutar localmente:

```bash
# 1. Crea un archivo .env con tus variables
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
DB_TYPE=postgresql
NODE_ENV=production

# 2. Ejecuta el script
node setup-vercel-users.js
```

Este script creará:
- ✅ Usuario: `usuario@example.com` / `1234`
- ✅ Admin: `admin@example.com` / `1234`
- ✅ Parqueaderos de prueba

## 🐛 Solución de Problemas

### Error: "DATABASE_URL o credenciales de PostgreSQL no configuradas"

**Solución:**
- Verifica que agregaste `DATABASE_URL` en Vercel
- Asegúrate de que el valor no tenga espacios
- Verifica que redesplegaste después de agregar la variable

### Error: "Connection refused" o "Timeout"

**Solución:**
- Verifica que tu base de datos permite conexiones externas
- En Supabase: Ve a **Settings** → **Database** → **Connection pooling** y habilita conexiones externas
- Verifica que la contraseña en `DATABASE_URL` es correcta

### Error: "db_type: not set"

**Solución:**
- Agrega la variable `DB_TYPE=postgresql` en Vercel
- Redesplega la aplicación

### Los usuarios no existen

**Solución:**
- Ejecuta `node setup-vercel-users.js` localmente con las variables configuradas
- O crea los usuarios manualmente en tu base de datos

## 📝 Resumen Rápido

**Mínimo necesario para Supabase:**
```
DATABASE_URL = postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
DB_TYPE = postgresql
NODE_ENV = production
```

**Después de configurar:**
1. ✅ Redesplegar en Vercel
2. ✅ Ejecutar `node setup-vercel-users.js` para crear usuarios
3. ✅ Probar login con: `usuario@example.com` / `1234`

---

¿Necesitas ayuda? Verifica los logs en Vercel → Deployments → [Último deploy] → Functions → [Ver logs]

