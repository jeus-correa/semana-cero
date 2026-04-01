import { getToken, type SessionUser, type UnitKey, type UserRole } from './auth'

/** Si abres Vite por IP (ej. iPhone en la misma red), VITE_API_URL=localhost apunta al dispositivo equivocado; priorizamos el mismo host que la página. */
function buildApiCandidates(): string[] {
  const proto = window.location.protocol
  const host = window.location.hostname
  const sameHost = `${proto}//${host}:3000`
  const vite = import.meta.env.VITE_API_URL as string | undefined
  const viteIsLocal =
    vite &&
    (vite.includes('localhost') || vite.includes('127.0.0.1'))
  const onLoopback = host === 'localhost' || host === '127.0.0.1'

  const list: string[] = []
  if (!onLoopback) {
    list.push(sameHost)
    if (vite && !viteIsLocal) list.push(vite)
  } else {
    if (vite) list.push(vite)
    list.push(sameHost)
  }
  list.push('http://localhost:3000', 'http://127.0.0.1:3000')
  return Array.from(new Set(list.filter(Boolean)))
}

const API_CANDIDATES = buildApiCandidates()

type ApiOptions = {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  auth?: boolean
}

async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (options.auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res: Response | null = null
  let connected = false
  for (const base of API_CANDIDATES) {
    try {
      res = await fetch(`${base}${path}`, {
        method: options.method ?? 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      })
      connected = true
      break
    } catch {
      // Intentar siguiente host candidato
    }
  }

  if (!connected || !res) {
    throw new Error('Error al conectar con el servidor. Inicia backend con: npm run server')
  }

  if (!res.ok) {
    let message = 'Error de servidor'
    try {
      const data = (await res.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // keep default
    }
    throw new Error(message)
  }

  if (res.status === 204) return null as T
  return (await res.json()) as T
}

export function login(email: string, password: string) {
  return apiFetch<{ token: string; user: SessionUser }>('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  })
}

export function me() {
  return apiFetch<SessionUser>('/api/auth/me', { auth: true })
}

export function listUsers() {
  return apiFetch<
    Array<{
      id: string
      email: string
      fullName: string
      role: UserRole
      unit: UnitKey | null
      createdAt: string
    }>
  >('/api/admin/users', { auth: true })
}

export function createUser(payload: {
  email: string
  password: string
  fullName: string
  role: UserRole
  unit?: UnitKey | null
}) {
  return apiFetch('/api/admin/users', {
    method: 'POST',
    body: payload,
    auth: true
  })
}

export type SupportItem = {
  id: string
  title: string
  description: string
  contentUrl: string
  unit: UnitKey
  createdById: string
  createdAt: string
}

export function listSupportItems(unit?: UnitKey) {
  const qs = unit ? `?unit=${encodeURIComponent(unit)}` : ''
  return apiFetch<SupportItem[]>(`/api/support-items${qs}`)
}

export function createSupportItem(payload: {
  title: string
  description: string
  contentUrl: string
  unit: UnitKey
}) {
  return apiFetch<SupportItem>('/api/support-items', {
    method: 'POST',
    body: payload,
    auth: true
  })
}

export function deleteSupportItem(id: string) {
  return apiFetch<null>(`/api/support-items/${id}`, {
    method: 'DELETE',
    auth: true
  })
}
