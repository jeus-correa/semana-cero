import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  Layers,
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
  Sun,
  User,
  Video
} from 'lucide-react'
import './App.css'
import './SemanaCeroPage.css'
import { SemanaCeroFullSections } from './SemanaCeroSections'
import { LINKS, type SemanaTabId } from './semanaCeroContent'

let visitIncrementedThisLoad = false
const FALLBACK_HERO_SLIDES = ['/santo-tomas-curico.jpg', '/biblioteca--0.jpg', '/estudiantes--a.png'] as const
const VISITS_BASE = 2550
const VISITS_NAMESPACE = 'st-curico-semana-cero-2026'
const VISITS_KEY = 'visitas-unicas'

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

function canLoadImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
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

const BOTTOM_DOCK_ITEMS = [
  { id: 'dock-inicio', targetId: 'inicio-hero', label: 'Inicio', num: 1, tone: 'mint', Icon: Home },
  { id: 'dock-explora', targetId: 'inicio-hero', label: 'Tomasín', num: 2, tone: 'sky', Icon: Sparkles },
  { id: 'dock-sede', targetId: 'n-sede-video', label: 'Sede', num: 3, tone: 'amber', Icon: Video },
  { id: 'dock-guia', targetId: 'contenido-semana-cero', label: 'Guía', num: 4, tone: 'jade', Icon: Layers },
  { id: 'dock-apoyo', targetId: 'contenido-semana-cero', label: 'Apoyo', num: 5, tone: 'rose', Icon: LifeBuoy },
  { id: 'dock-academica', targetId: 'contenido-semana-cero', label: 'Académica', num: 6, tone: 'violet', Icon: GraduationCap }
] as const

function scrollToAnchorId(elementId: string) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function getPublicIp() {
  const res = await fetch('https://api64.ipify.org?format=json')
  if (!res.ok) throw new Error('No se pudo obtener IP publica')
  const data = (await res.json()) as { ip?: string }
  if (!data.ip) throw new Error('IP no disponible')
  return data.ip
}

async function getCountApiValue(key: string) {
  const res = await fetch(`https://api.countapi.xyz/get/${VISITS_NAMESPACE}/${key}`)
  if (!res.ok) throw new Error('No se pudo consultar contador')
  const data = (await res.json()) as { value?: number }
  if (typeof data.value !== 'number') return null
  return data.value
}

async function setCountApiValue(key: string, value: number) {
  const res = await fetch(`https://api.countapi.xyz/set/${VISITS_NAMESPACE}/${key}?value=${value}`)
  if (!res.ok) throw new Error('No se pudo fijar contador')
}

async function updateCountApiValue(key: string, amount: number) {
  const res = await fetch(`https://api.countapi.xyz/update/${VISITS_NAMESPACE}/${key}?amount=${amount}`)
  if (!res.ok) throw new Error('No se pudo actualizar contador')
  const data = (await res.json()) as { value?: number }
  if (typeof data.value !== 'number') throw new Error('Respuesta invalida de contador')
  return data.value
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(() =>
    typeof window !== 'undefined' ? !window.matchMedia('(max-width: 1024px)').matches : true
  )
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visits, setVisits] = useState(0)
  const [selloOpen, setSelloOpen] = useState(false)
  const [showChatHint, setShowChatHint] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatSection, setChatSection] = useState<'inicio' | 'academica' | 'seguridad' | 'digital' | 'institucional'>(
    'inicio'
  )
  const [progressFill, setProgressFill] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [heroSlides, setHeroSlides] = useState<string[]>([...FALLBACK_HERO_SLIDES])
  const [campusVideoActive, setCampusVideoActive] = useState(false)
  const campusVideoSectionRef = useRef<HTMLElement | null>(null)
  const [dockActive, setDockActive] = useState<string>('dock-inicio')
  const [dockVisible, setDockVisible] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (visitIncrementedThisLoad) return
    visitIncrementedThisLoad = true

    let cancelled = false

    const loadVisits = async () => {
      try {
        const currentGlobal = await getCountApiValue(VISITS_KEY)
        if (currentGlobal === null || currentGlobal < VISITS_BASE) {
          await setCountApiValue(VISITS_KEY, VISITS_BASE)
        }

        const currentValue = await getCountApiValue(VISITS_KEY)
        const safeCurrent = currentValue !== null ? Math.max(currentValue, VISITS_BASE) : VISITS_BASE
        if (!cancelled) setVisits(safeCurrent)

        const ip = await getPublicIp()
        const ipKey = `ip-${ip.replace(/[^a-zA-Z0-9]/g, '-')}`
        const seenIp = await getCountApiValue(ipKey)

        if (seenIp === null) {
          await setCountApiValue(ipKey, 1)
          const nextValue = await updateCountApiValue(VISITS_KEY, 1)
          if (!cancelled) setVisits(Math.max(nextValue, VISITS_BASE))
        }
      } catch {
        // Fallback local: mantiene contador visible si falla API externa
        const localKey = 'st_visits_fallback'
        const raw = Number(localStorage.getItem(localKey) ?? '0')
        const safeRaw = Number.isFinite(raw) ? Math.max(raw, VISITS_BASE) : VISITS_BASE
        if (!cancelled) setVisits(safeRaw)
        const next = safeRaw + 1
        localStorage.setItem(localKey, String(next))
        const t = window.setTimeout(() => {
          if (!cancelled) setVisits(next)
        }, 420)
        return () => window.clearTimeout(t)
      }
      return undefined
    }

    let clearLocalTimer: (() => void) | undefined
    void loadVisits().then((cleanup) => {
      if (typeof cleanup === 'function') clearLocalTimer = cleanup
    })

    return () => {
      cancelled = true
      if (clearLocalTimer) clearLocalTimer()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 9000)
    return () => clearInterval(interval)
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

  type MenuRow =
    | { kind: 'link'; icon: any; label: string; href: string; external?: boolean; highlight?: boolean }
    | { kind: 'sello'; icon: any; label: string; highlight?: boolean }

  const menuItems: MenuRow[] = [
    { kind: 'link', icon: Laptop, label: 'Aulas Virtuales', href: LINKS.aulasVirtuales, external: true },
    { kind: 'link', icon: MapPin, label: 'Ubicación', href: LINKS.ubicacion, external: true },
    { kind: 'link', icon: BookOpen, label: 'Libro Tú Puedes', href: LINKS.libroTuPuedes, external: true },
    { kind: 'link', icon: Library, label: 'Biblioteca Virtual', href: LINKS.bibliotecaVirtual, external: true },
    { kind: 'sello', icon: Star, label: 'Personaje Sello 2026', highlight: true },
    { kind: 'link', icon: Globe, label: 'Sede en 360', href: LINKS.sede360, external: true },
    { kind: 'link', icon: Sparkles, label: 'Conoce a Tomasín', href: LINKS.conoceTomasinGemini, external: true },
    { kind: 'link', icon: User, label: 'Unidades de apoyo', href: '#semana-apoyo', external: false }
  ]

  const serviceCards: {
    icon: any
    title: string
    desc: string
    tab: SemanaTabId
  }[] = [
    {
      icon: Heart,
      title: 'Valores institucionales',
      desc: 'Identidad, principios y valor del año 2026.',
      tab: 'valores'
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

  useEffect(() => {
    let isMounted = true
    const requestedSlides = ['/santo-tomas-curico.jpg', '/biblioteca--0.jpg', '/estudiantes--a.png']

    const resolveSlides = async () => {
      const checks = await Promise.all(requestedSlides.map((slide) => canLoadImage(slide)))
      const safeSlides = requestedSlides.map((slide, idx) => (checks[idx] ? slide : FALLBACK_HERO_SLIDES[idx]))
      if (isMounted) setHeroSlides(safeSlides)
    }

    void resolveSlides()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const section = campusVideoSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCampusVideoActive(entry.isIntersecting)
      },
      { threshold: 0.55 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const durationMs = 9000
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const pct = Math.min(((now - start) / durationMs) * 100, 100)
      setProgressFill(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setShowConfetti(true)
        window.setTimeout(() => setShowConfetti(false), 2600)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (loading) return
    const idToDock = new Map<string, string>(BOTTOM_DOCK_ITEMS.map((d) => [d.targetId, d.id]))
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.08)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (top?.target?.id) {
          const next = idToDock.get(top.target.id)
          if (next) setDockActive(next)
        }
      },
      { threshold: [0.08, 0.15, 0.28, 0.45], rootMargin: '-6% 0px -48% 0px' }
    )
    BOTTOM_DOCK_ITEMS.forEach(({ targetId }) => {
      const el = document.getElementById(targetId)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [loading])

  useEffect(() => {
    if (isMobileLayout) {
      setDockVisible(true)
      return
    }
    const revealZone = 96
    const onMove = (e: MouseEvent) => {
      const nearBottom = window.innerHeight - e.clientY <= revealZone
      setDockVisible(nearBottom)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobileLayout])

  const triggerSemanaTab = (tab: SemanaTabId) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('changeSemanaTab', { detail: tab }))
    }
    window.setTimeout(() => {
      document.getElementById('contenido-semana-cero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  const handleDockAction = (id: string, targetId: string) => {
    setDockActive(id)
    if (id === 'dock-explora') {
      window.open(sanitizeExternalHref(LINKS.conoceTomasinGemini), '_blank', 'noopener,noreferrer')
      return
    }
    if (id === 'dock-sede') {
      setCampusVideoActive(true)
      scrollToAnchorId('n-sede-video')
      return
    }
    if (id === 'dock-apoyo') {
      triggerSemanaTab('apoyo')
      return
    }
    if (id === 'dock-academica') {
      triggerSemanaTab('academica')
      return
    }
    scrollToAnchorId(targetId)
  }

  const chatFaq = {
    inicio: [
      {
        q: '¡Hola! Soy Tomasín 🤖',
        a: 'Tu asistente virtual especializado en los servicios de Santo Tomás. ¡Tu Puedes! ¿En qué puedo ayudarte hoy? Si buscas algo muy específico, también puedes preguntarme directamente en la sección "Conoce a Tomasín" del menú lateral.'
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

  if (loading) {
    return (
      <div className="n-loader-screen">
        <div className="n-loader-bg-motion" aria-hidden="true" />
        <div className="n-loader-inner">
          <div className="n-loader-logo-wrap">
            <img src="/logo-st.svg" alt="Santo Tomás" />
            <div className="n-loader-ring" />
          </div>
          <h2>Cargando Semana Cero...</h2>
          <p>Preparando tu experiencia de bienvenida</p>
          <div className="n-loader-bar">
            <span />
          </div>
          <div className="n-loader-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    )
  }

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
              {[
                { id: 'inicio', label: 'Inicio' },
                { id: 'academica', label: 'Académica' },
                { id: 'seguridad', label: 'Seguridad' },
                { id: 'digital', label: 'Digital' },
                { id: 'institucional', label: 'Institucional' }
              ].map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={chatSection === section.id ? 'active' : ''}
                  onClick={() => setChatSection(section.id as typeof chatSection)}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="n-chat-body">
              {chatFaq[chatSection].map((item) => (
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
        <div className="n-sidebar-brand">
          <img src="/logo-st.svg" alt="Santo Tomás" />
          {isMenuOpen && <span>SANTO TOMÁS</span>}
        </div>

        <button
          className="n-sidebar-toggle"
          onClick={() => {
            if (isMobileLayout) setIsMenuOpen((prev) => !prev)
          }}
        >
          <Menu size={17} />
          {isMenuOpen && <span>MENÚ</span>}
        </button>

        <nav className="n-sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon
            if (item.kind === 'sello') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={item.highlight ? 'highlight' : ''}
                  onClick={() => setSelloOpen(true)}
                >
                  <Icon size={16} />
                  {isMenuOpen && <span>{item.label}</span>}
                </button>
              )
            }
            return (
              <a
                key={item.label}
                href={sanitizeExternalHref(item.href)}
                className={item.highlight ? 'highlight' : ''}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                <Icon size={16} />
                {isMenuOpen && <span>{item.label}</span>}
              </a>
            )
          })}
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
          <div className="n-views-chip">Vistas: {visits.toLocaleString('es-CL')}</div>

          <div className="n-hero-text">
            <div className="n-hero-pill">
              <span>BIENVENIDO TOMACIN@S</span>
            </div>

            <h1>
              <span>SEMANA CERO</span>
              <strong>SANTO TOMÁS</strong>
            </h1>

            <p>
              Tu primera semana es el comienzo de algo grande.
              Explora, conéctate y descubre todo lo que tenemos para ti.
            </p>

            <div className="n-ingreso-progress" aria-label="Barra de avance desde ingreso">
              <div className="n-ingreso-progress-top">
                <span>Ingreso estudiantes: 09/03/26</span>
                <span>{Math.round(progressFill)}%</span>
              </div>
              <div className="n-ingreso-track">
                <span style={{ width: `${progressFill}%` }} />
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
          {serviceCards.map(({ icon: Icon, title, desc, tab }, idx) => (
            <motion.button
              key={title}
              type="button"
              className={`n-service-card n-service-card-btn n-service-${idx + 1}`}
              onClick={() => scrollToSemanaTab(tab)}
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
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/WWnK0FpAspM?rel=0&modestbranding=1&playsinline=1&mute=1${
                campusVideoActive ? '&autoplay=1' : ''
              }`}
              title="Conoce tu sede Santo Tomás Curicó"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            ></iframe>
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
            <SemanaCeroFullSections />
          </article>
        </div>
      </main>

      <nav className={`n-bottom-dock ${dockVisible || isMobileLayout ? 'is-visible' : ''}`} aria-label="Navegación rápida inferior">
        {BOTTOM_DOCK_ITEMS.map(({ id, targetId, label, num, tone, Icon }) => (
          <motion.button
            key={id}
            type="button"
            className={`n-bottom-dock-item n-bottom-dock-item--${tone} ${dockActive === id ? 'is-active' : ''}`}
            onClick={() => {
              handleDockAction(id, targetId)
            }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          >
            <span className="n-bottom-dock-glow" aria-hidden />
            <span className="n-bottom-dock-item-head">
              <span className="n-bottom-dock-index" aria-hidden>
                {num}
              </span>
              <span className={`n-bottom-dock-chip n-bottom-dock-chip--${tone}`}>
                <Icon size={20} strokeWidth={2.1} aria-hidden />
              </span>
            </span>
            <span className="n-bottom-dock-label">{label}</span>
          </motion.button>
        ))}
      </nav>

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
