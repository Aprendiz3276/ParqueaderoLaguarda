import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from '../backend/database.js';

dotenv.config();

const app = express();

// Flag para rastrear inicialización
let dbInitialized = false;
let initError = null;
let initPromise = null;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint (ANTES de inicializar rutas)
app.get('/api/health', (req, res) => {
    const dbTypeEnv = process.env.DB_TYPE || 'no definido';
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const databaseUrlPreview = process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.substring(0, 30) + '...' : 'no definido';
    
    res.status(200).json({ 
        status: dbInitialized ? 'ok' : (initError ? 'error' : 'initializing'),
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString(),
        environment: 'Vercel',
        nodeEnv: process.env.NODE_ENV,
        dbStatus: dbInitialized ? 'connected' : (initError ? 'failed' : 'connecting'),
        error: initError ? initError.message : null,
        debug: {
            DB_TYPE: dbTypeEnv,
            DATABASE_URL_configured: hasDatabaseUrl,
            DATABASE_URL_preview: databaseUrlPreview,
            initializationAttempted: !!initPromise
        }
    });
});

// Inicializar base de datos (una sola vez)
const initDB = async () => {
    if (dbInitialized || initError || initPromise) {
        return;
    }
    
    initPromise = (async () => {
        try {
            console.log('Iniciando base de datos...');
            console.log('DB_TYPE:', process.env.DB_TYPE);
            console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
            
            await initializeDatabase();
            dbInitialized = true;
            console.log('Base de datos inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando base de datos:', error.message);
            console.error('Error stack:', error.stack);
            initError = error;
        }
    })();
    
    await initPromise;
};

// Middleware de inicialización
app.use(async (req, res, next) => {
    await initDB();
    next();
});

// Cargar rutas DESPUÉS de intentar inicializar BD
(async () => {
    try {
        const authRoutes = (await import('../backend/routes/auth.js')).default;
        const parkingRoutes = (await import('../backend/routes/parking.js')).default;
        const reservationRoutes = (await import('../backend/routes/reservations.js')).default;
        const userRoutes = (await import('../backend/routes/users.js')).default;

        // Rutas API
        app.use('/api/auth', authRoutes);
        app.use('/api/parking', parkingRoutes);
        app.use('/api/reservations', reservationRoutes);
        app.use('/api/users', userRoutes);
        
        console.log('Rutas cargadas correctamente');
    } catch (error) {
        console.error('Error cargando rutas:', error);
    }
})();

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Error interno del servidor',
        status: err.status || 500,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: true, 
        message: 'Ruta no encontrada' 
    });
});

export default app;
