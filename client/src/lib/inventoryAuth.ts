import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type AuthError,
  type IdTokenResult,
  type User
} from 'firebase/auth'
import { getFirebaseApp } from './firebase'

const INVENTARIO_ADMIN_EMAIL = (import.meta.env.VITE_INVENTARIO_ADMIN_EMAIL as string | undefined)?.trim() || 'admin@ust.cl'
const INVENTARIO_ADMIN_ROLE = 'admin'
const INVENTARIO_WORKER_SESSION_KEY = 'inventario_worker_session_email'

export type InventorySession = {
  user: User | null
  email: string
  isAdmin: boolean
  role: string | null
}

function getAuthInstance() {
  const app = getFirebaseApp()
  if (!app) return null
  return getAuth(app)
}

function resolveRole(tokenResult: IdTokenResult | null) {
  const tokenRole = tokenResult?.claims?.role
  return typeof tokenRole === 'string' ? tokenRole : null
}

function isAdminSession(user: User, role: string | null) {
  return role === INVENTARIO_ADMIN_ROLE || user.email?.toLowerCase() === INVENTARIO_ADMIN_EMAIL.toLowerCase()
}

export function getInventoryAdminEmail() {
  return INVENTARIO_ADMIN_EMAIL
}

export async function loginInventario(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) throw new Error('Ingresa un correo para continuar.')
  if (normalizedEmail !== INVENTARIO_ADMIN_EMAIL.toLowerCase()) {
    localStorage.setItem(INVENTARIO_WORKER_SESSION_KEY, normalizedEmail)
    return
  }
  const auth = getAuthInstance()
  if (!auth) throw new Error('Firebase no está configurado. Completa VITE_FIREBASE_* en tu .env')
  try {
    await signInWithEmailAndPassword(auth, normalizedEmail, password)
  } catch (err) {
    const code = typeof err === 'object' && err !== null ? (err as AuthError).code : ''
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      throw new Error('Correo o clave incorrectos. Si eres trabajador nuevo, pide al administrador que te cree en Firebase Authentication.')
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.')
    }
    if (code === 'auth/network-request-failed') {
      throw new Error('No hay conexión con Firebase. Revisa internet e inténtalo de nuevo.')
    }
    throw err
  }
}

function readWorkerSessionEmail() {
  const saved = localStorage.getItem(INVENTARIO_WORKER_SESSION_KEY)?.trim().toLowerCase() || ''
  return saved
}

export function listenInventarioAuth(cb: (ok: boolean) => void) {
  const auth = getAuthInstance()
  const workerEmail = readWorkerSessionEmail()
  if (workerEmail) {
    cb(true)
    return () => undefined
  }
  if (!auth) {
    cb(false)
    return () => undefined
  }
  return onAuthStateChanged(auth, (user) => cb(Boolean(user)))
}

export function listenInventarioSession(cb: (session: InventorySession) => void) {
  const workerEmail = readWorkerSessionEmail()
  if (workerEmail) {
    cb({ user: null, email: workerEmail, isAdmin: false, role: 'trabajador' })
    return () => undefined
  }
  const auth = getAuthInstance()
  if (!auth) {
    cb({ user: null, email: '', isAdmin: false, role: null })
    return () => undefined
  }
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      cb({ user: null, email: '', isAdmin: false, role: null })
      return
    }
    let tokenResult: IdTokenResult | null = null
    try {
      tokenResult = await user.getIdTokenResult(true)
    } catch {
      tokenResult = null
    }
    const role = resolveRole(tokenResult)
    cb({ user, email: user.email ?? '', role, isAdmin: isAdminSession(user, role) })
  })
}

export async function logoutInventario() {
  localStorage.removeItem(INVENTARIO_WORKER_SESSION_KEY)
  const auth = getAuthInstance()
  if (!auth) return
  await signOut(auth)
}
