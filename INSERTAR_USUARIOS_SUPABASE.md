# 👥 Cómo Insertar Usuarios de Prueba en Supabase

Esta guía te mostrará cómo ejecutar el SQL para crear los usuarios de prueba directamente en Supabase.

## 🚀 Método 1: SQL Editor en Supabase (Más Fácil)

### Paso 1: Acceder a Supabase

1. Ve a https://supabase.com
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto (o créalo si no tienes uno)

### Paso 2: Abrir SQL Editor

1. En el menú lateral izquierdo, haz clic en **SQL Editor**
2. Haz clic en **New query** (Nueva consulta)

### Paso 3: Ejecutar el SQL

1. Copia y pega este código SQL en el editor:

```sql
-- Insertar usuarios de prueba
INSERT INTO users (email, password, name, role) VALUES 
('usuario@example.com', '1234', 'Usuario de Prueba', 'user'),
('admin@example.com', '1234', 'Administrador', 'admin')
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
```

2. Haz clic en el botón **Run** (Ejecutar) o presiona `Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)

### Paso 4: Verificar

Deberías ver un mensaje como:
```
Success. No rows returned
```

O si los usuarios ya existían:
```
Success. 2 rows affected
```

### Paso 5: Verificar que se crearon

Ejecuta esta consulta para ver los usuarios:

```sql
SELECT id, email, name, role FROM users;
```

Deberías ver:
```
id | email                  | name              | role
---|------------------------|-------------------|------
1  | usuario@example.com    | Usuario de Prueba | user
2  | admin@example.com      | Administrador     | admin
```

---

## 🔧 Método 2: Table Editor (Interfaz Gráfica)

Si prefieres usar la interfaz gráfica:

### Paso 1: Abrir Table Editor

1. En Supabase, ve a **Table Editor** en el menú lateral
2. Selecciona la tabla **users**

### Paso 2: Insertar Usuario 1

1. Haz clic en **Insert** → **Insert row**
2. Completa los campos:
   - **email**: `usuario@example.com`
   - **password**: `1234`
   - **name**: `Usuario de Prueba`
   - **role**: `user`
3. Haz clic en **Save**

### Paso 3: Insertar Usuario 2

1. Haz clic en **Insert** → **Insert row** nuevamente
2. Completa los campos:
   - **email**: `admin@example.com`
   - **password**: `1234`
   - **name**: `Administrador`
   - **role**: `admin`
3. Haz clic en **Save**

---

## 📋 SQL Completo (Con Parqueaderos)

Si también quieres insertar parqueaderos de prueba, ejecuta esto:

```sql
-- Insertar usuarios de prueba
INSERT INTO users (email, password, name, role) VALUES 
('usuario@example.com', '1234', 'Usuario de Prueba', 'user'),
('admin@example.com', '1234', 'Administrador', 'admin')
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Insertar parqueaderos de prueba
INSERT INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) VALUES 
('Parqueadero Centro', 'Calle 50 #15-20', 150, 120, 5000),
('Parqueadero Norte', 'Carrera 7 #100-50', 200, 85, 4000),
('Parqueadero Mall', 'Avenida Boyacá #120-10', 500, 350, 3500)
ON CONFLICT DO NOTHING;
```

---

## ⚠️ Solución de Problemas

### Error: "relation 'users' does not exist"

**Problema**: La tabla `users` no existe.

**Solución**: 
1. Ve a **Table Editor** → **New table**
2. Crea la tabla `users` con estos campos:
   - `id` (SERIAL PRIMARY KEY)
   - `email` (VARCHAR, UNIQUE, NOT NULL)
   - `password` (VARCHAR, NOT NULL)
   - `name` (VARCHAR, NOT NULL)
   - `role` (VARCHAR, DEFAULT 'user')
   - `created_at` (TIMESTAMP, DEFAULT NOW())

O ejecuta el script `npm run setup-db` que crea todas las tablas automáticamente.

### Error: "duplicate key value violates unique constraint"

**Problema**: Los usuarios ya existen.

**Solución**: El SQL con `ON CONFLICT` debería actualizarlos. Si sigue fallando, primero elimina los usuarios:

```sql
DELETE FROM users WHERE email IN ('usuario@example.com', 'admin@example.com');
```

Luego ejecuta el INSERT nuevamente.

### Error: "column 'email' does not exist"

**Problema**: La estructura de la tabla es diferente.

**Solución**: Verifica la estructura de tu tabla:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```

---

## ✅ Verificación Final

Después de insertar, verifica que todo funciona:

1. **Ver usuarios creados:**
```sql
SELECT * FROM users;
```

2. **Probar login en tu app:**
   - Ve a: https://parqueadero-laguarda-y9x7.vercel.app
   - Login: `usuario@example.com` / `1234`
   - O Admin: `admin@example.com` / `1234`

---

## 🎯 Resumen Rápido

1. ✅ Ve a Supabase → SQL Editor
2. ✅ Pega el SQL de arriba
3. ✅ Haz clic en **Run**
4. ✅ Verifica con `SELECT * FROM users;`
5. ✅ Prueba el login en tu app

¡Listo! 🎉

