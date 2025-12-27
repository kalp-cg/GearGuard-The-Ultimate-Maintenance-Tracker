import express, { Application } from 'express';
import cors from 'cors';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Rate Limiter
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

// Create Express app 
const app: Application = express();

app.use(limiter);

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            ...config.cors.origin
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
