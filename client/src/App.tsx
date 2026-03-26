import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu,
  Sun,
  Moon,
  MapPin, 
  Clock, 
  Globe, 
  AtSign,
  MessageCircle,
  BookOpen, 
  User, 
  ArrowRight,
  ChevronRight,
  Info,
  Library,
  Book,
  Star
} from 'lucide-react'
import './App.css'

interface Activity {
  id: number;
  day: string;
  activity: string;
  time: string;
  location: string;
}

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
  const [schedule, setSchedule] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    fetch('http://localhost:3000/api/schedule')
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

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
        <motion.div
          className="hero-content hero-content-right"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="meta" style={{ marginBottom: '1.5rem', display: 'block' }}>
            ADMISIÓN 2026
          </span>
          <h1 className="hero-title">
            <span className="hero-title-main">Únete</span>
            <span className="hero-title-sub">A LA SEMANA CERO</span>
          </h1>
          <p>Comienza tu experiencia en el Instituto Profesional Santo Tomás con la mejor energía. Descubre todo lo que tenemos preparado para ti.</p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <a href="#schedule" className="btn-primary">EXPLORAR ACTIVIDADES</a>
            <button className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>VER MAPA CAMPUS</button>
          </div>
        </motion.div>
      </section>

      <main className="container">
        <section id="schedule">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Tu Cronograma
          </motion.h2>
          
          <motion.div 
            className="grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--primary)', fontWeight: 600 }}>Cargando eventos...</p>
            ) : (
              schedule.map((item) => (
                <motion.div key={item.id} className="glass-card" variants={itemVariants}>
                  <div className="meta">{item.day}</div>
                  <h3>{item.activity}</h3>
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <Clock size={18} color="var(--primary)" />
                      {item.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <MapPin size={18} color="var(--primary)" />
                      {item.location}
                    </div>
                  </div>
                  <motion.div 
                    style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                    whileHover={{ x: 10 }}
                  >
                    MÁS INFORMACIÓN <ArrowRight size={18} />
                  </motion.div>
                </motion.div>
              ))
            )}
          </motion.div>
        </section>

        <section className="resources">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ecosistema Digital
          </motion.h2>
          <div className="grid">
            {[
              { title: 'Intranet', desc: 'Gestiona tu vida académica y notas', icon: User, label: 'MI PORTAL' },
              { title: 'Aula Virtual', desc: 'Accede a tus clases y materiales', icon: BookOpen, label: 'ESTUDIOS' },
              { title: 'Biblioteca', desc: 'Recursos digitales y catálogos', icon: Library, label: 'APOYO' },
              { title: 'Soporte IT', desc: 'Ayuda técnica para tus plataformas', icon: Globe, label: 'AYUDA' },
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
