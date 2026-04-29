import { doc, getDoc, getFirestore, increment, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { getFirebaseApp } from './firebase'

export const VISITS_BASE = 2550
const VISITS_NAMESPACE = 'st-curico-semana-cero-2026'
const VISITS_KEY = 'visitas-total'
export const VISITS_LOCAL_KEY = 'st_visits_fallback'

/** Colección / documento / campo (coinciden con lo que creaste en la consola de Firebase). */
const FIRESTORE_VISITS_COLLECTION = 'contador'
const FIRESTORE_VISITS_DOC = 'lYLaLHhXNCaRt2nRkSAz'
const FIRESTORE_VISITS_FIELD = 'vistas' as const

let visitsOncePromise: Promise<number> | null = null

function normalizeCountValue(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return null
}

async function getCountApiValue(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.countapi.xyz/get/${VISITS_NAMESPACE}/${key}`)
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    return normalizeCountValue(data.value)
  } catch {
    return null
  }
}

async function setCountApiValue(key: string, value: number): Promise<boolean> {
  try {
    const res = await fetch(`https://api.countapi.xyz/set/${VISITS_NAMESPACE}/${key}?value=${value}`)
    return res.ok
  } catch {
    return false
  }
}

async function incrementCountApiRemote(key: string): Promise<number> {
  const hitRes = await fetch(`https://api.countapi.xyz/hit/${VISITS_NAMESPACE}/${key}`)
  if (hitRes.ok) {
    const data = (await hitRes.json()) as { value?: unknown }
    const v = normalizeCountValue(data.value)
    if (v !== null) return v
  }
  const updRes = await fetch(`https://api.countapi.xyz/update/${VISITS_NAMESPACE}/${key}?amount=1`)
  if (!updRes.ok) throw new Error('No se pudo incrementar contador remoto')
  const data = (await updRes.json()) as { value?: unknown }
  const v = normalizeCountValue(data.value)
  if (v === null) throw new Error('Respuesta invalida de contador')
  return v
}

function bumpLocalVisitsSafe(): number {
  try {
    const raw = Number(localStorage.getItem(VISITS_LOCAL_KEY) ?? String(VISITS_BASE))
    const safeRaw = Number.isFinite(raw) ? Math.max(raw, VISITS_BASE) : VISITS_BASE
    const next = safeRaw + 1
    localStorage.setItem(VISITS_LOCAL_KEY, String(next))
    return next
  } catch {
    return VISITS_BASE + 1
  }
}

export function getBumpedVisitCountOnce(): Promise<number> {
  if (visitsOncePromise) return visitsOncePromise
  visitsOncePromise = Promise.resolve(bumpLocalVisitsSafe())
  return visitsOncePromise
}

async function syncFirestoreAfterLocalBump(localFloor: number): Promise<number | null> {
  const app = getFirebaseApp()
  if (!app) return null
  const db = getFirestore(app)
  const ref = doc(db, FIRESTORE_VISITS_COLLECTION, FIRESTORE_VISITS_DOC)
  try {
    // Evita conflictos de precondición bajo concurrencia alta.
    await setDoc(ref, { [FIRESTORE_VISITS_FIELD]: increment(1), updatedAt: serverTimestamp() }, { merge: true })
    const snap = await getDoc(ref)
    if (!snap.exists()) return localFloor
    const remote = normalizeCountValue(snap.data()?.[FIRESTORE_VISITS_FIELD]) ?? localFloor
    return Math.max(remote, localFloor, VISITS_BASE)
  } catch {
    return null
  }
}

async function syncCountApiAfterLocalBump(localFloor: number): Promise<number | null> {
  try {
    const current = await getCountApiValue(VISITS_KEY)
    if (current === null || current < VISITS_BASE) {
      const ok = await setCountApiValue(VISITS_KEY, VISITS_BASE)
      if (!ok) throw new Error('set base remoto falló')
    }
    const remoteAfterHit = await incrementCountApiRemote(VISITS_KEY)
    return Math.max(remoteAfterHit, VISITS_BASE, localFloor)
  } catch {
    return null
  }
}

/** Sincroniza el +1 con Firestore si hay config; si no, con CountAPI (modo sin Firebase). */
export async function syncVisitsAfterLocalBump(localFloor: number): Promise<number | null> {
  if (getFirebaseApp()) return syncFirestoreAfterLocalBump(localFloor)
  return syncCountApiAfterLocalBump(localFloor)
}

/** Escucha cambios de vistas en tiempo real (solo Firestore). */
export function subscribeVisitsRealtime(onValue: (value: number) => void): (() => void) | null {
  const app = getFirebaseApp()
  if (!app) return null
  const db = getFirestore(app)
  const ref = doc(db, FIRESTORE_VISITS_COLLECTION, FIRESTORE_VISITS_DOC)
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return
    const raw = snap.data()?.[FIRESTORE_VISITS_FIELD]
    const parsed = normalizeCountValue(raw)
    if (parsed == null) return
    onValue(Math.max(parsed, VISITS_BASE))
  })
}
