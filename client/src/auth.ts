export type UserRole = 'STUDENT' | 'ADMIN_UNIT' | 'ADMIN_GENERAL'

export type UnitKey =
  | 'BIBLIOTECA'
  | 'DAE'
  | 'CENTRO_APRENDIZAJE'
  | 'REGISTRO_CURRICULAR'
  | 'DAO'
  | 'SOPORTE_INFORMATICA'
  | 'FORMACION'
  | 'FORMACION_DOCENTE'
  | 'COMO_IMPRIMIR'

export type SessionUser = {
  id: string
  email: string
  fullName: string
  role: UserRole
  unit: UnitKey | null
}

const TOKEN_KEY = 'st_auth_token'
const USER_KEY = 'st_auth_user'

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
