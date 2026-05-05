import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { loginInventario } from './lib/inventoryAuth'
import './inventario.css'

function InventarioLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginInventario(email, password)
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
        <p className="inv-login-lead">Ingreso para administrador y trabajadores autorizados.</p>
        <form onSubmit={onSubmit} className="inv-login-form">
          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              placeholder="tu-correo@dominio.cl"
              required
            />
          </label>
          <label className="inv-login-field">
            Clave
            <div className="inv-password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="inv-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
