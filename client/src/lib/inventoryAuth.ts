import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { getFirebaseApp } from './firebase'

const INVENTARIO_ADMIN_USER = 'admin'
const INVENTARIO_ADMIN_EMAIL = (import.meta.env.VITE_INVENTARIO_ADMIN_EMAIL as string | undefined)?.trim() || 'admin@ust.cl'

function getAuthInstance() {
  const app = getFirebaseApp()
  if (!app) return null
  return getAuth(app)
}

export function getInventoryAdminUser() {
  return INVENTARIO_ADMIN_USER
}

export async function loginInventario(inputUser: string, password: string) {
  const auth = getAuthInstance()
  if (!auth) throw new Error('Firebase no está configurado. Completa VITE_FIREBASE_* en tu .env')
  if (inputUser.trim().toLowerCase() !== INVENTARIO_ADMIN_USER) {
    throw new Error('Usuario inválido. Usa "admin".')
  }
  await signInWithEmailAndPassword(auth, INVENTARIO_ADMIN_EMAIL, password)
}

export function listenInventarioAuth(cb: (user: User | null) => void) {
  const auth = getAuthInstance()
  if (!auth) {
    cb(null)
    return () => undefined
  }
  return onAuthStateChanged(auth, cb)
}

export async function logoutInventario() {
  const auth = getAuthInstance()
  if (!auth) return
  await signOut(auth)
}
