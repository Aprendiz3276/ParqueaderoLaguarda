import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = './data/miparqueo.db';

const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
        console.error('Error al conectar a la BD:', err);
        process.exit(1);
    }

    try {
        // Actualizar contraseña del admin
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET password = ? WHERE email = ?`,
                ['1234', 'admin@example.com'],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Actualizar contraseña del usuario
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET password = ? WHERE email = ?`,
                ['1234', 'usuario@example.com'],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('✅ Contraseñas actualizadas:');
        console.log('   - Admin: admin@example.com / 1234');
        console.log('   - Usuario: usuario@example.com / 1234');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
});
