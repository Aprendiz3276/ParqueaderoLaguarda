import { getDatabase } from './backend/database.js';

// Script para inicializar base de datos con datos de prueba
async function setupDatabase() {
    try {
        const db = getDatabase();

        // Insertar usuarios de prueba
        console.log('Insertando usuarios de prueba...');
        await db.run(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            ['usuario@example.com', '1234', 'Juan Pérez García', 'user']
        );

        await db.run(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            ['admin@example.com', '1234', 'Administrador Sistema', 'admin']
        );

        // Insertar parqueaderos de prueba
        console.log('Insertando parqueaderos de prueba...');
        const parkingData = [
            ['Centro Comercial', 'Avenida Principal 123', 50, 50, 2.50],
            ['Parque la Paz', 'Carrera 5 # 45-60', 30, 30, 1.75],
            ['Terminal de Buses', 'Calle 10 # 20-30', 100, 100, 1.50],
            ['Centro Cívico', 'Avenida Libertad 456', 75, 75, 2.00]
        ];

        for (const [name, location, total, available, price] of parkingData) {
            await db.run(
                'INSERT INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) VALUES (?, ?, ?, ?, ?)',
                [name, location, total, available, price]
            );
        }

        // Insertar vehículos de prueba para el usuario
        console.log('Insertando vehículos de prueba...');
        await db.run(
            'INSERT INTO vehicles (user_id, plate, model) VALUES (?, ?, ?)',
            [1, 'ABC-1234', 'Toyota Corolla 2023']
        );

        await db.run(
            'INSERT INTO vehicles (user_id, plate, model) VALUES (?, ?, ?)',
            [1, 'XYZ-5678', 'Honda Civic 2022']
        );

        console.log('✅ Base de datos inicializada con éxito');
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE')) {
            console.log('⚠️  Los datos de prueba ya existen, continuando...');
        } else {
            console.error('❌ Error al inicializar la base de datos:', error);
        }
    }
}

setupDatabase();
