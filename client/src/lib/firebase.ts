import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'

/** Config desde la consola de Firebase → Configuración del proyecto → Tus apps → Web. */
function readWebConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined
  }
}

export function isFirebaseConfigured(): boolean {
  const c = readWebConfig()
  return Boolean(
    c.apiKey?.trim() &&
      c.projectId?.trim() &&
      c.appId?.trim() &&
      c.authDomain?.trim() &&
      c.storageBucket?.trim() &&
      c.messagingSenderId?.trim()
  )
}

let appSingleton: FirebaseApp | null = null

/** `null` si faltan variables `VITE_FIREBASE_*` (en ese caso el contador usa CountAPI como respaldo). */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null
  if (appSingleton) return appSingleton
  if (getApps().length > 0) {
    appSingleton = getApps()[0]!
    return appSingleton
  }
  const c = readWebConfig()
  appSingleton = initializeApp({
    apiKey: c.apiKey!,
    authDomain: c.authDomain!,
    projectId: c.projectId!,
    storageBucket: c.storageBucket!,
    messagingSenderId: c.messagingSenderId!,
    appId: c.appId!
  })
  return appSingleton
}
