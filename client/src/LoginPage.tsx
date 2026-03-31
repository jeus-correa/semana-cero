import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { login } from './api'
import { saveSession } from './auth'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      saveSession(data.token, data.user)
      navigate('/perfil')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <img src="/logo-st.svg" alt="Santo Tomás" />
          <div>
            <h1>Ingreso Seguro</h1>
            <p>Accede con tu Gmail institucional y contraseña.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            <span>Correo Gmail</span>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                placeholder="tucorreo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            <span>Contraseña</span>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/">Volver al inicio</Link>
          <span>Creación de cuentas solo disponible para admin general.</span>
        </div>
      </section>
    </main>
  )
}
