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
    { icon: Star, label: 'Personaje Sello 2026', href: '#', highlight: true }
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
            <a key={label} href={href} className={highlight ? 'highlight' : ''} title={label}>
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
            <a href="#mision-vision" className="btn-primary hero-explore-btn">EXPLORAR INFORMACIÓN</a>
            <button className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>VER MAPA CAMPUS</button>
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

        <section className="resources">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Conoce sobre tu semana cero
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
              INFORMATE MAS SOBRE LA SEMANA 0
            </button>
          </div>

          <AnimatePresence>
            {showMoreInfo && (
              <motion.div
                className="grid extra-info-grid"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.45 }}
              >
                {[
                  { title: 'Espacio 1', desc: 'Aqui agregaremos el contenido que nos indiques.' },
                  { title: 'Espacio 2', desc: 'Aqui agregaremos el contenido que nos indiques.' },
                  { title: 'Espacio 3', desc: 'Aqui agregaremos el contenido que nos indiques.' },
                  { title: 'Espacio 4', desc: 'Aqui agregaremos el contenido que nos indiques.' }
                ].map((item) => (
                  <motion.div key={item.title} className="glass-card" variants={itemVariants}>
                    <div className="meta">Proximamente</div>
                    <h3>{item.title}</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
