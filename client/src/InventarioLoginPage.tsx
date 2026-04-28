import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { getInventoryAdminUser, loginInventario } from './lib/inventoryAuth'
import './inventario.css'

function InventarioLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginInventario(getInventoryAdminUser(), password)
      navigate('/inventario', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo iniciar sesión.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="inv-login-wrap">
      <section className="inv-login-card" aria-label="Acceso inventario">
        <img src="/logo-santo-tomas.png" alt="Santo Tomás" className="inv-login-logo" />
        <p className="inv-login-eyebrow">Universidad Santo Tomás</p>
        <h1>Acceso Inventario TI</h1>
        <p className="inv-login-lead">Ingreso de administrador para registrar y gestionar equipos informáticos.</p>
        <form onSubmit={onSubmit} className="inv-login-form">
          <label>
            Clave
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="inv-login-error">{error}</p>}
          <button type="submit" disabled={loading}>
            <ShieldCheck size={16} /> {loading ? 'Ingresando...' : 'Ingresar a Inventario'}
          </button>
        </form>
        <Link to="/" className="inv-back-home">
          Volver al inicio
        </Link>
      </section>
    </main>
  )
}

export default InventarioLoginPage
