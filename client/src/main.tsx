import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import './responsive-shell.css'
import { initViewportSync } from './lib/viewportSync'
import App from './App.tsx'
import InventarioLoginPage from './InventarioLoginPage'
import InventarioPage from './InventarioPage'
import InventarioRoute from './InventarioRoute'

initViewportSync()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/inventario/login" element={<InventarioLoginPage />} />
        <Route
          path="/inventario"
          element={
            <InventarioRoute>
              <InventarioPage />
            </InventarioRoute>
          }
        />
        <Route path="/semana-cero" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/inventario/login" replace />} />
        <Route path="/perfil" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
