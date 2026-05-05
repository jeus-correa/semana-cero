import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v1/https'

initializeApp()

/** Tu estructura: colección `usuarios` → documento `trabajadores` → mapa `cuentas` por uid con campo `usuario` (string). */
const COLECCION_USUARIOS = 'usuarios'
const DOCUMENTO_TRABAJADORES = 'trabajadores'
const CAMPO_CUENTAS = 'cuentas'

function docTrabajadoresRef() {
  return getFirestore().collection(COLECCION_USUARIOS).doc(DOCUMENTO_TRABAJADORES)
}

const INVENTARIO_ADMIN_EMAIL = (process.env.INVENTARIO_ADMIN_EMAIL || 'admin@ust.cl').toLowerCase()

function isAdminContext(auth) {
  if (!auth) return false
  const role = typeof auth.token?.role === 'string' ? auth.token.role : ''
  const email = typeof auth.token?.email === 'string' ? auth.token.email.toLowerCase() : ''
  return role === 'admin' || email === INVENTARIO_ADMIN_EMAIL
}

function assertAdmin(auth) {
  if (!isAdminContext(auth)) {
    throw new HttpsError('permission-denied', 'Solo administradores pueden ejecutar esta acción.')
  }
}

function parseCreatePayload(data) {
  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : ''
  const password = typeof data?.password === 'string' ? data.password : ''
  const displayName = typeof data?.displayName === 'string' ? data.displayName.trim() : ''
  if (!email) throw new HttpsError('invalid-argument', 'El correo es obligatorio.')
  if (password.length < 6) throw new HttpsError('invalid-argument', 'La clave debe tener al menos 6 caracteres.')
  return { email, password, displayName }
}

function parseDeletePayload(data) {
  const uid = typeof data?.uid === 'string' ? data.uid.trim() : ''
  if (!uid) throw new HttpsError('invalid-argument', 'El uid es obligatorio.')
  return { uid }
}

function mapManagedUser(userRecord) {
  return {
    uid: userRecord.uid,
    email: userRecord.email || '',
    displayName: userRecord.displayName || '',
    disabled: Boolean(userRecord.disabled),
    role: typeof userRecord.customClaims?.role === 'string' ? userRecord.customClaims.role : 'user',
    createdAt: userRecord.metadata?.creationTime || null,
    lastSignInAt: userRecord.metadata?.lastSignInTime || null
  }
}

/** Convierte errores de Admin SDK / Firestore en HttpsError para que el front no muestre solo "internal". */
function toHttpsError(err) {
  if (err instanceof HttpsError) return err
  const msg =
    typeof err?.message === 'string'
      ? err.message
      : typeof err === 'string'
        ? err
        : 'Error del servidor'
  const rawCode = err?.errorInfo?.code ?? err?.code
  const code = typeof rawCode === 'string' ? rawCode : typeof rawCode === 'number' ? rawCode : ''

  // Firebase Auth Admin (p. ej. auth/email-already-exists)
  if (code === 'auth/email-already-exists') {
    return new HttpsError('already-exists', 'Ese correo ya está registrado en Authentication.')
  }
  if (code === 'auth/invalid-email') {
    return new HttpsError('invalid-argument', 'El formato del correo no es válido.')
  }
  if (code === 'auth/invalid-password' || code === 'auth/weak-password') {
    return new HttpsError('invalid-argument', 'La clave no cumple las reglas de Firebase (mínimo 6 caracteres).')
  }
  if (code === 'auth/operation-not-allowed') {
    return new HttpsError('failed-precondition', 'El proveedor correo/contraseña no está habilitado en Authentication.')
  }
  if (code === 'auth/user-not-found') {
    return new HttpsError('not-found', 'Ese usuario ya no existe en Authentication.')
  }

  // Firestore (base sin crear, permisos raros, etc.)
  if (code === 9 || code === 'FAILED_PRECONDITION' || /database.*does not exist|enable.*firestore/i.test(msg)) {
    return new HttpsError(
      'failed-precondition',
      'Revisá que la base de datos Firestore esté creada en Firebase Console (modo producción o test).'
    )
  }
  if (code === 7 || code === 'PERMISSION_DENIED') {
    return new HttpsError('permission-denied', 'Firestore rechazó la escritura. Revisá el proyecto y las APIs.')
  }

  console.error('[createInventoryUser / servidor]', code || '(sin code)', msg, err)
  return new HttpsError('internal', msg)
}

export const createInventoryUser = onCall(async (data, context) => {
  assertAdmin(context.auth)
  const { email, password, displayName } = parseCreatePayload(data)
  let createdUid = null
  try {
    const created = await getAuth().createUser({
      email,
      password,
      displayName: displayName || undefined
    })
    createdUid = created.uid
    await getAuth().setCustomUserClaims(created.uid, { role: 'user' })
    await docTrabajadoresRef().set(
      {
        [CAMPO_CUENTAS]: {
          [created.uid]: { usuario: email }
        }
      },
      { merge: true }
    )
    return { uid: created.uid, email: created.email || email }
  } catch (err) {
    if (createdUid) {
      try {
        await getAuth().deleteUser(createdUid)
      } catch (rollbackErr) {
        console.error('[createInventoryUser] rollback Auth falló', rollbackErr)
      }
    }
    throw toHttpsError(err)
  }
})

export const deleteInventoryUser = onCall(async (data, context) => {
  try {
    assertAdmin(context.auth)
    const { uid } = parseDeletePayload(data)
    if (context.auth?.uid === uid) {
      throw new HttpsError('failed-precondition', 'No puedes eliminar tu propia cuenta.')
    }
    await getAuth().deleteUser(uid)
    try {
      await docTrabajadoresRef().update({
        [`${CAMPO_CUENTAS}.${uid}`]: FieldValue.delete()
      })
    } catch {
      // Si el doc no existe o ya no estaba la cuenta, no falla el borrado en Auth.
    }
    return { ok: true }
  } catch (err) {
    throw toHttpsError(err)
  }
})

export const listInventoryUsers = onCall(async (_data, context) => {
  try {
    assertAdmin(context.auth)
    const users = []
    let pageToken
    do {
      const batch = await getAuth().listUsers(1000, pageToken)
      batch.users.forEach((u) => users.push(mapManagedUser(u)))
      pageToken = batch.pageToken
    } while (pageToken)
    users.sort((a, b) => a.email.localeCompare(b.email, 'es'))
    return { users }
  } catch (err) {
    throw toHttpsError(err)
  }
})
