import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type IdTokenResult,
  type User
} from 'firebase/auth'
import { getFirebaseApp } from './firebase'

const INVENTARIO_ADMIN_EMAIL = (import.meta.env.VITE_INVENTARIO_ADMIN_EMAIL as string | undefined)?.trim() || 'admin@ust.cl'
const INVENTARIO_ADMIN_ROLE = 'admin'

export type InventorySession = {
  user: User | null
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
  const auth = getAuthInstance()
  if (!auth) throw new Error('Firebase no está configurado. Completa VITE_FIREBASE_* en tu .env')
  await signInWithEmailAndPassword(auth, email.trim(), password)
}

export function listenInventarioAuth(cb: (user: User | null) => void) {
  const auth = getAuthInstance()
  if (!auth) {
    cb(null)
    return () => undefined
  }
  return onAuthStateChanged(auth, cb)
}

export function listenInventarioSession(cb: (session: InventorySession) => void) {
  const auth = getAuthInstance()
  if (!auth) {
    cb({ user: null, isAdmin: false, role: null })
    return () => undefined
  }
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      cb({ user: null, isAdmin: false, role: null })
      return
    }
    let tokenResult: IdTokenResult | null = null
    try {
      tokenResult = await user.getIdTokenResult(true)
    } catch {
      tokenResult = null
    }
    const role = resolveRole(tokenResult)
    cb({ user, role, isAdmin: isAdminSession(user, role) })
  })
}

export async function logoutInventario() {
  const auth = getAuthInstance()
  if (!auth) return
  await signOut(auth)
}
