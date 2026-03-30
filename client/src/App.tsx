import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Camera,
  ChevronRight,
  ChevronDown,
  Globe,
  GraduationCap,
  Heart,
  Laptop,
  Library,
  MailCheck,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Route,
  Shield,
  Star,
  Sun
} from 'lucide-react'
import './App.css'
import { LINKS, type SemanaTabId } from './semanaCeroContent'

let visitIncrementedThisLoad = false

function App() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    const antes = Number(localStorage.getItem('st_visits') ?? '0')
    const despues = antes + 1
    localStorage.setItem('st_visits', String(despues))
    setVisits(antes)
    const t = window.setTimeout(() => setVisits(despues), 420)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 9000)
    return () => clearInterval(interval)
  }, [])

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
    | { kind: 'link'; icon: LucideIcon; label: string; href: string; external?: boolean; highlight?: boolean }
    | { kind: 'sello'; icon: LucideIcon; label: string; highlight?: boolean }

  const menuItems: MenuRow[] = [
    { kind: 'link', icon: Laptop, label: 'Aulas Virtuales', href: LINKS.aulasVirtuales, external: true },
    { kind: 'link', icon: MapPin, label: 'Ubicación', href: LINKS.ubicacion, external: true },
    { kind: 'link', icon: BookOpen, label: 'Libro Tú Puedes', href: LINKS.libroTuPuedes, external: true },
    { kind: 'link', icon: Library, label: 'Biblioteca Virtual', href: LINKS.bibliotecaVirtual, external: true },
    { kind: 'sello', icon: Star, label: 'Personaje Sello 2026', highlight: true },
    { kind: 'link', icon: Globe, label: 'Sede en 360', href: LINKS.sede360, external: true }
  ]

  const serviceCards: {
    icon: LucideIcon
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

  const missionVision = [
    {
      title: 'Misión',
      text: 'Contribuir al desarrollo sostenible del país, transmitiendo conocimiento mediante la formación de personas a lo largo de la vida, inspirada en valores cristianos, la vinculación con el medio y la innovación.'
    },
    {
      title: 'Visión',
      text: 'Ser un Instituto Profesional reconocido por su compromiso con la transformación de sus estudiantes y el desarrollo sostenible de las comunidades con que se vincula, y una gestión de excelencia.'
    }
  ]

  const heroSlides = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=60',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=60',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=60'
  ]

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

  const chatFaq = {
    inicio: [
      {
        q: '¿Qué necesitas hoy?',
        a: 'Elige una sección: académica, seguridad, digital o institucional. Te responderé corto y directo.'
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
      { q: '¿Dónde veo seguros estudiantiles?', a: 'La información está en DAE.', ctaLabel: 'Ver seguros DAE', href: LINKS.segurosDae }
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

  const goSemanaCero = (tab: SemanaTabId = 'mision') => {
    navigate(tab === 'mision' ? '/semana-cero' : `/semana-cero?tab=${tab}`)
  }

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
          href={LINKS.instagramCurico}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram Sede Curicó"
        >
          <Camera size={20} />
        </a>
        <a
          className="n-quick-btn"
          href={LINKS.cft}
          target="_blank"
          rel="noopener noreferrer"
          title="Centro de Formación Técnica Santo Tomás"
        >
          <ChevronRight size={20} />
        </a>
        <a
          className="n-quick-btn"
          href={LINKS.ip}
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
              <strong>Asistente Semana Cero</strong>
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
                    <a className="n-chat-link" href={item.href} target="_blank" rel="noopener noreferrer">
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

        <button className="n-sidebar-toggle" onClick={() => setIsMenuOpen((prev) => !prev)}>
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
                href={item.href}
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
        <section className="n-hero-panel">
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
              <button type="button" className="n-btn-main" onClick={() => goSemanaCero('mision')}>
                Tu semana cero
              </button>
              <a
                className="n-btn-secondary"
                href={LINKS.sede360}
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
            <button
              key={title}
              type="button"
              className={`n-service-card n-service-card-btn n-service-${idx + 1}`}
              onClick={() => goSemanaCero(tab)}
            >
              <div className="n-service-icon">
                <Icon size={18} />
              </div>
              <div className="n-service-copy">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <ChevronRight size={14} aria-hidden />
            </button>
          ))}
        </section>
        </div>

        <section className="n-mv-section">
          <h2>Misión y Visión</h2>
          <div className="n-mv-grid">
            {missionVision.map((item) => (
              <article key={item.title} className="n-mv-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="n-campus-video">
          <h2>Conoce tu sede</h2>
          <div className="n-video-box">ESPACIO PARA VIDEO INSTITUCIONAL</div>
        </section>
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
/*
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu,
  Sun,
  Moon,
  Globe, 
  AtSign,
  MessageCircle,
  BookOpen, 
  User, 
  ChevronRight,
  Info,
  Library,
  Book,
  Star
} from 'lucide-react'
import './App.css'

const QuickLink = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => (
  <motion.a 
    href={href}
    className="link-item"
    whileHover={{ x: -10, scale: 1.1, backgroundColor: 'var(--primary)' }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    title={label}
  >
    <Icon size={22} />
  </motion.a>
)

function App() {
  // Estado UI
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  // Persistencia de tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const goToInfoSection = () => {
    const infoSection = document.getElementById('conoce-semana-cero')
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const goToCampusSection = () => {
    const campusSection = document.getElementById('conoce-nuestra-sede')
    if (campusSection) {
      campusSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6500)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 64, opacity: 0, scale: 0.96 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 }
    }
  }

  const textRevealVariants = {
    hidden: { y: 36, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7 }
    }
  }

  const heroSlides = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1100&q=45',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1100&q=45',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1100&q=45'
  ]

  const menuItems = [
    { icon: Info, label: 'Centro Información', href: '#' },
    { icon: User, label: 'Intranet', href: '#' },
    { icon: BookOpen, label: 'Aulas Virtuales', href: '#' },
    { icon: Book, label: 'Libro Tu Puedes', href: '#' },
    { icon: Library, label: 'Biblioteca Virtual', href: '#' },
    { icon: Star, label: 'Personaje Sello 2026', href: '#', highlight: true },
    { icon: Globe, label: 'Sede en 360', href: 'https://storage.net-fs.com/hosting/6520281/118/', external: true }
  ]

  return (
    <div className={`app-wrapper ${isMenuOpen ? 'menu-open' : ''}`} data-theme={theme}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <motion.aside
        className="left-menu"
        animate={{ width: isMenuOpen ? 300 : 86 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
      >
        <div className="left-menu-logo">
          <img src="/logo-st.svg" alt="Instituto Profesional Santo Tomás" />
        </div>

        <button className="menu-toggle-btn" onClick={() => setIsMenuOpen((prev) => !prev)}>
          <Menu size={22} />
          <AnimatePresence>
            {isMenuOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
              >
                MENÚ
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <nav className="left-menu-links">
          {menuItems.map(({ icon: Icon, label, href, highlight }) => (
            <a
              key={label}
              href={href}
              className={highlight ? 'highlight' : ''}
              title={label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
            >
              <Icon size={18} />
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          ))}
        </nav>

        <div className="left-menu-theme">
          <button onClick={toggleTheme} className="left-menu-theme-btn" title={theme === 'dark' ? 'Modo día' : 'Modo noche'}>
            {theme === 'dark' ? <Sun size={26} /> : <Moon size={26} />}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                >
                  {theme === 'dark' ? 'MODO DÍA' : 'MODO NOCHE'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      <section className="hero">
        <div className="hero-carousel" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroSlides[currentSlide]}
              src={heroSlides[currentSlide]}
              alt=""
              className="hero-slide"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </AnimatePresence>
          <div className="hero-overlay"></div>
        </div>

        <motion.div
          className="hero-content hero-content-right hero-content-shift-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="meta" style={{ marginBottom: '1.5rem', display: 'block' }}>
            BIENVENIDOS TOMACIN@S
          </span>
          <h1 className="hero-title">
            <span className="hero-title-main">Únete</span>
            <span className="hero-title-sub">A LA SEMANA CERO</span>
          </h1>
          <p>Comienza tu experiencia en el Instituto Profesional Santo Tomás con la mejor energía. Descubre todo lo que tenemos preparado para ti.</p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button className="btn-primary hero-explore-btn" onClick={goToInfoSection}>EXPLORAR INFORMACIÓN</button>
            <button className="btn-primary" onClick={goToCampusSection} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>CONOCE NUESTRA CEDE</button>
          </div>
        </motion.div>
      </section>
      <div className="hero-divider" aria-hidden="true"></div>

      <main className="container">
        <section id="mision-vision">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Misión y Visión
          </motion.h2>
          
          <motion.div 
            className="grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="glass-card" variants={itemVariants}>
              <div className="meta">Misión</div>
              <motion.h3 variants={textRevealVariants}>Compromiso Institucional</motion.h3>
              <motion.p variants={textRevealVariants} style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Contribuir al desarrollo sostenible del país, transmitiendo conocimiento mediante la formación de personas a lo largo de la vida, inspirada en valores cristianos, la vinculación con el medio y la innovación.
              </motion.p>
            </motion.div>

            <motion.div className="glass-card" variants={itemVariants}>
              <div className="meta">Visión</div>
              <motion.h3 variants={textRevealVariants}>Proyección de Excelencia</motion.h3>
              <motion.p variants={textRevealVariants} style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Ser un Instituto Profesional reconocido por su compromiso con la transformación de sus estudiantes y el desarrollo sostenible de las comunidades con que se vincula, y una gestión de excelencia.
              </motion.p>
            </motion.div>
          </motion.div>
        </section>

        <section className="resources" id="conoce-semana-cero">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Conoce sobre tu semana Cero 
          </motion.h2>
          <p className="section-subtitle">Todo lo que necesitas sabes en un solo lugar.</p>
          <div className="grid">
            {[
              { title: 'Valores Institucionales', desc: 'Conoce los principios que guían tu formación en Santo Tomás.', icon: User, label: 'IDENTIDAD' },
              { title: 'Reglamento', desc: 'Revisa normas académicas y de convivencia para tu vida estudiantil.', icon: BookOpen, label: 'NORMATIVA' },
              { title: 'Vías de Evacuasion', desc: 'Ubica rutas de seguridad y protocolos frente a emergencias.', icon: Library, label: 'SEGURIDAD' },
              { title: 'Activacion de Correo', desc: 'Activa y usa tu correo institucional para todas tus plataformas.', icon: Globe, label: 'CONECTIVIDAD' },
            ].map((res, idx) => (
              <motion.div 
                key={idx} 
                className="glass-card" 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                 <div className="meta">{res.label}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: '1.5rem 0' }}>
                  <div style={{ padding: '1rem', background: 'var(--primary-glow)', borderRadius: '16px', display: 'flex' }}>
                    <res.icon size={28} color="var(--primary)" />
                  </div>
                  <h4 style={{ fontSize: '1.4rem' }}>{res.title}</h4>
                 </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{res.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="more-info-action">
            <button className="btn-primary" onClick={() => setShowMoreInfo((prev) => !prev)}>
              {showMoreInfo ? 'OCULTAR INFORMACION ADICIONAL' : 'INFORMATE MAS SOBRE LA SEMANA CERO'}
            </button>
          </div>

          <div className="campus-media-section" id="conoce-nuestra-sede">
            <h3>CONOCE NUESTRA SEDE</h3>
            <div className="campus-media-grid">
            <div className="video-placeholder-section">
              <div className="video-embed-placeholder">ESPACIO RESERVADO PARA VIDEO INSTITUCIONAL</div>
            </div>
            </div>
            <div className="campus-360-action">
              <a
                className="btn-primary campus-360-btn"
                href="https://storage.net-fs.com/hosting/6520281/118/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CONOCE NUESTRA SEDE EN 360
              </a>
            </div>
          </div>

          {showMoreInfo && (
            <motion.div
              className="grid extra-info-grid"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {[
                {
                  title: 'Calendario de Actividades',
                  desc: 'Revisa fechas clave, horarios y jornadas especiales de tu Semana Cero.',
                  label: 'PLANIFICACION'
                },
                {
                  title: 'Induccion Academica',
                  desc: 'Conoce tu malla, reglamento interno y recomendaciones para el primer semestre.',
                  label: 'ACADEMICO'
                },
                {
                  title: 'Vida Estudiantil',
                  desc: 'Descubre talleres, apoyo estudiantil, beneficios y canales de acompañamiento.',
                  label: 'BIENESTAR'
                },
                {
                  title: 'Servicios Digitales',
                  desc: 'Aprende a usar correo institucional, plataformas de aula y herramientas online.',
                  label: 'TECNOLOGIA'
                }
              ].map((item) => (
                <div key={item.title} className="glass-card">
                  <div className="meta">{item.label}</div>
                  <h3>{item.title}</h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <div className="right-rail">
        <div className="quicklinks">
          <QuickLink icon={AtSign} href="#" label="Instagram" />
          <QuickLink icon={ChevronRight} href="#" label="Portales ST" />
          <QuickLink icon={MessageCircle} href="#" label="Chatbot (Próximamente)" />
        </div>
      </div>

      <footer>
        <img src="https://www.santotomas.cl/wp-content/themes/santotomas/assets/img/logo-st.png" alt="Santo Tomás" style={{ height: '35px', filter: 'brightness(1)', marginBottom: '2rem' }} />
        <p>&copy; 2026 Instituto Profesional Santo Tomás. Todos los derechos reservados.</p>
        <p style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>Dirección Nacional de Asuntos Estudiantiles</p>
      </footer>
    </div>
  )
}

export default App
*/
