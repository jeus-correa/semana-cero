import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { PrismaClient, Role, UnitKey } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

dotenv.config()

const prisma = new PrismaClient()
const app = express()
const port = Number(process.env.PORT ?? 3000)
const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-this'

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function isAllowedDevOrigin(origin: string) {
  try {
    const url = new URL(origin)
    const host = url.hostname
    const isLocalhost = host === 'localhost' || host === '127.0.0.1'
    const isPrivateIp = /^192\.168\./.test(host) || /^10\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    return isLocalhost || isPrivateIp
  } catch {
    return false
  }
}

type AuthUser = {
  id: string
  email: string
  fullName: string
  role: Role
  unit: UnitKey | null
}

type AuthenticatedRequest = Request & { authUser?: AuthUser }

const safeUserSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  unit: true,
  createdAt: true
} as const

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(120)
})

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(120),
  fullName: z.string().min(3).max(120),
  role: z.nativeEnum(Role),
  unit: z.nativeEnum(UnitKey).nullable().optional()
})

const supportItemSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(3).max(500),
  contentUrl: z.string().url(),
  unit: z.nativeEnum(UnitKey)
})

function sanitizeUrl(url: string) {
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('URL inválida')
  }
  return parsed.toString()
}

function signToken(user: AuthUser) {
  return jwt.sign(user, jwtSecret, { expiresIn: '8h' })
}

function authRequired(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Debes iniciar sesión.' })
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthUser
    req.authUser = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}

function requireGeneralAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.authUser?.role !== 'ADMIN_GENERAL') {
    return res.status(403).json({ error: 'Solo admin general puede hacer esto.' })
  }
  next()
}

function canManageUnit(reqUser: AuthUser, unit: UnitKey) {
  if (reqUser.role === 'ADMIN_GENERAL') return true
  if (reqUser.role === 'ADMIN_UNIT' && reqUser.unit === unit) return true
  return false
}

app.disable('x-powered-by')

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
)

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })
)

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta nuevamente en unos minutos.' }
})

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Límite de peticiones API alcanzado, intenta más tarde.' }
})

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`)
  next()
})

app.use(globalLimiter)
app.use(express.json({ limit: '200kb' }))
app.use('/api', apiLimiter)

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos de login inválidos.' })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return res.status(401).json({ error: 'Credenciales incorrectas.' })

  const okPassword = await bcrypt.compare(password, user.passwordHash)
  if (!okPassword) return res.status(401).json({ error: 'Credenciales incorrectas.' })

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    unit: user.unit
  }

  const token = signToken(authUser)
  return res.json({ token, user: authUser })
})

app.get('/api/auth/me', authRequired, async (req: AuthenticatedRequest, res: Response) => {
  const me = await prisma.user.findUnique({
    where: { id: req.authUser!.id },
    select: safeUserSelect
  })
  if (!me) return res.status(404).json({ error: 'Usuario no encontrado.' })
  return res.json(me)
})

app.post('/api/admin/users', authRequired, requireGeneralAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos para crear usuario.' })
  }

  const { email, password, fullName, role, unit } = parsed.data
  if (role === 'STUDENT') {
    return res.status(400).json({ error: 'Las cuentas de estudiantes no se crean en este panel.' })
  }
  if (role === 'ADMIN_UNIT' && !unit) {
    return res.status(400).json({ error: 'Admin de unidad debe tener una unidad asignada.' })
  }

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) return res.status(409).json({ error: 'Este correo ya existe.' })

  const passwordHash = await bcrypt.hash(password, 12)
  const created = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role,
      unit: role === 'ADMIN_GENERAL' ? null : unit ?? null
    },
    select: safeUserSelect
  })

  return res.status(201).json(created)
})

app.get('/api/admin/users', authRequired, requireGeneralAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: safeUserSelect
  })
  return res.json(users)
})

app.get('/api/support-items', async (req: Request, res: Response) => {
  const rawUnit = req.query.unit
  const unit = Array.isArray(rawUnit) ? rawUnit[0] : rawUnit
  const where = typeof unit === 'string' ? { unit: unit as UnitKey } : undefined
  const items = await prisma.supportItem.findMany({
    where,
    orderBy: [{ unit: 'asc' }, { createdAt: 'desc' }]
  })
  return res.json(items)
})

app.post('/api/support-items', authRequired, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = supportItemSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos para contenido.' })
  }

  const payload = parsed.data
  if (!canManageUnit(req.authUser!, payload.unit)) {
    return res.status(403).json({ error: 'No tienes permisos para esa unidad.' })
  }

  const item = await prisma.supportItem.create({
    data: {
      ...payload,
      contentUrl: sanitizeUrl(payload.contentUrl),
      createdById: req.authUser!.id
    }
  })

  return res.status(201).json(item)
})

app.delete('/api/support-items/:id', authRequired, async (req: AuthenticatedRequest, res: Response) => {
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const existing = await prisma.supportItem.findUnique({ where: { id: itemId } })
  if (!existing) return res.status(404).json({ error: 'Contenido no encontrado.' })

  if (!canManageUnit(req.authUser!, existing.unit)) {
    return res.status(403).json({ error: 'No tienes permisos para eliminar este contenido.' })
  }

  await prisma.supportItem.delete({ where: { id: existing.id } })
  return res.status(204).send()
})

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: 'Acceso bloqueado por política de seguridad.' })
  }
  if ('type' in err && (err as { type?: string }).type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload demasiado grande.' })
  }
  return res.status(500).json({ error: 'Error interno del servidor.' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`API escuchando en http://127.0.0.1:${port} (también LAN en :${port})`)
})
