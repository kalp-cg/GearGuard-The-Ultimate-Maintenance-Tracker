import express, { Application } from 'express';
import cors from 'cors';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Create Express app
const app: Application = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'GearGuard Maintenance Tracker API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = config.port;

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   GearGuard Maintenance Tracker API       ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log('════════════════════════════════════════════');
});

export default app;
