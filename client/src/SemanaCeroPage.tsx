import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Menu, Moon, Sun } from 'lucide-react'
import { SemanaCeroSections } from './SemanaCeroSections'
import { SEMANA_TABS, type SemanaTabId } from './semanaCeroContent'
import './SemanaCeroPage.css'

const TAB_IDS = SEMANA_TABS.map((t) => t.id) as SemanaTabId[]

function isSemanaTabId(v: string | null): v is SemanaTabId {
  return v !== null && TAB_IDS.includes(v as SemanaTabId)
}

export function SemanaCeroPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [navOpen, setNavOpen] = useState(false)

  const tabFromUrl = searchParams.get('tab')
  const tab: SemanaTabId = useMemo(
    () => (isSemanaTabId(tabFromUrl) ? tabFromUrl : 'mision'),
    [tabFromUrl]
  )

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.title = 'Semana Cero | Instituto Profesional Santo Tomás'
    return () => {
      document.title = 'Semana Cero Santo Tomás'
    }
  }, [])

  const setTab = (id: SemanaTabId) => {
    setSearchParams({ tab: id }, { replace: true })
    setNavOpen(false)
  }

  const currentMeta = SEMANA_TABS.find((t) => t.id === tab)

  const [visitedTabs, setVisitedTabs] = useState<Set<SemanaTabId>>(() => {
    const saved = localStorage.getItem('scp_visited_tabs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return new Set(parsed)
      } catch (e) {
        console.error('Error parsing visited tabs', e)
      }
    }
    return new Set(['mision'])
  })

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(tab)) return prev
      const next = new Set(prev)
      next.add(tab)
      localStorage.setItem('scp_visited_tabs', JSON.stringify(Array.from(next)))
      return next
    })
  }, [tab])

  const progress = Math.round((visitedTabs.size / SEMANA_TABS.length) * 100)

  return (
    <div className="scp-page">
      <header className="scp-topbar">
        <div className="scp-topbar-inner">
          <Link to="/" className="scp-back">
            <ArrowLeft size={18} aria-hidden />
            <span>Volver al inicio</span>
          </Link>

          <div className="scp-brand">
            <img src="/logo-st.svg" alt="" className="scp-logo" width={36} height={42} />
            <div className="scp-brand-text">
              <span className="scp-brand-name">Santo Tomás</span>
              <span className="scp-brand-sub">Semana Cero · Información institucional</span>
            </div>
          </div>

          <div className="scp-top-actions">
            <button
              type="button"
              className="scp-icon-btn scp-only-mobile"
              aria-label={navOpen ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <Menu size={20} />
            </button>
            <button
              type="button"
              className="scp-icon-btn"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Activar modo día' : 'Activar modo noche'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      <div className="scp-progress-wrapper">
        <div className="scp-progress-container">
          <div className="scp-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="scp-progress-info">
          <span className="scp-progress-label">{progress}% COMPLETADO</span>
        </div>
      </div>

      <div className="scp-layout">
        <aside className={`scp-sidebar ${navOpen ? 'scp-sidebar-open' : ''}`}>
          <div className="scp-sidebar-panel">
            <div className="scp-sidebar-head">
              <p className="scp-sidebar-eyebrow">Contenidos</p>
              <p className="scp-sidebar-title">Selecciona una sección</p>
            </div>
            <nav className="scp-nav" aria-label="Secciones Semana Cero">
              {SEMANA_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`scp-nav-item ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <span className="scp-nav-num">{t.num}</span>
                  <span className="scp-nav-label">{t.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {navOpen && (
          <button type="button" className="scp-sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setNavOpen(false)} />
        )}

        <main className="scp-main">
          <div className="scp-main-header">
            <p className="scp-breadcrumb">
              <Link to="/" className="scp-breadcrumb-link">
                Inicio
              </Link>
              <span aria-hidden> / </span>
              <span>Semana Cero</span>
              {currentMeta && (
                <>
                  <span aria-hidden> / </span>
                  <span className="scp-breadcrumb-current">{currentMeta.label}</span>
                </>
              )}
            </p>
            <h1 className="scp-page-title">{currentMeta?.label ?? 'Semana Cero'}</h1>
            <p className="scp-page-desc">
              Documentación y enlaces oficiales para tu proceso de inducción. Mantén este recurso a mano durante tu
              primera semana.
            </p>
          </div>

          <article className="scp-article">
            <SemanaCeroSections tab={tab} onTabChange={setTab} />
          </article>
        </main>
      </div>
    </div>
  )
}
