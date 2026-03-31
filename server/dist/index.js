"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.disable('x-powered-by');
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error('Origen no permitido por CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false
}));
const globalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes, intenta nuevamente en unos minutos.' }
});
const apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Límite de peticiones API alcanzado, intenta más tarde.' }
});
app.use(globalLimiter);
app.use(express_1.default.json({ limit: '200kb' }));
app.use('/api', apiLimiter);
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});
app.use((err, req, res, _next) => {
    if (err.message.includes('CORS')) {
        return res.status(403).json({ error: 'Acceso bloqueado por política de seguridad.' });
    }
    if ('type' in err && err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Payload demasiado grande.' });
    }
    return res.status(500).json({ error: 'Error interno del servidor.' });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
