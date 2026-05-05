import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { listenInventarioAuth } from './lib/inventoryAuth'

type Props = {
  children: JSX.Element
}

function InventarioRoute({ children }: Props) {
  const [loading, setLoading] = useState(true)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const un = listenInventarioAuth((isOk) => {
      setOk(isOk)
      setLoading(false)
    })
    return () => un()
  }, [])

  if (loading) return <div className="inv-auth-loading">Validando sesión...</div>
  if (!ok) return <Navigate to="/inventario/login" replace />
  return children
}

export default InventarioRoute
