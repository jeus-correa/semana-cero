import { deleteField, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { getFirebaseApp } from './firebase'

/** Misma ruta que acordamos: colección usuarios → documento trabajadores → mapa cuentas → { usuario: string }. */
const COLECCION_USUARIOS = 'usuarios'
const DOCUMENTO_TRABAJADORES = 'trabajadores'
const CAMPO_CUENTAS = 'cuentas'

export type InventoryManagedUser = {
  uid: string
  email: string
  displayName: string
  disabled: boolean
  role: string
  createdAt: string | null
  lastSignInAt: string | null
}

type CreateUserPayload = {
  email: string
  password: string
  displayName?: string
}

type CreateUserResponse = {
  uid: string
  email: string
}

type DeleteUserPayload = {
  uid: string
}

function getDb() {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase no está configurado. Completa VITE_FIREBASE_* en tu .env')
  return getFirestore(app)
}

function trabajadoresDocRef() {
  return doc(getDb(), COLECCION_USUARIOS, DOCUMENTO_TRABAJADORES)
}

export async function listInventoryUsers(): Promise<InventoryManagedUser[]> {
  const snap = await getDoc(trabajadoresDocRef())
  if (!snap.exists()) return []
  const raw = snap.data()?.[CAMPO_CUENTAS]
  if (!raw || typeof raw !== 'object') return []
  const cuentas = raw as Record<string, unknown>
  return Object.entries(cuentas).map(([uid, val]) => {
    const row = val as { usuario?: unknown; nombre?: unknown }
    const usuario = typeof row?.usuario === 'string' ? row.usuario : ''
    const nombre = typeof row?.nombre === 'string' ? row.nombre : ''
    return {
      uid,
      email: usuario,
      displayName: nombre,
      disabled: false,
      role: 'trabajador',
      createdAt: null,
      lastSignInAt: null
    }
  })
}

/** Plan gratis: solo guarda en Firestore. La clave de inicio de sesión la definís en Authentication (consola). */
export async function createInventoryUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
  const email = payload.email.trim().toLowerCase()
  if (!email) throw new Error('El correo es obligatorio.')

  const ref = trabajadoresDocRef()
  const snap = await getDoc(ref)
  const cuentas = snap.exists() ? (snap.data()?.[CAMPO_CUENTAS] as Record<string, { usuario?: string }> | undefined) : undefined
  if (cuentas && typeof cuentas === 'object') {
    for (const row of Object.values(cuentas)) {
      if (typeof row?.usuario === 'string' && row.usuario.toLowerCase() === email) {
        throw new Error('Ese correo ya está en la lista.')
      }
    }
  }

  const id = crypto.randomUUID()
  const entry: { usuario: string; nombre?: string } = { usuario: email }
  const nombre = payload.displayName?.trim()
  if (nombre) entry.nombre = nombre

  await setDoc(
    ref,
    {
      [CAMPO_CUENTAS]: {
        [id]: entry
      }
    },
    { merge: true }
  )
  return { uid: id, email }
}

export async function deleteInventoryUser(payload: DeleteUserPayload): Promise<void> {
  const uid = payload.uid.trim()
  if (!uid) throw new Error('Falta el identificador.')
  const ref = trabajadoresDocRef()
  try {
    await updateDoc(ref, {
      [`${CAMPO_CUENTAS}.${uid}`]: deleteField()
    })
  } catch {
    // Si el documento no existe, no hay nada que borrar.
  }
}

/** Mensaje legible para errores de Firestore o del flujo. */
export function formatCallableError(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const code = 'code' in err && typeof (err as { code: unknown }).code === 'string' ? (err as { code: string }).code : ''
    const msg = String((err as { message: unknown }).message).trim()
    if (code === 'functions/not-found' || /not\s*found/i.test(msg)) {
      return 'Las Cloud Functions no están desplegadas o no coinciden con esta región. Revisá el deploy en Firebase (plan Blaze) y la región us-central1.'
    }
    if (
      code === 'functions/permission-denied' ||
      code === 'permission-denied' ||
      code === 'firestore/permission-denied'
    ) {
      return 'No tenés permiso para escribir acá. Revisá que estés logueado como administrador y que las reglas de Firestore estén actualizadas (deploy de rules).'
    }
    if (code === 'functions/already-exists' || code === 'already-exists') {
      return msg || 'Ese recurso ya existe (por ejemplo el correo ya está registrado).'
    }
    if (code === 'functions/internal' && msg && msg !== 'INTERNAL') {
      return `${msg} (${code})`
    }
    if (code === 'functions/failed-precondition' || code === 'failed-precondition') {
      return msg ? `${msg} (${code})` : 'Falta alguna configuración en Firebase (revisá Authentication y Firestore).'
    }
    return code ? `${msg} (${code})` : msg
  }
  if (err instanceof Error) return err.message
  return 'Ocurrió un error desconocido.'
}
