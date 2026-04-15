import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Eye,
  Globe,
  GraduationCap,
  Laptop,
  Library,
  LifeBuoy,
  MailCheck,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Route,
  Shield,
  Sparkles,
  Star,
  Sun
} from 'lucide-react'
import './App.css'
import './SemanaCeroPage.css'
import { LINKS, type SemanaTabId } from './semanaCeroContent'

const SemanaCeroFullSections = lazy(async () => {
  const m = await import('./SemanaCeroSections')
  return { default: m.SemanaCeroFullSections }
})

/** Carrusel hero: rutas estáticas en /public (evita triple `new Image()` al inicio). */
const HERO_SLIDE_URLS = ['/santo-tomas-curico.jpg', '/biblioteca--0.jpg', '/estudiantes--a.png'] as const
const VISITS_BASE = 2550
const VISITS_NAMESPACE = 'st-curico-semana-cero-2026'
const VISITS_KEY = 'visitas-total'
const VISITS_LOCAL_KEY = 'st_visits_fallback'

/** Una sola promesa por carga del documento: evita doble +1 en Strict Mode (misma promesa, un solo bump local). */
let visitsOncePromise: Promise<number> | null = null

function normalizeCountValue(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return null
}

function sanitizeExternalHref(href: string) {
  if (href.startsWith('#')) return href
  try {
    const url = new URL(href, window.location.origin)
    if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:' || url.protocol === 'tel:') {
      return url.toString()
    }
  } catch {
    return '#'
  }
  return '#'
}

function scrollToSemanaTab(tab: SemanaTabId) {
  // Disparamos evento para que el componente de pestañas (Tabs) cambie a la sección correcta
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('changeSemanaTab', { detail: tab }))
  }
  // Y luego scrolleamos al contenedor principal de Semana Cero
  setTimeout(() => {
    document.getElementById('contenido-semana-cero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

type NavSectionItem = {
  id: string
  targetId: string
  label: string
  Icon: typeof LifeBuoy
  semanaTab?: SemanaTabId
}

/** Secciones en el menú lateral (Semana Cero). */
const NAV_SECTION_ITEMS: NavSectionItem[] = [
  { id: 'nav-apoyo', targetId: 'contenido-semana-cero', label: 'Apoyo', Icon: LifeBuoy, semanaTab: 'apoyo' },
  { id: 'nav-academica', targetId: 'contenido-semana-cero', label: 'Académica', Icon: GraduationCap, semanaTab: 'academica' }
]

type SidebarExternalLink = { icon: typeof Laptop; label: string; href: string }

const SIDEBAR_EXTERNAL_LINKS: SidebarExternalLink[] = [
  { icon: Laptop, label: 'Aulas Virtuales', href: LINKS.aulasVirtuales },
  { icon: MapPin, label: 'Ubicación', href: LINKS.ubicacion },
  { icon: BookOpen, label: 'Libro Tú Puedes', href: LINKS.libroTuPuedes },
  { icon: Library, label: 'Biblioteca Virtual', href: LINKS.bibliotecaVirtual },
  { icon: Globe, label: 'Sede en 360', href: LINKS.sede360 }
]

type ChatSectionId = 'inicio' | 'academica' | 'seguridad' | 'digital' | 'institucional'

const CHAT_SECTION_TABS: { id: ChatSectionId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'academica', label: 'Académica' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'digital', label: 'Digital' },
  { id: 'institucional', label: 'Institucional' }
]

const SERVICE_CARDS: {
  icon: typeof Sparkles
  title: string
  desc: string
  tab?: SemanaTabId
  externalHref?: string
}[] = [
  {
    icon: Sparkles,
    title: 'Tomasín',
    desc: 'Asistente con IA (Google Gemini): preguntá por la sede y los servicios.',
    externalHref: LINKS.conoceTomasinGemini
  },
  {
    icon: Shield,
    title: 'Seguro académico',
    desc: 'Coberturas y canal oficial DAE Santo Tomás.',
    tab: 'seguros'
  },
  {
    icon: Route,
    title: 'Vías de evacuación',
    desc: 'Videos y rutas de emergencia de la sede.',
    tab: 'evacuacion'
  },
  {
    icon: MailCheck,
    title: 'Activación de correo',
    desc: 'Recupera o actualiza tu clave institucional.',
    tab: 'correo'
  }
]

const CHAT_FAQ = {
  inicio: [
    {
      q: '¡Hola! Soy Tomasín 🤖',
      a: 'Tu asistente virtual especializado en los servicios de Santo Tomás. ¡Tú puedes! ¿En qué puedo ayudarte hoy? Revisá el menú lateral para ir al inicio, valores, sede, guía o enlaces útiles.'
    }
  ],
  academica: [
    { q: '¿Dónde entro a Aulas Virtuales?', a: 'Tu acceso está aquí.', ctaLabel: 'Abrir Aulas Virtuales', href: LINKS.aulasVirtuales },
    { q: '¿Dónde veo Libro Tú Puedes?', a: 'Puedes revisarlo en este portal.', ctaLabel: 'Abrir Libro Tú Puedes', href: LINKS.libroTuPuedes },
    { q: '¿Dónde busco en Biblioteca Virtual?', a: 'Ingresa aquí al buscador institucional.', ctaLabel: 'Abrir Biblioteca Virtual', href: LINKS.bibliotecaVirtual }
  ],
  seguridad: [
    { q: 'Vías de evacuación', a: 'Revisa la sección "Vías de evacuación" en Semana Cero para videos por piso y salida.' },
    { q: '¿Cómo denuncio una situación?', a: 'Puedes usar el canal oficial confidencial.', ctaLabel: 'Ir a canal de denuncias', href: LINKS.canalDenuncias },
    { q: '¿Dónde veo seguros estudiantiles?', a: 'La información está en DAE.', ctaLabel: 'Ver seguros DAE', href: LINKS.segurosDae },
    { q: 'Números de emergencia', a: 'Salud responsable: *7100 · Carabineros: 133 · SAMU: 131.' }
  ],
  digital: [
    { q: '¿Tu clave se puede cambiar?', a: 'Sí, se puede cambiar aquí.', ctaLabel: 'Cambiar clave', href: LINKS.actualizaClave },
    { q: '¿Olvidaste tu clave?', a: 'Recupérala en este acceso.', ctaLabel: 'Recuperar clave', href: LINKS.recuperaClave },
    { q: '¿Dónde está la sede en 360?', a: 'Puedes entrar aquí al recorrido.', ctaLabel: 'Abrir sede 360', href: LINKS.sede360 }
  ],
  institucional: [
    { q: '¿Cuál es el Instagram de la sede?', a: 'Este es el perfil oficial de Curicó.', ctaLabel: 'Abrir Instagram', href: LINKS.instagramCurico },
    { q: '¿Dónde veo el portal IP?', a: 'Puedes entrar desde este botón.', ctaLabel: 'Abrir portal IP', href: LINKS.ip },
    { q: '¿Dónde veo el portal CFT?', a: 'Puedes entrar desde este botón.', ctaLabel: 'Abrir portal CFT', href: LINKS.cft }
  ]
} as const

/** Barra de ingreso: relleno animado por CSS (GPU); % vía ref sin re-renders; confetti al terminar. */
function IngresoProgressBar() {
  const [showConfetti, setShowConfetti] = useState(false)
  const pctElRef = useRef<HTMLSpanElement>(null)

  const onBarAnimationEnd = useCallback(() => {
    const el = pctElRef.current
    if (el) el.textContent = '100%'
    setShowConfetti(true)
    window.setTimeout(() => setShowConfetti(false), 2600)
  }, [])

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const durationMs = reduced ? 80 : 9000
    const start = performance.now()
    let raf = 0
    const pctEl = pctElRef.current

    let lastUiPct = -1
    const tick = (now: number) => {
      const pct = Math.min(((now - start) / durationMs) * 100, 100)
      const uiPct = Math.round(pct)
      if (uiPct !== lastUiPct && pctEl) {
        lastUiPct = uiPct
        pctEl.textContent = `${uiPct}%`
      }
      if (pct < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="n-ingreso-progress" aria-label="Barra de avance desde ingreso">
      <div className="n-ingreso-progress-top">
        <span>Ingreso estudiantes: 09/03/26</span>
        <span ref={pctElRef} className="n-ingreso-progress-pct">
          0%
        </span>
      </div>
      <div className="n-ingreso-track">
        <span className="n-ingreso-track-fill" onAnimationEnd={onBarAnimationEnd} />
      </div>
      {showConfetti && (
        <div className="n-fireworks-wrap" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, idx) => (
            <span key={`burst-${idx}`} className={`n-firework-burst n-firework-${idx + 1}`} />
          ))}
          {Array.from({ length: 18 }).map((_, idx) => (
            <span key={`spark-${idx}`} className="n-firework-spark" />
          ))}
        </div>
      )}
    </div>
  )
}

function scrollToAnchorId(elementId: string) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function getCountApiValue(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.countapi.xyz/get/${VISITS_NAMESPACE}/${key}`)
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    return normalizeCountValue(data.value)
  } catch {
    return null
  }
}

async function setCountApiValue(key: string, value: number): Promise<boolean> {
  try {
    const res = await fetch(`https://api.countapi.xyz/set/${VISITS_NAMESPACE}/${key}?value=${value}`)
    return res.ok
  } catch {
    return false
  }
}

/** +1 remoto; preferimos `hit` y si falla probamos `update`. */
async function incrementCountApiRemote(key: string): Promise<number> {
  const hitRes = await fetch(`https://api.countapi.xyz/hit/${VISITS_NAMESPACE}/${key}`)
  if (hitRes.ok) {
    const data = (await hitRes.json()) as { value?: unknown }
    const v = normalizeCountValue(data.value)
    if (v !== null) return v
  }
  const updRes = await fetch(`https://api.countapi.xyz/update/${VISITS_NAMESPACE}/${key}?amount=1`)
  if (!updRes.ok) throw new Error('No se pudo incrementar contador remoto')
  const data = (await updRes.json()) as { value?: unknown }
  const v = normalizeCountValue(data.value)
  if (v === null) throw new Error('Respuesta invalida de contador')
  return v
}

/** +1 en localStorage; nunca debería tirar (modo privado → número razonable igual). */
function bumpLocalVisitsSafe(): number {
  try {
    const raw = Number(localStorage.getItem(VISITS_LOCAL_KEY) ?? String(VISITS_BASE))
    const safeRaw = Number.isFinite(raw) ? Math.max(raw, VISITS_BASE) : VISITS_BASE
    const next = safeRaw + 1
    localStorage.setItem(VISITS_LOCAL_KEY, String(next))
    return next
  } catch {
    return VISITS_BASE + 1
  }
}

/** Resuelve al toque con el valor ya incrementado (no espera red). Misma promesa = un solo +1 por recarga. */
function getBumpedVisitCountOnce(): Promise<number> {
  if (visitsOncePromise) return visitsOncePromise
  visitsOncePromise = Promise.resolve(bumpLocalVisitsSafe())
  return visitsOncePromise
}

/** Sincroniza CountAPI después del bump local; no bloquea la UI. */
async function syncRemoteAfterLocalBump(localFloor: number): Promise<number | null> {
  try {
    let current = await getCountApiValue(VISITS_KEY)
    if (current === null || current < VISITS_BASE) {
      const ok = await setCountApiValue(VISITS_KEY, VISITS_BASE)
      if (!ok) throw new Error('set base remoto falló')
    }
    const remoteAfterHit = await incrementCountApiRemote(VISITS_KEY)
    return Math.max(remoteAfterHit, VISITS_BASE, localFloor)
  } catch {
    return null
  }
}

function App() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(() =>
    typeof window !== 'undefined' ? !window.matchMedia('(max-width: 1024px)').matches : true
  )
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visits, setVisits] = useState(VISITS_BASE)
  const [selloOpen, setSelloOpen] = useState(false)
  const [showChatHint, setShowChatHint] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatSection, setChatSection] = useState<ChatSectionId>('inicio')
  const heroSlides = HERO_SLIDE_URLS
  const [campusVideoEmbedOn, setCampusVideoEmbedOn] = useState(false)
  const [campusVideoActive, setCampusVideoActive] = useState(false)
  const campusVideoSectionRef = useRef<HTMLElement | null>(null)
  const [navActiveId, setNavActiveId] = useState('')
  const lastContenidoNavRef = useRef('nav-academica')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  /** Pausa animaciones CSS infinitas cuando la pestaña no está visible (menos CPU/GPU). */
  useLayoutEffect(() => {
    document.documentElement.dataset.pageVisible = document.visibilityState === 'visible' ? '1' : '0'
  }, [])
  useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.pageVisible = document.visibilityState === 'visible' ? '1' : '0'
    }
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => {
    let cancelled = false
    void getBumpedVisitCountOnce().then((v) => {
      if (!cancelled) setVisits(v)
      void syncRemoteAfterLocalBump(v).then((merged) => {
        if (merged == null || cancelled) return
        if (merged > v) {
          try {
            localStorage.setItem(VISITS_LOCAL_KEY, String(merged))
          } catch {
            /* noop */
          }
        }
        setVisits((prev) => Math.max(prev, merged))
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined
    const tick = () => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }
    const start = () => {
      if (id != null) return
      id = setInterval(tick, 9000)
    }
    const stop = () => {
      if (id != null) {
        clearInterval(id)
        id = undefined
      }
    }
    const onVis = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [heroSlides.length])

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setShowChatHint(true)
      window.setTimeout(() => setShowChatHint(false), 5000)
    }, 7000)

    const interval = window.setInterval(() => {
      setShowChatHint(true)
      window.setTimeout(() => setShowChatHint(false), 5000)
    }, 20000)

    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(interval)
    }
  }, [])

  const [isMobileLayout, setIsMobileLayout] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const apply = () => setIsMobileLayout(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    setIsMenuOpen(!isMobileLayout)
  }, [isMobileLayout])

  useEffect(() => {
    if (!isMobileLayout || !isMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isMobileLayout, isMenuOpen])

  useEffect(() => {
    const section = campusVideoSectionRef.current
    if (!section) return

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCampusVideoEmbedOn(true)
      },
      { rootMargin: '340px 0px', threshold: 0 }
    )
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        setCampusVideoActive(entry.isIntersecting && entry.intersectionRatio >= 0.55)
      },
      { threshold: [0, 0.15, 0.55] }
    )

    loadObserver.observe(section)
    playObserver.observe(section)
    return () => {
      loadObserver.disconnect()
      playObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.08)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        const tid = top?.target?.id
        if (!tid) return
        if (tid === 'inicio-hero') setNavActiveId('')
        else if (tid === 'n-sede-video') setNavActiveId('')
        else if (tid === 'contenido-semana-cero') setNavActiveId(lastContenidoNavRef.current)
      },
      { threshold: [0.08, 0.15, 0.28, 0.45], rootMargin: '-6% 0px -48% 0px' }
    )
    ;['inicio-hero', 'n-sede-video', 'contenido-semana-cero'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const triggerSemanaTab = useCallback((tab: SemanaTabId) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('changeSemanaTab', { detail: tab }))
    }
    window.setTimeout(() => {
      document.getElementById('contenido-semana-cero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }, [])

  const handleNavSection = useCallback(
    (item: NavSectionItem) => {
      setNavActiveId(item.id)
      if (item.targetId === 'contenido-semana-cero' && item.semanaTab) {
        lastContenidoNavRef.current = item.id
        triggerSemanaTab(item.semanaTab)
        if (isMobileLayout) setIsMenuOpen(false)
        return
      }
      scrollToAnchorId(item.targetId)
      if (isMobileLayout) setIsMenuOpen(false)
    },
    [isMobileLayout, triggerSemanaTab]
  )

  const goHome = useCallback(() => {
    navigate('/', { replace: true })
    lastContenidoNavRef.current = 'nav-academica'
    window.dispatchEvent(new CustomEvent('changeSemanaTab', { detail: 'mision' }))
    setNavActiveId('')
    if (isMobileLayout) setIsMenuOpen(false)
    window.requestAnimationFrame(() => {
      document.getElementById('inicio-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [navigate, isMobileLayout])

  return (
    <div className={`n-dashboard ${isMenuOpen ? 'menu-open' : ''} ${isMobileLayout ? 'n-mobile-layout' : ''}`}>
      <div className="n-dashboard-bg" aria-hidden="true">
        <div className="n-dashboard-mesh" />
        <div className="n-dashboard-blob n-dashboard-blob--a" />
        <div className="n-dashboard-blob n-dashboard-blob--b" />
        <div className="n-dashboard-blob n-dashboard-blob--c" />
        <div className="n-dashboard-blob n-dashboard-blob--d" />
      </div>
      {isMobileLayout && isMenuOpen && (
        <button
          type="button"
          className="n-nav-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {isMobileLayout && !isMenuOpen && (
        <button
          type="button"
          className="n-mobile-menu-fab"
          aria-label="Abrir menú principal"
          onClick={() => setIsMenuOpen(true)}
        >
          <img src="/logo-st.svg" alt="" aria-hidden="true" className="n-mobile-menu-fab-logo" />
          <span className="n-mobile-menu-fab-sep" aria-hidden="true" />
          <Menu size={18} className="n-mobile-menu-fab-icon" />
        </button>
      )}
      <div className="n-quick-rail" aria-label="Accesos rápidos">
        <a
          className="n-quick-btn"
          href={sanitizeExternalHref(LINKS.instagramCurico)}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram Sede Curicó"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
          </svg>
        </a>
        <a
          className="n-quick-btn"
          href={sanitizeExternalHref(LINKS.ip)}
          target="_blank"
          rel="noopener noreferrer"
          title="Instituto Profesional Santo Tomás"
        >
          <GraduationCap size={20} />
        </a>
        <button
          type="button"
          className="n-quick-btn"
          title="Chatbot Semana Cero"
          aria-expanded={chatOpen}
          onClick={() => {
            setChatOpen((prev) => !prev)
            setShowChatHint(false)
          }}
        >
          <MessageCircle size={20} />
        </button>
        {showChatHint && !chatOpen && <div className="n-chatbot-hint">Tienes alguna consulta?</div>}
        {chatOpen && (
          <div className="n-chat-panel" role="dialog" aria-label="Chatbot Semana Cero">
            <div className="n-chat-head">
              <div className="n-chat-head-info">
                <strong>Tomasín Asistente</strong>
                <span className="n-chat-slogan">#TuPuedes</span>
              </div>
              <button type="button" onClick={() => setChatOpen(false)} aria-label="Cerrar chatbot">
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="n-chat-sections">
              {CHAT_SECTION_TABS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={chatSection === section.id ? 'active' : ''}
                  onClick={() => setChatSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="n-chat-body">
              {CHAT_FAQ[chatSection].map((item) => (
                <div key={item.q} className="n-chat-item">
                  <p className="n-chat-q">{item.q}</p>
                  <p className="n-chat-a">{item.a}</p>
                  {'href' in item && item.href && (
                    <a className="n-chat-link" href={sanitizeExternalHref(item.href)} target="_blank" rel="noopener noreferrer">
                      {item.ctaLabel}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="n-sidebar">
        <button type="button" className="n-sidebar-brand n-sidebar-brand-btn" onClick={goHome} aria-label="Volver al inicio">
          <img src="/logo-st.svg" alt="Santo Tomás" />
          {isMenuOpen && <span>SANTO TOMÁS</span>}
        </button>

        <button
          className="n-sidebar-toggle"
          onClick={() => {
            if (isMobileLayout) setIsMenuOpen((prev) => !prev)
          }}
        >
          <Menu size={17} />
          {isMenuOpen && <span>MENÚ</span>}
        </button>

        <nav className="n-sidebar-menu" aria-label="Navegación principal">
          {isMenuOpen && <div className="n-sidebar-group-label">En esta página</div>}
          {NAV_SECTION_ITEMS.map((item) => {
            const Icon = item.Icon
            return (
              <button
                key={item.id}
                type="button"
                className={`n-sidebar-nav-btn ${navActiveId === item.id ? 'is-active' : ''}`}
                onClick={() => handleNavSection(item)}
              >
                <Icon size={16} aria-hidden />
                {isMenuOpen && <span>{item.label}</span>}
              </button>
            )
          })}
          {isMenuOpen && <div className="n-sidebar-group-label">Enlaces</div>}
          {SIDEBAR_EXTERNAL_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <a key={link.label} href={sanitizeExternalHref(link.href)} target="_blank" rel="noopener noreferrer">
                <Icon size={16} aria-hidden />
                {isMenuOpen && <span>{link.label}</span>}
              </a>
            )
          })}
          <button type="button" className="highlight" onClick={() => setSelloOpen(true)}>
            <Star size={16} aria-hidden />
            {isMenuOpen && <span>Personaje Sello 2026</span>}
          </button>
        </nav>

        <button className="n-theme-switch" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {isMenuOpen && <span>{theme === 'dark' ? 'MODO DÍA' : 'MODO NOCHE'}</span>}
        </button>
      </aside>

      <main className="n-content">
        <div className="n-landing">
        <section className="n-hero-panel" id="inicio-hero">
          <div className="n-hero-bg-stack" aria-hidden="true">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide}
                className={`n-hero-bg ${currentSlide === idx ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide})` }}
              />
            ))}
          </div>
          <div className="n-hero-shade" />

          <div className="n-hero-text">
            <div className="n-hero-top-badges">
              <div className="n-hero-pill">
                <span>BIENVENIDO TOMACIN@S</span>
              </div>
              <div className="n-views-chip">
                <Eye size={16} strokeWidth={2.5} aria-hidden="true" />
                <span>{visits.toLocaleString('es-CL')} visitas</span>
              </div>
            </div>

            <h1>
              <span>SEMANA CERO</span>
              <strong>SANTO TOMÁS</strong>
            </h1>

            <p>
              Tu primera semana es el comienzo de algo grande.
              Explora, conéctate y descubre todo lo que tenemos para ti.
            </p>

            <IngresoProgressBar />

            <div className="n-hero-actions">
              <button type="button" className="n-btn-main" onClick={() => scrollToSemanaTab('mision')}>
                Tu semana cero
              </button>
              <a
                className="n-btn-secondary"
                href={sanitizeExternalHref(LINKS.sede360)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={18} aria-hidden />
                Visita la sede en 3D
              </a>
            </div>

            <div className="n-hero-dots" role="tablist" aria-label="Cambiar imagen del carrusel">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={currentSlide === idx}
                  aria-label={`Imagen ${idx + 1} de ${heroSlides.length}`}
                  className={currentSlide === idx ? 'active' : ''}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="n-services" id="conoce-semana-cero">
          {SERVICE_CARDS.map(({ icon: Icon, title, desc, tab, externalHref }, idx) => (
            <motion.button
              key={title}
              type="button"
              className={`n-service-card n-service-card-btn n-service-${idx + 1}`}
              onClick={() => {
                if (externalHref) {
                  window.open(sanitizeExternalHref(externalHref), '_blank', 'noopener,noreferrer')
                } else if (tab) {
                  scrollToSemanaTab(tab)
                }
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <div className="n-service-icon">
                <Icon size={18} />
              </div>
              <div className="n-service-copy">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <ChevronRight size={14} aria-hidden />
            </motion.button>
          ))}
        </section>
        </div>

        <section className="n-campus-video" id="n-sede-video" ref={campusVideoSectionRef}>
          <motion.h2
            className="n-hero-style-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span>CONOCE</span>
            <strong>TU SEDE</strong>
          </motion.h2>
          <div className="n-video-box">
            {campusVideoEmbedOn ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/WWnK0FpAspM?rel=0&modestbranding=1&playsinline=1&mute=1${
                  campusVideoActive ? '&autoplay=1' : ''
                }`}
                title="Conoce tu sede Santo Tomás Curicó"
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ borderRadius: '12px' }}
              />
            ) : (
              <div className="n-video-pending" aria-hidden="true" />
            )}
          </div>
        </section>

        <div className="scp-page scp-page--embed" id="contenido-semana-cero">
          <div className="scp-embed-intro">
            <motion.h2
              className="scp-h2 n-hero-style-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            >
              <span>SEMANA CERO</span>
              <strong>INFORMACIÓN COMPLETA</strong>
            </motion.h2>
            <p className="scp-lead">
              Todo el material de inducción en esta misma página: deslizá o tocá las tarjetas de arriba para ir a cada
              bloque.
            </p>
          </div>
          <article className="scp-article">
            <Suspense
              fallback={
                <div className="n-semana-suspense-fallback" role="status" aria-live="polite">
                  <span className="n-semana-suspense-sr">Cargando información Semana Cero…</span>
                </div>
              }
            >
              <SemanaCeroFullSections />
            </Suspense>
          </article>
        </div>
      </main>

      {selloOpen && (
        <div className="n-sello-overlay" role="presentation" onClick={() => setSelloOpen(false)}>
          <div
            className="n-sello-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sello-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="n-sello-close" onClick={() => setSelloOpen(false)} aria-label="Cerrar">
              ×
            </button>
            <h2 id="sello-titulo" className="n-sello-title">
              Personaje Sello 2026
            </h2>
            <img src={LINKS.personajeSelloImg} alt="Personaje Sello 2026 — Santo Tomás" className="n-sello-img" />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
