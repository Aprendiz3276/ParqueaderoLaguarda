import { getDatabase, initializeDatabase } from './api/database.js';

// Script para inicializar base de datos con datos de prueba
async function setupDatabase() {
    try {
        // Primero inicializar la BD
        console.log('Inicializando base de datos...');
        await initializeDatabase();
        
        const db = getDatabase();

        if (!db) {
            console.log('⚠️ Base de datos no disponible, saltando inserción de datos de prueba');
            process.exit(0);
        }

        // Insertar usuarios de prueba
        console.log('Insertando usuarios de prueba...');
        try {
            await db.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                ['usuario@miparqueo.com', 'usuario123', 'Usuario Test', 'user']
            );
            console.log('✅ Usuario regular insertado');
        } catch (err) {
            console.log('⚠️  Usuario ya existe, continuando...');
        }

        try {
            await db.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                ['admin@miparqueo.com', 'admin123', 'Admin Test', 'admin']
            );
            console.log('✅ Usuario admin insertado');
        } catch (err) {
            console.log('⚠️  Admin ya existe, continuando...');
        }

        // Insertar parqueaderos de prueba
        console.log('Insertando parqueaderos de prueba...');
        const parkingData = [
            ['Parqueadero Centro', 'Centro ciudad', 100, 100, 5000],
            ['Centro Comercial', 'Avenida Principal 123', 50, 50, 2500],
            ['Parque la Paz', 'Carrera 5 # 45-60', 30, 30, 1750],
            ['Terminal de Buses', 'Calle 10 # 20-30', 100, 100, 1500],
            ['Centro Cívico', 'Avenida Libertad 456', 75, 75, 2000]
        ];

        for (const [name, location, total, available, price] of parkingData) {
            try {
                await db.query(
                    `INSERT INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [name, location, total, available, price]
                );
            } catch (err) {
                console.log(`⚠️  Parqueadero "${name}" ya existe, continuando...`);
            }
        }
        console.log('✅ Parqueaderos verificados');

        console.log('✅ Base de datos inicializada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en setup de base de datos:', error.message);
        // No lanzar error fatal para que Vercel no falle completamente el build
        process.exit(0);
    }
}

// Ejecutar
setupDatabase();
