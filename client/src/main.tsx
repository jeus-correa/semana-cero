import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SemanaCeroPage } from './SemanaCeroPage.tsx'
import { LoginPage } from './LoginPage.tsx'
import { ProfilePage } from './ProfilePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/semana-cero" element={<SemanaCeroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
