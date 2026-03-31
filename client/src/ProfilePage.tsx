import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createSupportItem, createUser, deleteSupportItem, listSupportItems, listUsers } from './api'
import { clearSession, getSessionUser, type UnitKey, type UserRole } from './auth'
import './ProfilePage.css'

const UNIT_OPTIONS: { value: UnitKey; label: string; detail: string }[] = [
  { value: 'BIBLIOTECA', label: 'Biblioteca', detail: 'Recursos, préstamos y apoyo bibliográfico.' },
  { value: 'DAE', label: 'DAE', detail: 'Vida estudiantil, beneficios y acompañamiento.' },
  { value: 'CENTRO_APRENDIZAJE', label: 'Centro de Aprendizaje', detail: 'Tutorías y reforzamiento académico.' },
  { value: 'REGISTRO_CURRICULAR', label: 'Registro Curricular', detail: 'Documentación y procesos académicos.' },
  { value: 'DAO', label: 'DAO', detail: 'Aranceles, pagos y convenios.' },
  { value: 'SOPORTE_INFORMATICA', label: 'Soporte de Informática', detail: 'Plataformas y soporte técnico.' },
  { value: 'FORMACION', label: 'Formación', detail: 'Material institucional de formación.' },
  { value: 'FORMACION_DOCENTE', label: 'Formación Docente', detail: 'Apoyo y recursos para docencia.' },
  { value: 'COMO_IMPRIMIR', label: 'Cómo imprimir', detail: 'Guías de impresión y uso de laboratorio.' }
]

type SupportItem = Awaited<ReturnType<typeof listSupportItems>>[number]

export function ProfilePage() {
  const navigate = useNavigate()
  const [sessionUser] = useState(getSessionUser())
  const [tab, setTab] = useState<'perfil' | 'usuarios' | 'contenidos'>('perfil')
  const [users, setUsers] = useState<Awaited<ReturnType<typeof listUsers>>>([])
  const [items, setItems] = useState<SupportItem[]>([])
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ADMIN_UNIT' as UserRole,
    unit: 'SOPORTE_INFORMATICA' as UnitKey
  })

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    contentUrl: '',
    unit: (sessionUser?.unit ?? 'SOPORTE_INFORMATICA') as UnitKey
  })

  useEffect(() => {
    if (!sessionUser) {
      navigate('/login')
      return
    }
    void refresh()
  }, [])

  const visibleUnits = useMemo(() => {
    if (!sessionUser) return []
    if (sessionUser.role === 'ADMIN_GENERAL') return UNIT_OPTIONS
    if (sessionUser.role === 'ADMIN_UNIT' && sessionUser.unit) {
      return UNIT_OPTIONS.filter((u) => u.value === sessionUser.unit)
    }
    return []
  }, [sessionUser])

  const refresh = async () => {
    try {
      setError('')
      const support = await listSupportItems()
      setItems(support)
      if (sessionUser?.role === 'ADMIN_GENERAL') {
        const userRows = await listUsers()
        setUsers(userRows)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil')
    }
  }

  if (!sessionUser) return null

  const onLogout = () => {
    clearSession()
    navigate('/login')
  }

  const onCreateUser = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setOk('')
    try {
      await createUser({
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        unit: newUser.role === 'ADMIN_GENERAL' ? null : newUser.unit
      })
      setOk('Usuario creado correctamente.')
      setNewUser({ ...newUser, fullName: '', email: '', password: '' })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear usuario')
    }
  }

  const onCreateItem = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setOk('')
    try {
      await createSupportItem(newItem)
      setOk('Contenido cargado con éxito.')
      setNewItem({ ...newItem, title: '', description: '', contentUrl: '' })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar contenido')
    }
  }

  const onDelete = async (id: string) => {
    setError('')
    setOk('')
    try {
      await deleteSupportItem(id)
      setOk('Contenido eliminado.')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar contenido')
    }
  }

  return (
    <main className="pf-page">
      <header className="pf-top">
        <div>
          <h1>Perfil {sessionUser.role === 'ADMIN_GENERAL' ? 'Admin General' : 'Administrador'}</h1>
          <p>
            {sessionUser.fullName} · {sessionUser.email}
          </p>
        </div>
        <div className="pf-top-actions">
          <Link to="/">Inicio</Link>
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="pf-tabs">
        <button type="button" className={tab === 'perfil' ? 'active' : ''} onClick={() => setTab('perfil')}>
          Mi perfil
        </button>
        {sessionUser.role === 'ADMIN_GENERAL' && (
          <button type="button" className={tab === 'usuarios' ? 'active' : ''} onClick={() => setTab('usuarios')}>
            Crear cuentas
          </button>
        )}
        {sessionUser.role !== 'STUDENT' && (
          <button type="button" className={tab === 'contenidos' ? 'active' : ''} onClick={() => setTab('contenidos')}>
            Contenidos por unidad
          </button>
        )}
      </nav>

      {error && <p className="pf-error">{error}</p>}
      {ok && <p className="pf-ok">{ok}</p>}

      {tab === 'perfil' && (
        <section className="pf-grid">
          {UNIT_OPTIONS.map((unit) => (
            <article key={unit.value} className="pf-card">
              <h3>{unit.label}</h3>
              <p>{unit.detail}</p>
            </article>
          ))}
        </section>
      )}

      {tab === 'usuarios' && sessionUser.role === 'ADMIN_GENERAL' && (
        <section className="pf-admin">
          <form onSubmit={onCreateUser} className="pf-form">
            <h2>Crear usuario nuevo</h2>
            <input
              value={newUser.fullName}
              onChange={(e) => setNewUser((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Nombre completo"
              required
            />
            <input
              value={newUser.email}
              onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
              type="email"
              placeholder="correo@gmail.com"
              required
            />
            <input
              value={newUser.password}
              onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
              type="password"
              placeholder="Contraseña"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as UserRole }))}
            >
              <option value="ADMIN_UNIT">Admin unidad</option>
              <option value="ADMIN_GENERAL">Admin general</option>
              <option value="STUDENT">Estudiante</option>
            </select>
            {newUser.role !== 'ADMIN_GENERAL' && (
              <select
                value={newUser.unit}
                onChange={(e) => setNewUser((prev) => ({ ...prev, unit: e.target.value as UnitKey }))}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            )}
            <button type="submit">Crear cuenta</button>
          </form>

          <div className="pf-list">
            <h2>Usuarios registrados</h2>
            {users.map((u) => (
              <div key={u.id} className="pf-row">
                <strong>{u.fullName}</strong>
                <span>{u.email}</span>
                <small>
                  {u.role} {u.unit ? `· ${u.unit}` : ''}
                </small>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'contenidos' && sessionUser.role !== 'STUDENT' && (
        <section className="pf-admin">
          <form onSubmit={onCreateItem} className="pf-form">
            <h2>Subir contenido de unidad</h2>
            <input
              value={newItem.title}
              onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Título del contenido"
              required
            />
            <input
              value={newItem.description}
              onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción corta"
              required
            />
            <input
              value={newItem.contentUrl}
              onChange={(e) => setNewItem((prev) => ({ ...prev, contentUrl: e.target.value }))}
              placeholder="URL (Drive, PDF, etc.)"
              required
            />
            <select
              value={newItem.unit}
              onChange={(e) => setNewItem((prev) => ({ ...prev, unit: e.target.value as UnitKey }))}
            >
              {visibleUnits.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
            <button type="submit">Guardar contenido</button>
          </form>

          <div className="pf-list">
            <h2>Contenidos cargados</h2>
            {items.map((item) => (
              <div key={item.id} className="pf-row">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <small>{item.unit}</small>
                <a href={item.contentUrl} target="_blank" rel="noreferrer">
                  Ver
                </a>
                <button type="button" className="pf-delete" onClick={() => onDelete(item.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
