import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from './backend/database.js';
import authRoutes from './backend/routes/auth.js';
import parkingRoutes from './backend/routes/parking.js';
import reservationRoutes from './backend/routes/reservations.js';
import userRoutes from './backend/routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Inicializar base de datos y servidor
async function startServer() {
    try {
        await initializeDatabase();
        console.log('Base de datos inicializada correctamente');
        
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
