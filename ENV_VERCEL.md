# 📋 VARIABLES DE ENTORNO PARA VERCEL

## Pasos para configurar en Vercel Dashboard:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega estas variables:

### Opción A: PostgreSQL (RECOMENDADO para Vercel)

```
DB_TYPE=postgresql
PG_HOST=<tu-host-postgres>
PG_PORT=5432
PG_DATABASE=<nombre-bd>
PG_USER=<usuario>
PG_PASSWORD=<contraseña>
NODE_ENV=production
```

### Opción B: SQLite (NO RECOMENDADO para Vercel)

```
DB_TYPE=sqlite
SQLITE_PATH=./data/miparqueo.db
NODE_ENV=production
```

## Proveedores de PostgreSQL Recomendados:

### 1. **Supabase** (RECOMENDADO)
- Gratis: 2 Proyectos, 500 MB almacenamiento
- https://supabase.com
- Obtén las credenciales de Settings → Database

### 2. **Railway.app**
- Gratis: $5 USD/mes de créditos
- https://railway.app
- Variables automáticas disponibles

### 3. **Neon**
- Gratis: 3 ramas, hasta 3 GB
- https://neon.tech
- Copia connection string desde Dashboard

### 4. **ElephantSQL** (Deprecated pero funciona)
- https://www.elephantsql.com

## Configuración en Vercel:

1. En Settings → Environment Variables
2. Agrega cada variable con su valor
3. Haz push a GitHub
4. Vercel se redesplegará automáticamente
5. Verifica con: https://tu-app.vercel.app/api/health

## Si sigue dando error 500:

Verifica los logs:
- Abre tu proyecto en Vercel
- Deployments → último despliegue → Logs
- Busca mensajes de error
