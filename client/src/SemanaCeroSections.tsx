import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flag,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  Shield,
  Sparkles,
  Target,
  Video,
  X,
  User,
  Library,
  Boxes
} from 'lucide-react'
import {
  ACADEMIC_CFT_CARRERAS_PDFS,
  ACADEMIC_IP_CARRERAS,
  ACADEMIC_LIM,
  APOYO_PDFS,
  CFT_LINKS,
  COMITE_CURICO,
  EVACUATION_VIDEOS,
  IP_LINKS,
  LINKS,
  MISSION_VISION,
  VALORES
} from './semanaCeroContent'

function LinkRow({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <a className="scp-linkrow" href={href} target="_blank" rel="noopener noreferrer">
      <div className="scp-linkrow-body">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <ArrowUpRight size={18} aria-hidden />
    </a>
  )
}

const secMotion = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
}

const childStagger = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 }
}

const TABS = [
  { id: 'mision', label: 'Misión y Visión', icon: Target },
  { id: 'apoyo', label: 'Apoyo', icon: GraduationCap },
  { id: 'academica', label: 'Académica', icon: Library },
  { id: 'valores', label: 'Valores', icon: Heart },
  { id: 'reglamentos', label: 'Políticas', icon: BookOpen },
  { id: 'seguros', label: 'Seguros', icon: Shield },
  { id: 'evacuacion', label: 'Evacuación', icon: Video },
  { id: 'correo', label: 'Correo', icon: Mail },
  { id: 'vcm', label: 'Vinculación', icon: Globe },
  { id: 'innovacion', label: 'Innovación', icon: Sparkles },
  { id: 'comite', label: 'Comité', icon: User },
  { id: 'denuncias', label: 'Canal', icon: Flag }
]

const APOYO_AREAS = [
  { title: 'Admisión', subtitle: 'Orientación y acceso a tu proceso de ingreso', href: 'https://www.ipsantotomas.cl/admision/' },
  {
    title: 'Educación Continua',
    subtitle: 'Cursos, diplomados y especialización',
    href: 'https://www.santotomas.cl/educacion-continua/'
  },
  {
    title: 'Innovación',
    subtitle: 'Programas y ecosistema de innovación institucional',
    href: 'https://www.santotomas.cl/?s=innovacion'
  },
  {
    title: 'LIM',
    subtitle: 'Lenguaje, Inglés y Matemática (apoyo transversal)',
    href: LINKS.pdfLimTransversales
  },
  {
    title: 'Prevención de Riesgo',
    subtitle: 'Protocolos y apoyo en seguridad estudiantil',
    href: LINKS.segurosDae
  },
  {
    title: 'Rectoría',
    subtitle: 'Autoridades y conducción institucional',
    href: 'https://www.santotomas.cl/informacion-institucional/autoridades/'
  },
  { title: 'E-learning', subtitle: 'Plataforma académica y recursos digitales', href: LINKS.aulasVirtuales },
  {
    title: 'Vinculación',
    subtitle: 'Relación con el medio y proyectos comunitarios',
    href: 'https://www.santotomas.cl/vinculacion-con-el-medio/'
  }
] as const

export function SemanaCeroFullSections() {
  const [cftPanelOpen, setCftPanelOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<{ nombre: string; cargo: string; foto: string } | null>(null)
  const [activeTab, setActiveTab] = useState<string>('mision')
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false)
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false)
  const [tabsContainer, setTabsContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail)
    }
    window.addEventListener('changeSemanaTab', handleTabChange)
    return () => window.removeEventListener('changeSemanaTab', handleTabChange)
  }, [])

  useEffect(() => {
    if (!tabsContainer) return
    const updateArrows = () => {
      const maxScrollLeft = tabsContainer.scrollWidth - tabsContainer.clientWidth
      setCanScrollTabsLeft(tabsContainer.scrollLeft > 6)
      setCanScrollTabsRight(tabsContainer.scrollLeft < maxScrollLeft - 6)
    }
    updateArrows()
    tabsContainer.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      tabsContainer.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [tabsContainer])

  const scrollTabs = (dir: 'left' | 'right') => {
    if (!tabsContainer) return
    const amount = Math.max(220, Math.round(tabsContainer.clientWidth * 0.55))
    tabsContainer.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="scp-panel">
      <div className="scp-tabs-wrap">
        <button
          type="button"
          className="scp-tabs-arrow"
          aria-label="Ver secciones anteriores"
          onClick={() => scrollTabs('left')}
          disabled={!canScrollTabsLeft}
        >
          <ChevronLeft size={34} strokeWidth={3} />
        </button>
        <div className="scp-tabs-container" ref={setTabsContainer}>
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                className={`scp-tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="scp-tabs-arrow"
          aria-label="Ver más secciones"
          onClick={() => scrollTabs('right')}
          disabled={!canScrollTabsRight}
        >
          <ChevronRight size={34} strokeWidth={3} />
        </button>
      </div>

      <div className="scp-tab-content">
        <AnimatePresence mode="wait">
        {activeTab === 'mision' && (
          <motion.section key="mision" className="scp-block" id="semana-mision" aria-labelledby="sec-mision" {...secMotion}>
            <h2 id="sec-mision" className="scp-h2">Misión y visión</h2>
            <p className="scp-lead">El propósito y la proyección de nuestra institución.</p>
            <div className="scp-mv-grid">
              <article className="scp-card-mv">
                <div className="scp-card-mv-ic"><Target size={22} /></div>
                <h3>Misión</h3>
                <p>{MISSION_VISION.mision}</p>
              </article>
              <article className="scp-card-mv">
                <div className="scp-card-mv-ic"><Sparkles size={22} /></div>
                <h3>Visión</h3>
                <p>{MISSION_VISION.vision}</p>
              </article>
            </div>
          </motion.section>
        )}

        {activeTab === 'valores' && (
          <motion.section key="valores" className="scp-block" id="semana-valores" aria-labelledby="sec-valores" {...secMotion}>
            <h2 id="sec-valores" className="scp-h2">Valores institucionales</h2>
            <p className="scp-lead">Los pilares que guían nuestra comunidad educativa.</p>
            <div className="scp-val-grid">
              {VALORES.map((v) => (
                <motion.div key={v.title} className="scp-val-card" {...childStagger}>
                  <Heart className="scp-val-heart" size={20} />
                  <h3>{v.title}</h3>
                  {v.badge && <span className="scp-val-badge">{v.badge}</span>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'reglamentos' && (
          <motion.section key="reglamentos" className="scp-block" id="semana-reglamentos" aria-labelledby="sec-reg" {...secMotion}>
            <h2 id="sec-reg" className="scp-h2">Políticas y reglamentos</h2>
            <p className="scp-lead">Normativa oficial del Instituto Profesional y del Centro de Formación Técnica.</p>
            <div className="scp-reg-grid">
              <div className="scp-reg-col">
                <h3 className="scp-h3"><GraduationCap size={18} aria-hidden /> Instituto Profesional (IP)</h3>
                <div className="scp-linklist">
                  {IP_LINKS.map((l) => <LinkRow key={l.href + l.title} {...l} />)}
                </div>
              </div>
              <div className="scp-reg-col">
                <h3 className="scp-h3"><BookOpen size={18} aria-hidden /> Centro de Formación Técnica (CFT)</h3>
                <div className="scp-linklist">
                  {CFT_LINKS.map((l) => <LinkRow key={l.href + l.title} {...l} />)}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'seguros' && (
          <motion.section key="seguros" className="scp-block" id="semana-seguros" aria-labelledby="sec-seg" {...secMotion}>
            <h2 id="sec-seg" className="scp-h2">Seguros para estudiantes</h2>
            <p className="scp-lead">Coberturas y apoyo institucional (DAE).</p>
            <div className="scp-cards">
              <a className="scp-scard" href={LINKS.segurosDae} target="_blank" rel="noopener noreferrer">
                <Shield size={22} />
                <div><strong>Seguro escolar Ley 16.744</strong><span>Cobertura de accidentes escolares</span></div>
                <ExternalLink size={16} />
              </a>
              <a className="scp-scard" href={LINKS.segurosDae} target="_blank" rel="noopener noreferrer">
                <Shield size={22} />
                <div><strong>Seguro de accidentes personales</strong><span>Información y requisitos en portal DAE</span></div>
                <ExternalLink size={16} />
              </a>
            </div>
            <p className="scp-footnote">Ante cualquier duda, acércate a Dirección de Asuntos Estudiantiles (DAE).</p>
          </motion.section>
        )}

        {activeTab === 'evacuacion' && (
          <motion.section key="evacuacion" className="scp-block" id="semana-evacuacion" aria-labelledby="sec-ev" {...secMotion}>
            <h2 id="sec-ev" className="scp-h2">Vías de evacuación</h2>
            <p className="scp-lead">Videos instructivos y referencias de seguridad (Sede Curicó).</p>
            <h3 className="scp-h3-inline"><Video size={16} aria-hidden /> Videos en YouTube</h3>
            <div className="scp-video-grid">
              {EVACUATION_VIDEOS.map((v) => (
                <a key={v.href} className="scp-vid-card" href={v.href} target="_blank" rel="noopener noreferrer">
                  <span className="scp-vid-play">▶</span><span>{v.label}</span>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'correo' && (
          <motion.section key="correo" className="scp-block" id="semana-correo" aria-labelledby="sec-co" {...secMotion}>
            <h2 id="sec-co" className="scp-h2">Activa tu correo y cuenta</h2>
            <p className="scp-lead">Acceso a sistemas institucionales Microsoft.</p>
            <div className="scp-cards">
              <a className="scp-scard" href={LINKS.recuperaClave} target="_blank" rel="noopener noreferrer">
                <Mail size={22} />
                <div><strong>Recupera tu clave</strong><span>Si olvidaste tus credenciales</span></div>
                <ExternalLink size={16} />
              </a>
              <a className="scp-scard" href={LINKS.actualizaClave} target="_blank" rel="noopener noreferrer">
                <Mail size={22} />
                <div><strong>Actualiza tu clave</strong><span>Renueva tu contraseña de forma segura</span></div>
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.section>
        )}

        {activeTab === 'apoyo' && (
          <motion.section key="apoyo" className="scp-block" id="semana-apoyo" aria-labelledby="sec-ap" {...secMotion}>
            <h2 id="sec-ap" className="scp-h2">Unidades de apoyo</h2>
            <p className="scp-lead">Inducción pedagógica y recursos transversales.</p>
            
            <div className="scp-doc-hero" aria-labelledby="doc-hero-title">
              <div className="scp-doc-hero-glow" aria-hidden />
              <div className="scp-doc-hero-inner">
                <div className="scp-doc-hero-icon" aria-hidden><Sparkles size={26} strokeWidth={1.75} /></div>
                <div className="scp-doc-hero-copy">
                  <p className="scp-doc-hero-kicker">Semana Cero · Docencia</p>
                  <h3 id="doc-hero-title" className="scp-doc-hero-title">Tu formación y desarrollo docente</h3>
                  <p className="scp-doc-hero-desc">Inducción pedagógica, lineamientos y recursos para fortalecer tu práctica en el aula.</p>
                  <div className="scp-doc-hero-actions">
                    <a className="scp-doc-hero-btn scp-doc-hero-btn-primary" href={LINKS.pdfFormacionDocente} target="_blank" rel="noopener noreferrer">
                      Información <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="scp-apoyo-pdf-grid" role="list">
              {[...APOYO_PDFS, ...APOYO_AREAS].map((item, index) => (
                <motion.a
                  key={item.title} role="listitem" href={item.href} target="_blank" rel="noopener noreferrer"
                  className="scp-apoyo-pdf-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="scp-nav-num">{String(index + 1).padStart(2, '0')}</span>
                  {index < APOYO_PDFS.length ? (
                    <GraduationCap size={22} aria-hidden className="scp-apoyo-pdf-ic" />
                  ) : (
                    <Boxes size={22} aria-hidden className="scp-apoyo-pdf-ic" />
                  )}
                  <div className="scp-apoyo-pdf-text">
                    <strong>{item.title}</strong><span>{item.subtitle}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'academica' && (
          <motion.section key="academica" className="scp-block" id="semana-academica" aria-labelledby="sec-ac" {...secMotion}>
            <h2 id="sec-ac" className="scp-h2">Área académica</h2>
            <p className="scp-lead">Carreras, práctica, titulación y portal formativo CFT / IP.</p>
            
            <div className="scp-cft-accordion-wrap">
              <article className={`scp-scard scp-scard-expand scp-cft-panel ${cftPanelOpen ? 'is-open' : ''}`}>
                <button type="button" className="scp-scard-head" onClick={() => setCftPanelOpen((v) => !v)} id="cft-panel-toggle">
                  <BookOpen size={22} />
                  <div>
                    <strong>Centro de Formación Técnica (CFT)</strong>
                    <span>Carreras Semana Cero — toca para desplegar u ocultar</span>
                  </div>
                  <ChevronDown size={16} className="scp-scard-chevron" />
                </button>
                {cftPanelOpen && (
                  <div className="scp-scard-body scp-cft-panel-body" role="region">
                    <div className="scp-linklist">
                      {ACADEMIC_CFT_CARRERAS_PDFS.map((l) => <LinkRow key={l.href + l.title} {...l} />)}
                    </div>
                  </div>
                )}
              </article>
            </div>
            
            <a className="scp-feature" href={LINKS.aulasVirtuales} target="_blank" rel="noopener noreferrer">
              <div className="scp-feature-ic"><BookOpen size={24} /></div>
              <div><strong>Aulas virtuales — E-learning</strong><span>Accede a la plataforma oficial de cursos.</span></div>
              <ArrowUpRight size={20} />
            </a>

            <h3 className="scp-h3"><GraduationCap size={18} aria-hidden /> Instituto Profesional (IP)</h3>
            <div className="scp-linklist">
              {ACADEMIC_IP_CARRERAS.map((l) => <LinkRow key={l.href + l.title} {...l} />)}
            </div>

            <h3 className="scp-h3"><Sparkles size={18} aria-hidden /> Unidades transversales — LIM</h3>
            <div className="scp-lim-grid">
              {ACADEMIC_LIM.map((lim) => (
                <article key={lim.title} className="scp-lim-card">
                  <h4 className="scp-lim-title">{lim.title}</h4>
                  <p className="scp-lim-body">{lim.body}</p>
                  <a className="scp-lim-link" href={lim.href} target="_blank" rel="noopener noreferrer">
                    {lim.linkLabel} <ExternalLink size={14} />
                  </a>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'vcm' && (
          <motion.section key="vcm" className="scp-block" id="semana-vcm" aria-labelledby="sec-vcm" {...secMotion}>
            <h2 id="sec-vcm" className="scp-h2">Vinculación con el medio (VCM)</h2>
            <p className="scp-lead">Proyectos con la comunidad, prácticas y alianzas.</p>
            <div className="scp-cards" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div className="scp-scard scp-scard-highlight" style={{ cursor: 'default' }}>
                <Globe size={28} style={{ color: 'var(--scp-accent)' }} />
                <div>
                  <strong>Prácticas y Comunidad</strong>
                  <span>Conectamos el talento de nuestros estudiantes con las urgencias del entorno, entregando valor real.</span>
                </div>
              </div>
              <div className="scp-scard scp-scard-highlight" style={{ cursor: 'default' }}>
                <Target size={28} style={{ color: '#0284c7' }} />
                <div>
                  <strong>Proyectos e Iniciativas</strong>
                  <span>Programas integradores que fortalecen comunidades y enriquecen la formación profesional continua.</span>
                </div>
              </div>
            </div>
            <p className="scp-prose" style={{ marginTop: '1.5rem' }}>
              La VCM conecta tu formación con organizaciones y territorios.
            </p>
          </motion.section>
        )}

        {activeTab === 'innovacion' && (
          <motion.section key="innovacion" className="scp-block" id="semana-innovacion" aria-labelledby="sec-in" {...secMotion}>
            <h2 id="sec-in" className="scp-h2">Innovación y emprendimiento</h2>
            <p className="scp-lead">Líneas de desarrollo de ideas y proyectos.</p>
            <div className="scp-mv-grid" style={{ marginTop: '1.5rem' }}>
              <article className="scp-card-mv">
                <div className="scp-card-mv-ic" style={{ color: '#0284c7' }}><Sparkles size={22} /></div>
                <h3>Talleres Activos</h3>
                <p>Fomentamos el pensamiento crítico para que nuestras ideas transformen nuestro futuro profesional de manera transversal.</p>
              </article>
              <article className="scp-card-mv">
                <div className="scp-card-mv-ic" style={{ color: '#ea580c' }}><BookOpen size={22} /></div>
                <h3>Línea Emprendedora</h3>
                <p>Construye tu propio futuro a partir de proyectos creativos y tecnológicos diseñados directamente desde el aula.</p>
              </article>
            </div>
          </motion.section>
        )}

        {activeTab === 'comite' && (
          <motion.section key="comite" className="scp-block" id="semana-comite" aria-labelledby="sec-com" {...secMotion}>
            <h2 id="sec-com" className="scp-h2">Comité directivo — Sede Curicó</h2>
            <p className="scp-lead">Equipo liderando la gestión y excelencia académica en Santo Tomás.</p>
            <div className="scp-comite-grid">
              {COMITE_CURICO.map((p) => (
                <article key={p.nombre} className="scp-comite-card" role="button" tabIndex={0} onClick={() => setSelectedMember(p)}>
                  <div className="scp-comite-img-wrap"><img src={p.foto} alt="" loading="lazy" /></div>
                  <div><strong>{p.nombre}</strong><span>{p.cargo}</span></div>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'denuncias' && (
          <motion.section key="denuncias" className="scp-block" id="semana-denuncias" aria-labelledby="sec-de" {...secMotion}>
            <h2 id="sec-de" className="scp-h2">Canal de denuncias</h2>
            <p className="scp-lead">Plataforma confidencial y segura.</p>
            <a className="scp-feature" href={LINKS.canalDenuncias} target="_blank" rel="noopener noreferrer">
              <div className="scp-feature-ic scp-feature-ic-warn"><Flag size={24} /></div>
              <div><strong>Canal oficial Universidad Santo Tomás</strong><span>Reporta cualquier situación con total seguridad institucional y confidencialidad.</span></div>
              <ArrowUpRight size={20} />
            </a>
          </motion.section>
        )}
        </AnimatePresence>
      </div>

      {selectedMember && (
        <div className="scp-comite-modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="scp-comite-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="scp-comite-modal-close" onClick={() => setSelectedMember(null)} aria-label="Cerrar"><X size={20} strokeWidth={2.5} /></button>
            <img src={selectedMember.foto} alt={selectedMember.nombre} />
            <h3>{selectedMember.nombre}</h3>
            <p>{selectedMember.cargo}</p>
          </div>
        </div>
      )}
    </div>
  )
}
