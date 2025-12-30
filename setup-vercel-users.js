import dotenv from 'dotenv';
import { initializeDatabase, getDatabase } from './api/database.js';

dotenv.config();

// Script para insertar usuarios de prueba en la base de datos
// Funciona tanto para PostgreSQL (Vercel/Supabase) como SQLite (local)

async function setupVercelUsers() {
    try {
        console.log('🔄 Inicializando conexión a base de datos...');
        await initializeDatabase();
        
        const db = getDatabase();
        
        if (!db) {
            console.error('❌ No se pudo conectar a la base de datos');
            console.log('💡 Verifica tus variables de entorno:');
            console.log('   - DATABASE_URL (para Supabase/PostgreSQL)');
            console.log('   - O DB_TYPE=sqlite para SQLite local');
            process.exit(1);
        }

        console.log('✅ Conexión a base de datos establecida\n');

        // Usuarios de prueba (las credenciales correctas según README)
        const testUsers = [
            {
                email: 'usuario@example.com',
                password: '1234',
                name: 'Usuario de Prueba',
                role: 'user'
            },
            {
                email: 'admin@example.com',
                password: '1234',
                name: 'Administrador',
                role: 'admin'
            }
        ];

        // Parqueaderos de prueba
        const testParking = [
            {
                name: 'Parqueadero Centro',
                location: 'Calle 50 #15-20',
                total_spaces: 150,
                available_spaces: 120,
                price_per_hour: 5000
            },
            {
                name: 'Parqueadero Norte',
                location: 'Carrera 7 #100-50',
                total_spaces: 200,
                available_spaces: 85,
                price_per_hour: 4000
            },
            {
                name: 'Parqueadero Mall',
                location: 'Avenida Boyacá #120-10',
                total_spaces: 500,
                available_spaces: 350,
                price_per_hour: 3500
            }
        ];

        // Insertar usuarios
        console.log('👥 Insertando usuarios de prueba...');
        for (const user of testUsers) {
            try {
                // Verificar si el usuario ya existe
                const existing = await db.query(
                    'SELECT id FROM users WHERE email = ?',
                    [user.email]
                );

                if (existing && existing.length > 0) {
                    // Actualizar contraseña si ya existe
                    try {
                        await db.run(
                            'UPDATE users SET password = ?, name = ?, role = ? WHERE email = ?',
                            [user.password, user.name, user.role, user.email]
                        );
                        console.log(`   ✅ Usuario actualizado: ${user.email} (${user.role})`);
                    } catch (updateError) {
                        // Si falla el UPDATE, intentar INSERT con ON CONFLICT
                        console.log(`   ⚠️  No se pudo actualizar ${user.email}, intentando insertar...`);
                        throw updateError;
                    }
                } else {
                    // Insertar nuevo usuario
                    await db.run(
                        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
                        [user.email, user.password, user.name, user.role]
                    );
                    console.log(`   ✅ Usuario creado: ${user.email} (${user.role})`);
                }
            } catch (error) {
                // Intentar insertar con manejo de duplicados
                if (error.message.includes('UNIQUE') || error.message.includes('duplicate')) {
                    console.log(`   ⚠️  Usuario ${user.email} ya existe, continuando...`);
                } else {
                    console.error(`   ❌ Error con usuario ${user.email}:`, error.message);
                }
            }
        }

        // Insertar parqueaderos
        console.log('\n🅿️  Insertando parqueaderos de prueba...');
        for (const parking of testParking) {
            try {
                const existing = await db.query(
                    'SELECT id FROM parking_lots WHERE name = ?',
                    [parking.name]
                );

                if (existing && existing.length > 0) {
                    console.log(`   ⚠️  Parqueadero ya existe: ${parking.name}`);
                } else {
                    await db.run(
                        'INSERT INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) VALUES (?, ?, ?, ?, ?)',
                        [parking.name, parking.location, parking.total_spaces, parking.available_spaces, parking.price_per_hour]
                    );
                    console.log(`   ✅ Parqueadero creado: ${parking.name}`);
                }
            } catch (error) {
                if (error.message.includes('UNIQUE') || error.message.includes('duplicate')) {
                    console.log(`   ⚠️  Parqueadero ${parking.name} ya existe, continuando...`);
                } else {
                    console.error(`   ❌ Error con parqueadero ${parking.name}:`, error.message);
                }
            }
        }

        console.log('\n✅ ¡Datos de prueba insertados exitosamente!');
        console.log('\n📋 Credenciales de acceso:');
        console.log('   👤 Usuario: usuario@example.com / 1234');
        console.log('   👨‍💼 Admin: admin@example.com / 1234');
        console.log('\n🚀 Ya puedes probar el login en tu aplicación\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\n💡 Verifica:');
        console.error('   1. Variables de entorno configuradas correctamente');
        console.error('   2. Base de datos accesible');
        console.error('   3. Tablas creadas (ejecuta npm run setup-db primero)');
        process.exit(1);
    }
}

// Ejecutar
setupVercelUsers();

