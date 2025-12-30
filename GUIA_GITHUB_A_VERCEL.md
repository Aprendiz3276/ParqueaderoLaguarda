# 📋 GUÍA COMPLETA: GitHub → Vercel + Supabase

## PARTE 1: ARCHIVOS QUE DEBES SUBIR A GITHUB

### ✅ CARPETA `api/` (CRÍTICO)
```
api/
├── index.js ........................ Punto de entrada Express
├── vercel.js ....................... Handler serverless para Vercel
├── auth.js ......................... Rutas de autenticación
├── parking.js ...................... Rutas de parqueaderos
├── reservations.js ................. Rutas de reservas
├── users.js ........................ Rutas de usuarios
├── database.js ..................... Conexión a Supabase/PostgreSQL
└── health.js ....................... Health check endpoint
```

### ✅ CARPETA `backend/` (Opcional para desarrollo local)
```
backend/
├── database.js ..................... DB original
└── routes/
    ├── auth.js
    ├── parking.js
    ├── reservations.js
    └── users.js
```

### ✅ CARPETA `js/`
```
js/
└── app.js .......................... Lógica frontend (login, dashboards)
```

### ✅ CARPETA `css/`
```
css/
└── styles.css ...................... Estilos (Tailwind + custom)
```

### ✅ ARCHIVOS RAÍZ (CRÍTICOS)
```
├── index.html ...................... Página principal
├── server.js ....................... Para desarrollo local (npm start)
├── package.json .................... Dependencias y scripts
├── vercel.json ..................... Configuración de Vercel
├── .env.example .................... Template de variables
├── .gitignore ...................... Archivos a ignorar en Git
└── .env.local.example .............. Template para desarrollo local
```

### ⏭️ ARCHIVOS OPCIONALES (Documentación)
```
├── README.md ....................... Descripción del proyecto
├── CONFIGURACIÓN.md ................ Guía de configuración
├── DEVELOPMENT.md .................. Desarrollo local
├── SUPABASE_CONFIG.md .............. Setup de Supabase
└── (Otros .md)
```

### ❌ NO SUBIR A GITHUB
```
❌ .env (con contraseñas reales)
❌ .env.local (con DATABASE_URL real)
❌ node_modules/ (carpeta de dependencias)
❌ .DS_Store
❌ *.log
```

---

## PARTE 2: PASO A PASO (SIN REPOSITORIO PREVIO)

### PASO 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `MiParqueo` (o el que prefieras)
3. Descripción: "Sistema de gestión de parqueaderos con Supabase y Vercel"
4. **Public** (para Vercel)
5. ☑️ Add a README.md
6. ☑️ Add .gitignore → Selecciona "Node"
7. Click **Create repository**

### PASO 2: Clonar Repositorio Localmente

```powershell
cd C:\Users\tu_usuario\Desktop
git clone https://github.com/tu_usuario/MiParqueo.git
cd MiParqueo
```

### PASO 3: Copiar Archivos del Proyecto

Desde tu carpeta actual del proyecto, copia:

```
✅ api/               → api/
✅ backend/           → backend/
✅ js/                → js/
✅ css/               → css/
✅ index.html         → index.html
✅ server.js          → server.js
✅ package.json       → package.json
✅ vercel.json        → vercel.json
✅ .env.example       → .env.example
✅ .env.local.example → .env.local.example
✅ setup-database.js  → setup-database.js
✅ insert-test-users.js → insert-test-users.js
```

### PASO 4: Configurar Git Localmente

```powershell
cd MiParqueo
git config user.name "Tu Nombre"
git config user.email "tu_email@gmail.com"
```

### PASO 5: Crear .env.local para Desarrollo

Crea archivo `.env.local` en raíz (NO lo subas a GitHub):

```env
DB_TYPE=postgresql
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=development
JWT_SECRET=8BzxYZ7g7wK6MqQTLe1iuAtsExiRXgAbOoykDetqoYVTx6DF77eh8jd6cbDC7IBYwwChpWbm3+3F0Uk1P1IIyQ==
PORT=3000
REACT_APP_API_URL=http://localhost:3000
```

### PASO 6: Instalar Dependencias

```powershell
npm install
```

### PASO 7: Hacer Push a GitHub

```powershell
git add -A
git commit -m "Initial commit: Proyecto MiParqueo con Supabase y Vercel"
git push origin main
```

---

## PARTE 3: CONECTAR CON VERCEL

### PASO 1: Conectar GitHub a Vercel

1. Ve a https://vercel.com/new
2. Click **Import Git Repository**
3. Autoriza GitHub
4. Selecciona tu repositorio `MiParqueo`

### PASO 2: Configurar Vercel

**Build Command:**
```
npm run setup-db || true
```

**Start Command:**
```
node api/vercel.js
```

### PASO 3: Agregar Environment Variables

Click en **Environment Variables** y agrega (CRÍTICO):

```
DB_TYPE = postgresql
DATABASE_URL = postgresql://user:password@host:5432/database
NODE_ENV = production
JWT_SECRET = 8BzxYZ7g7wK6MqQTLe1iuAtsExiRXgAbOoykDetqoYVTx6DF77eh8jd6cbDC7IBYwwChpWbm3+3F0Uk1P1IIyQ==
REACT_APP_API_URL = https://tu-dominio.vercel.app
```

**Asegúrate de marcar: ✅ Production, ✅ Preview, ✅ Development**

### PASO 4: Deploy

Click **Deploy** y espera ~3 minutos. ✅

---

## PARTE 4: OBTENER SUPABASE DATABASE_URL

### Desde Supabase:

1. Ve a https://supabase.com/dashboard
2. Click en tu proyecto
3. Settings → Database → URI
4. Copia la conexión string (Connection Pooler recomendado)
5. Reemplaza en Vercel en `DATABASE_URL`

---

## ESTRUCTURA FINAL EN GITHUB

```
MiParqueo/
├── api/
│   ├── index.js
│   ├── vercel.js
│   ├── auth.js
│   ├── parking.js
│   ├── reservations.js
│   ├── users.js
│   ├── database.js
│   └── health.js
├── backend/
│   ├── database.js
│   └── routes/
│       ├── auth.js
│       ├── parking.js
│       ├── reservations.js
│       └── users.js
├── js/
│   └── app.js
├── css/
│   └── styles.css
├── index.html
├── server.js
├── package.json
├── vercel.json
├── .env.example
├── .env.local.example
├── .gitignore
├── README.md
└── (más documentación .md)
```

---

## CHECKLIST FINAL

✅ Repositorio creado en GitHub
✅ Archivos pusheados correctamente
✅ Conectado con Vercel
✅ Variables de entorno configuradas (5 variables)
✅ DATABASE_URL de Supabase agregada
✅ Deploy completado
✅ App funcionando en https://tu-dominio.vercel.app

---

## TROUBLESHOOTING

### Si Error 500 en Vercel:
- Verifica que las 5 variables de entorno estén en Vercel
- Verifica que `DATABASE_URL` sea correcto
- Verifica que `vercel.json` apunte a `api/vercel.js`

### Si no encuentra módulos:
- Verifica que `api/` tenga todos los archivos
- Verifica que `package.json` esté en raíz
- Verifica que `npm install` se ejecutó

### Si falla login:
- Verifica que Supabase tenga la tabla `users`
- Verifica que test users existan
- Verifica `DATABASE_URL` en `.env.local` para desarrollo

---

**¿NECESITAS AYUDA CON ALGÚN PASO?**
