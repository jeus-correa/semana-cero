import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Clock, 
  Globe, 
  BookOpen, 
  User, 
  ArrowRight,
  ExternalLink,
  ChevronRight
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
    whileHover={{ x: -5, backgroundColor: 'var(--primary)' }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    title={label}
  >
    <Icon size={20} />
  </motion.a>
)

function App() {
  const [schedule, setSchedule] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="app-wrapper">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="nav-wrapper">
        <div className="top-bar">
          <div className="top-bar-links">
            <a href="#"><Globe size={14} /> <span>Instagram</span></a>
            <a href="#"><MapPin size={14} /> <span>Ubicación</span></a>
          </div>
          <div className="top-bar-links">
            <a href="#"><User size={14} /> <span>Intranet</span></a>
            <a href="#"><BookOpen size={14} /> <span>Aulas Virtuales</span></a>
            <a href="#" className="btn-primary" style={{ padding: '0.3rem 0.8rem', height: '24px', fontSize: '0.65rem', display: 'flex', alignItems: 'center' }}>TU PUEDES</a>
          </div>
        </div>
        <div className="main-nav">
          <div className="logo-container">
            <img src="https://www.santotomas.cl/wp-content/themes/santotomas/assets/img/logo-st.png" alt="Santo Tomás" />
          </div>
          <div className="nav-links">
            <a href="#" className="active">INICIO</a>
            <a href="#">CFT</a>
            <a href="#">IP</a>
            <a href="#">BIBLIOTECA VIRTUAL</a>
            <a href="#">PERSONAJES SELLO 2026</a>
            <a href="#" style={{ color: 'var(--accent)' }}>SOPORTE</a>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}>ADMISIÓN</button>
          </div>
        </div>
      </div>

      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="meta" style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', marginBottom: '1rem', display: 'block' }}>
            ADMISIÓN 2026
          </span>
          <h1>Semana Cero</h1>
          <p>Comienza tu viaje universitario con la mejor energía. Descubre todo lo que Santo Tomás tiene preparado para ti.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="#schedule" className="btn-primary">EXPLORAR ACTIVIDADES</a>
            <a href="#" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)', boxShadow: 'none' }}>VER MAPA CAMPUS</a>
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
              <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Cargando futuro...</p>
            ) : (
              schedule.map((item) => (
                <motion.div key={item.id} className="glass-card" variants={itemVariants}>
                  <div className="meta">{item.day}</div>
                  <h3>{item.activity}</h3>
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Clock size={16} color="var(--primary)" />
                      {item.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <MapPin size={16} color="var(--primary)" />
                      {item.location}
                    </div>
                  </div>
                  <motion.div 
                    style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                    whileHover={{ x: 5 }}
                  >
                    Saber más <ArrowRight size={16} />
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
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { title: 'Intranet', desc: 'Gestiona tu vida académica', icon: User, label: 'CENTRO DE FORMACIÓN TÉCNICA' },
              { title: 'Aula Virtual', desc: 'Tus clases y materiales', icon: BookOpen, label: 'INSTITUTO PROFESIONAL' },
              { title: 'Biblioteca', desc: 'Recursos de investigación', icon: ExternalLink, label: 'BIBLIOTECA VIRTUAL' },
              { title: 'Soporte IT', desc: 'Ayuda técnica 24/7', icon: Globe, label: 'UBICACIÓN' },
            ].map((res, idx) => (
              <motion.div 
                key={idx} 
                className="glass-card" 
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
              >
                 <div className="meta" style={{ fontSize: '0.7rem' }}>{res.label}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.8rem', background: 'var(--primary-glow)', borderRadius: '12px' }}>
                    <res.icon size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.1rem' }}>{res.title}</h4>
                  </div>
                 </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{res.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <div className="quicklinks">
        <QuickLink icon={Globe} href="#" label="Instagram" />
        <QuickLink icon={Globe} href="#" label="Sitio Web" />
        <QuickLink icon={ChevronRight} href="#" label="Más Info" />
      </div>

      <footer>
        <img src="https://www.santotomas.cl/wp-content/themes/santotomas/assets/img/logo-st.png" alt="Santo Tomás" style={{ height: '30px', filter: 'brightness(0) invert(1)', marginBottom: '1.5rem', opacity: 0.5 }} />
        <p>&copy; 2026 Universidad Santo Tomás. Todos los derechos reservados.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Dirección Nacional de Asuntos Estudiantiles</p>
      </footer>
    </div>
  )
}

export default App
