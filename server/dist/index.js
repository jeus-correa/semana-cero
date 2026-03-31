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
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? 3000);
const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-this';
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
function isAllowedDevOrigin(origin) {
    try {
        const url = new URL(origin);
        const host = url.hostname;
        const isLocalhost = host === 'localhost' || host === '127.0.0.1';
        const isPrivateIp = /^192\.168\./.test(host) || /^10\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
        return isLocalhost || isPrivateIp;
    }
    catch {
        return false;
    }
}
const safeUserSelect = {
    id: true,
    email: true,
    fullName: true,
    role: true,
    unit: true,
    createdAt: true
};
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(120)
});
const createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(120),
    fullName: zod_1.z.string().min(3).max(120),
    role: zod_1.z.nativeEnum(client_1.Role),
    unit: zod_1.z.nativeEnum(client_1.UnitKey).nullable().optional()
});
const supportItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(140),
    description: zod_1.z.string().min(3).max(500),
    contentUrl: zod_1.z.string().url(),
    unit: zod_1.z.nativeEnum(client_1.UnitKey)
});
function sanitizeUrl(url) {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('URL inválida');
    }
    return parsed.toString();
}
function signToken(user) {
    return jsonwebtoken_1.default.sign(user, jwtSecret, { expiresIn: '8h' });
}
function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: 'Debes iniciar sesión.' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.authUser = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
}
function requireGeneralAdmin(req, res, next) {
    if (req.authUser?.role !== 'ADMIN_GENERAL') {
        return res.status(403).json({ error: 'Solo admin general puede hacer esto.' });
    }
    next();
}
function canManageUnit(reqUser, unit) {
    if (reqUser.role === 'ADMIN_GENERAL')
        return true;
    if (reqUser.role === 'ADMIN_UNIT' && reqUser.unit === unit)
        return true;
    return false;
}
app.disable('x-powered-by');
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || isAllowedDevOrigin(origin))
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
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});
app.post('/api/auth/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Datos de login inválidos.' });
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user)
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    const okPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!okPassword)
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    const authUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        unit: user.unit
    };
    const token = signToken(authUser);
    return res.json({ token, user: authUser });
});
app.get('/api/auth/me', authRequired, async (req, res) => {
    const me = await prisma.user.findUnique({
        where: { id: req.authUser.id },
        select: safeUserSelect
    });
    if (!me)
        return res.status(404).json({ error: 'Usuario no encontrado.' });
    return res.json(me);
});
app.post('/api/admin/users', authRequired, requireGeneralAdmin, async (req, res) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Datos inválidos para crear usuario.' });
    }
    const { email, password, fullName, role, unit } = parsed.data;
    if (role === 'ADMIN_UNIT' && !unit) {
        return res.status(400).json({ error: 'Admin de unidad debe tener una unidad asignada.' });
    }
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists)
        return res.status(409).json({ error: 'Este correo ya existe.' });
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const created = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            passwordHash,
            fullName,
            role,
            unit: role === 'ADMIN_GENERAL' ? null : unit ?? null
        },
        select: safeUserSelect
    });
    return res.status(201).json(created);
});
app.get('/api/admin/users', authRequired, requireGeneralAdmin, async (_req, res) => {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: safeUserSelect
    });
    return res.json(users);
});
app.get('/api/support-items', authRequired, async (req, res) => {
    const rawUnit = req.query.unit;
    const unit = Array.isArray(rawUnit) ? rawUnit[0] : rawUnit;
    const where = typeof unit === 'string' ? { unit: unit } : undefined;
    const items = await prisma.supportItem.findMany({
        where,
        orderBy: [{ unit: 'asc' }, { createdAt: 'desc' }]
    });
    return res.json(items);
});
app.post('/api/support-items', authRequired, async (req, res) => {
    const parsed = supportItemSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Datos inválidos para contenido.' });
    }
    const payload = parsed.data;
    if (!canManageUnit(req.authUser, payload.unit)) {
        return res.status(403).json({ error: 'No tienes permisos para esa unidad.' });
    }
    const item = await prisma.supportItem.create({
        data: {
            ...payload,
            contentUrl: sanitizeUrl(payload.contentUrl),
            createdById: req.authUser.id
        }
    });
    return res.status(201).json(item);
});
app.delete('/api/support-items/:id', authRequired, async (req, res) => {
    const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const existing = await prisma.supportItem.findUnique({ where: { id: itemId } });
    if (!existing)
        return res.status(404).json({ error: 'Contenido no encontrado.' });
    if (!canManageUnit(req.authUser, existing.unit)) {
        return res.status(403).json({ error: 'No tienes permisos para eliminar este contenido.' });
    }
    await prisma.supportItem.delete({ where: { id: existing.id } });
    return res.status(204).send();
});
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});
app.use((err, _req, res, _next) => {
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
