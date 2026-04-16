import {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ComponentType,
  type ReactNode,
  type TouchEvent
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BookMarked,
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  Copyright,
  ExternalLink,
  FileBadge,
  FileText,
  Flag,
  FolderOpen,
  Gavel,
  Globe,
  GraduationCap,
  Handshake,
  HardHat,
  Heart,
  Leaf,
  Lightbulb,
  Mail,
  Monitor,
  Newspaper,
  Percent,
  Plane,
  Scale,
  ScrollText,
  Shield,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Video,
  Wallet,
  X,
  User,
  Library,
  Search
} from 'lucide-react'
import {
  ACADEMIC_CFT_CARRERAS_PDFS,
  CFT_CARRERA_AREAS,
  ACADEMIC_IP_CARRERAS,
  ACADEMIC_LIM,
  APOYO_PDFS,
  APOYO_CURICO_CONTACT,
  CFT_DOCUMENTACION_FUNDAMENTAL,
  CFT_POLITICAS_INSTITUCIONALES,
  CFT_REGLAMENTOS,
  COMITE_CURICO,
  EVACUATION_VIDEOS,
  IP_POLITICAS_INSTITUCIONALES,
  IP_REGLAMENTOS,
  IP_DOCUMENTOS_INSTITUCIONALES,
  LINKS,
  MISSION_VISION,
  VALORES,
  type ScpLinkRowIcon
} from './semanaCeroContent'

type ScpLeadSvgIcon = ComponentType<{ className?: string; size?: number; 'aria-hidden'?: boolean }>

const SCP_LINK_LEAD_ICONS: Record<ScpLinkRowIcon, ScpLeadSvgIcon> = {
  folderOpen: FolderOpen,
  scale: Scale,
  users: Users,
  fileBadge: FileBadge,
  lightbulb: Lightbulb,
  handshake: Handshake,
  leaf: Leaf,
  userCheck: UserCheck,
  badgeCheck: BadgeCheck,
  bookOpen: BookOpen,
  monitor: Monitor,
  hardHat: HardHat,
  gavel: Gavel,
  heart: Heart,
  plane: Plane,
  flag: Flag,
  wallet: Wallet,
  percent: Percent,
  sparkles: Sparkles,
  bookMarked: BookMarked,
  shield: Shield,
  copyright: Copyright,
  fileText: FileText,
  calendar: Calendar,
  clipboardList: ClipboardList,
  scrollText: ScrollText
}

function LinkRow({
  title,
  subtitle,
  href,
  areaLabel,
  icon
}: {
  title: string
  subtitle?: string
  href: string
  /** Etiqueta breve (ej. área CFT) sobre el título */
  areaLabel?: string
  /** Ícono a la izquierda (Políticas/Reglamentos); si no va, solo título + flecha */
  icon?: ScpLinkRowIcon
}) {
  const LeadIcon = icon ? SCP_LINK_LEAD_ICONS[icon] : null
  const body = (
    <div className="scp-linkrow-body">
      {areaLabel && <span className="scp-linkrow-area">{areaLabel}</span>}
      <strong>{title}</strong>
      {subtitle && <span>{subtitle}</span>}
    </div>
  )
  return (
    <a className="scp-linkrow" href={href} target="_blank" rel="noopener noreferrer">
      {LeadIcon ? (
        <div className="scp-linkrow-main">
          <LeadIcon className="scp-linkrow-lead" size={20} aria-hidden />
          {body}
        </div>
      ) : (
        body
      )}
      <ArrowUpRight className="scp-linkrow-external" size={18} aria-hidden />
    </a>
  )
}

/** Info oficial a la izquierda; afiche digital en columna derecha (responsive). */
function CarreraAficheDualRow({
  title,
  subtitle,
  infoHref,
  aficheHref,
  areaLabel
}: {
  title: string
  subtitle: string
  infoHref: string
  aficheHref: string
  areaLabel?: string
}) {
  const aficheLabel = `Ver afiche digital Semana Cero — ${title}`
  return (
    <div className="scp-linkrow scp-linkrow-dual scp-linkrow-dual--row">
      <a
        className="scp-linkrow-main scp-linkrow-main--with-afiche"
        href={infoHref}
        target="_blank"
        rel="noopener noreferrer"
        title="Información de la carrera (sitio oficial)"
      >
        <div className="scp-linkrow-body">
          {areaLabel && <span className="scp-linkrow-area">{areaLabel}</span>}
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        <ArrowUpRight size={18} aria-hidden />
      </a>
      <div className="scp-carrera-afiche-rail">
        <button
          type="button"
          className="scp-apoyo-afiche-btn scp-afiche-btn--carrera"
          aria-label={aficheLabel}
          title="Abre el PDF del afiche digital de tu carrera"
          onClick={() => window.open(aficheHref, '_blank', 'noopener,noreferrer')}
        >
          <span className="scp-apoyo-afiche-btn-ic" aria-hidden>
            <Newspaper size={22} strokeWidth={2} />
          </span>
          <span className="scp-apoyo-afiche-btn-copy">
            <span className="scp-apoyo-afiche-btn-title">Tu afiche digital</span>
            <span className="scp-apoyo-afiche-btn-sub">PDF de tu carrera · Semana Cero</span>
          </span>
          <ExternalLink size={18} aria-hidden className="scp-apoyo-afiche-btn-go" />
        </button>
      </div>
    </div>
  )
}

const secMotion = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
}

/** Transición más rápida al entrar a Apoyo (contenido útil al tiro). */
const secMotionApoyo = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }
}

const childStagger = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 }
}

/** Fondo animado + parallax suave para el hero de docencia (Apoyo). */
function DocHeroShell({
  children,
  className,
  'aria-labelledby': ariaLabelledBy
}: {
  children: ReactNode
  className?: string
  'aria-labelledby'?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const lastPtrRef = useRef<{ x: number; y: number } | null>(null)

  const applyPointer = useCallback((clientX: number, clientY: number) => {
    const el = rootRef.current
    if (!el) return
    const prev = lastPtrRef.current
    if (prev) {
      const d = Math.max(Math.abs(clientX - prev.x), Math.abs(clientY - prev.y))
      if (d < 12) return
    }
    lastPtrRef.current = { x: clientX, y: clientY }
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    const x = (clientX - r.left) / r.width
    const y = (clientY - r.top) / r.height
    el.style.setProperty('--dx', x.toFixed(4))
    el.style.setProperty('--dy', y.toFixed(4))
  }, [])

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => applyPointer(e.clientX, e.clientY))
    },
    [applyPointer]
  )

  const onLeave = useCallback(() => {
    lastPtrRef.current = null
    const el = rootRef.current
    if (!el) return
    el.style.setProperty('--dx', '0.5')
    el.style.setProperty('--dy', '0.42')
  }, [])

  const onTouch = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      const t = e.touches[0]
      if (t) applyPointer(t.clientX, t.clientY)
    },
    [applyPointer]
  )

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={className}
      aria-labelledby={ariaLabelledBy}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchMove={onTouch}
    >
      <div className="scp-doc-hero-bg" aria-hidden>
        <div className="scp-doc-hero-mesh" />
        <div className="scp-doc-hero-aurora" />
        <div className="scp-doc-hero-orb scp-doc-hero-orb--a" />
        <div className="scp-doc-hero-orb scp-doc-hero-orb--b" />
        <div className="scp-doc-hero-orb scp-doc-hero-orb--c" />
        <div className="scp-doc-hero-shimmer" />
        <div className="scp-doc-hero-grid" />
      </div>
      {children}
    </div>
  )
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
  { id: 'denuncias', label: 'Denuncias', icon: Flag }
]

const APOYO_AREAS = [
  {
    title: 'Admisión',
    subtitle: 'Orientación y acceso a tu proceso de ingreso',
    href: 'https://drive.google.com/drive/folders/17ZKHbK8gVCrmTURl6WXKYG7hbImgRNfw?usp=drive_link'
  },
  {
    title: 'Educación Continua',
    subtitle: 'Cursos, diplomados y especialización',
    href: 'https://drive.google.com/drive/folders/1kjFQCzTwKxpPvURV9O72hI_VntQSYWpe?usp=drive_link'
  },
  {
    title: 'Innovación',
    subtitle: 'Programas y ecosistema de innovación institucional',
    href: 'https://drive.google.com/drive/folders/1D_o_X77YzUgcbR8hNrmEPZ1zFkwQZ_UY?usp=drive_link'
  },
  {
    title: 'LIM',
    subtitle: 'Lenguaje, Inglés y Matemática (apoyo transversal)',
    href: LINKS.pdfLimTransversales
  },
  {
    title: 'Prevención de Riesgo',
    subtitle: 'Protocolos y apoyo en seguridad estudiantil',
    href: 'https://drive.google.com/drive/folders/1TZVwmI99huyHOAH0ekTY3sOgui6MBEVz?usp=drive_link'
  },
  {
    title: 'Rectoría',
    subtitle: 'Autoridades y conducción institucional',
    href: 'https://drive.google.com/drive/folders/1VskJPiu3hEoieIQ2aJT-rbNF6010JSEf?usp=drive_link'
  },
  {
    title: 'Vinculación',
    subtitle: 'Relación con el medio y proyectos comunitarios',
    href: 'https://drive.google.com/drive/folders/1vD4hDhmlpp9IlHjLGKO2l7l1t5zcsiEp?usp=sharing'
  }
] as const

function SemanaCeroFullSectionsInner() {
  const [cftPanelOpen, setCftPanelOpen] = useState(false)
  const [cftSearch, setCftSearch] = useState('')
  const [cftArea, setCftArea] = useState<string>('Todas')
  const [selectedMember, setSelectedMember] = useState<{ nombre: string; cargo: string; foto: string } | null>(null)
  const [activeTab, setActiveTab] = useState<string>('mision')
  const [apoyoCategory, setApoyoCategory] = useState<string>('Todas')
  const [apoyoSearch, setApoyoSearch] = useState('')
  const [regIpOpen, setRegIpOpen] = useState(false)
  const [regCftOpen, setRegCftOpen] = useState(false)

  const getApoyoCategory = (title: string) => {
    switch(title) {
      case 'Centro de Aprendizaje':
      case 'Biblioteca':
      case 'Formación':
      case 'Educación Continua':
      case 'LIM':
        return 'Académico';
      case 'Registro Curricular':
      case 'DAO':
      case 'Admisión':
        return 'Administrativo';
      case 'DAE':
      case 'Prevención de Riesgo':
        return 'Vida Estudiantil';
      case 'Innovación':
      case 'Rectoría':
      case 'Vinculación':
        return 'Institucional';
      case 'Soporte de Informática':
      case 'E-learning':
      case 'Cómo imprimir':
        return 'Soporte y Tech';
      default:
        return 'Institucional';
    }
  }

  const apoyoItems = [
    ...APOYO_PDFS.map((p) => ({
      ...p,
      type: 'pdfs' as const,
      category: getApoyoCategory(p.title),
      curico: APOYO_CURICO_CONTACT[p.title]
    })),
    ...APOYO_AREAS.map((a) => ({
      ...a,
      type: 'areas' as const,
      category: getApoyoCategory(a.title),
      curico: APOYO_CURICO_CONTACT[a.title]
    }))
  ]
  const listCat = ['Todas', 'Académico', 'Administrativo', 'Vida Estudiantil', 'Institucional', 'Soporte y Tech']
  
  const filteredApoyo = apoyoItems.filter(item => {
    const matchCat = apoyoCategory === 'Todas' || item.category === apoyoCategory;
    const matchStr = item.title.toLowerCase().includes(apoyoSearch.toLowerCase()) || item.subtitle.toLowerCase().includes(apoyoSearch.toLowerCase());
    return matchCat && matchStr;
  });

  const cftAreaFilters = ['Todas', ...CFT_CARRERA_AREAS] as const
  const filteredCftCarreras = ACADEMIC_CFT_CARRERAS_PDFS.filter((item) => {
    const matchArea = cftArea === 'Todas' || item.area === cftArea
    const q = cftSearch.trim().toLowerCase()
    const matchStr =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.area.toLowerCase().includes(q)
    return matchArea && matchStr
  })
  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail)
    }
    window.addEventListener('changeSemanaTab', handleTabChange)
    return () => window.removeEventListener('changeSemanaTab', handleTabChange)
  }, [])

  return (
    <div className="scp-panel">
      <div className="scp-tabs-wrap">
        <div className="scp-tabs-container">
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
            <div className="scp-reg-accordion-stack">
              <article className={`scp-scard scp-scard-expand scp-cft-panel ${regIpOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="scp-scard-head"
                  id="reg-ip-toggle"
                  aria-expanded={regIpOpen}
                  onClick={() => setRegIpOpen((v) => !v)}
                >
                  <GraduationCap size={22} aria-hidden />
                  <div>
                    <strong>Instituto Profesional (IP)</strong>
                    <span>Políticas, reglamentos y documentos oficiales</span>
                  </div>
                  <ChevronDown size={16} className="scp-scard-chevron" aria-hidden />
                </button>
                <div
                  className={`scp-reg-panel-collapse ${regIpOpen ? 'is-open' : ''}`}
                  role="region"
                  aria-labelledby="reg-ip-toggle"
                  aria-hidden={!regIpOpen}
                >
                  <div className="scp-reg-panel-collapse-inner">
                    <div className="scp-scard-body scp-cft-panel-body scp-reg-panel-body">
                      <h3 className="scp-h3-inline">Políticas institucionales — IP</h3>
                      <div className="scp-linklist">
                        {IP_POLITICAS_INSTITUCIONALES.map((l) => (
                          <LinkRow key={l.href + l.title} {...l} />
                        ))}
                      </div>
                      <h3 className="scp-h3-inline" style={{ marginTop: '0.9rem' }}>Reglamentos — IP</h3>
                      <div className="scp-linklist">
                        {IP_REGLAMENTOS.map((l) => (
                          <LinkRow key={l.href + l.title} {...l} />
                        ))}
                      </div>
                      <h3 className="scp-h3-inline" style={{ marginTop: '0.9rem' }}>Documentos institucionales IP</h3>
                      <div className="scp-linklist">
                        {IP_DOCUMENTOS_INSTITUCIONALES.map((l) => (
                          <LinkRow key={l.href + l.title} {...l} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className={`scp-scard scp-scard-expand scp-cft-panel ${regCftOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="scp-scard-head"
                  id="reg-cft-toggle"
                  aria-expanded={regCftOpen}
                  onClick={() => setRegCftOpen((v) => !v)}
                >
                  <BookOpen size={22} aria-hidden />
                  <div>
                    <strong>Centro de Formación Técnica (CFT)</strong>
                    <span>Políticas, reglamentos y documentos oficiales</span>
                  </div>
                  <ChevronDown size={16} className="scp-scard-chevron" aria-hidden />
                </button>
                <div
                  className={`scp-reg-panel-collapse ${regCftOpen ? 'is-open' : ''}`}
                  role="region"
                  aria-labelledby="reg-cft-toggle"
                  aria-hidden={!regCftOpen}
                >
                  <div className="scp-reg-panel-collapse-inner">
                    <div className="scp-scard-body scp-cft-panel-body scp-reg-panel-body">
                      <h3 className="scp-h3-inline">Políticas institucionales — CFT</h3>
                      <div className="scp-linklist">
                        {CFT_POLITICAS_INSTITUCIONALES.map((l) => (
                          <LinkRow key={l.href + l.title} {...l} />
                        ))}
                      </div>
                      <h3 className="scp-h3-inline" style={{ marginTop: '0.9rem' }}>Reglamentos — CFT</h3>
                      <div className="scp-linklist">
                        {CFT_REGLAMENTOS.map((l) => (
                          <LinkRow key={l.href + l.title} {...l} />
                        ))}
                      </div>
                      <h3 className="scp-h3-inline" style={{ marginTop: '0.9rem' }}>Documentación fundamental — CFT</h3>
                      <div className="scp-linklist">
                        {CFT_DOCUMENTACION_FUNDAMENTAL.map((l) => (
                          <LinkRow key={l.href + l.title} {...l} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
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
              <a className="scp-scard" href={LINKS.pdfAficheSeguroEscolar} target="_blank" rel="noopener noreferrer">
                <Shield size={22} />
                <div><strong>Afiche escolar seguro de accidente</strong><span>Material visual oficial (PDF)</span></div>
                <ExternalLink size={16} />
              </a>
              <a className="scp-scard" href={LINKS.pdfVolanteSeguroEscolar} target="_blank" rel="noopener noreferrer">
                <Shield size={22} />
                <div><strong>Volante digital</strong><span>Resumen informativo seguro escolar (PDF)</span></div>
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
            <div className="scp-evac-emergency" role="region" aria-label="Planos prioritarios de emergencia">
              <p className="scp-evac-emergency-title">
                <AlertTriangle size={20} strokeWidth={2.25} aria-hidden />
                Prioritario: conocé la simbología de emergencia por piso
              </p>
              <div className="scp-evac-emergency-grid">
                <a
                  className="scp-evac-emergency-card"
                  href={LINKS.pdfEvacPlanta3Emergencia}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="scp-evac-emergency-card-kicker">Plano PDF</span>
                  <strong>Planta 3° piso</strong>
                  <span>Simbología de emergencia</span>
                  <span className="scp-evac-emergency-card-cta">
                    Abrir en Drive <ExternalLink size={16} aria-hidden />
                  </span>
                </a>
                <a
                  className="scp-evac-emergency-card"
                  href={LINKS.pdfEvacPlanta4Emergencia}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="scp-evac-emergency-card-kicker">Plano PDF</span>
                  <strong>Planta 4° piso</strong>
                  <span>Simbología de emergencia y zona segura (sismos)</span>
                  <span className="scp-evac-emergency-card-cta">
                    Abrir en Drive <ExternalLink size={16} aria-hidden />
                  </span>
                </a>
              </div>
            </div>
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
          <motion.section key="apoyo" className="scp-block" id="semana-apoyo" aria-labelledby="sec-ap" {...secMotionApoyo}>
            <h2 id="sec-ap" className="scp-h2">Unidades de apoyo</h2>
            <p className="scp-lead">Inducción pedagógica y recursos transversales.</p>
            
            <div className="scp-doc-hero-stack">
              <DocHeroShell className="scp-doc-hero" aria-labelledby="doc-hero-title">
                <div className="scp-doc-hero-glow" aria-hidden />
                <div className="scp-doc-hero-inner">
                  <div className="scp-doc-hero-icon" aria-hidden><Sparkles size={26} strokeWidth={1.75} /></div>
                  <div className="scp-doc-hero-copy">
                    <p className="scp-doc-hero-kicker">Exclusivo para docentes</p>
                    <h3 id="doc-hero-title" className="scp-doc-hero-title">Tu formación y desarrollo docente</h3>
                    <p className="scp-doc-hero-desc">Cursos gratuitos 100% virtuales para apoyar tu práctica pedagógica.</p>
                    <div className="scp-doc-hero-actions">
                      <a className="scp-doc-hero-btn scp-doc-hero-btn-primary" href={LINKS.pdfFormacionDocente} target="_blank" rel="noopener noreferrer">
                        Infórmate <ExternalLink size={16} />
                      </a>
                      <a className="scp-doc-hero-btn scp-doc-hero-btn-secondary" href={LINKS.formacionDocenteDrive} target="_blank" rel="noopener noreferrer">
                        Ver Cursos <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </DocHeroShell>
            </div>

            <div className="scp-apoyo-interactive">
              <div className="scp-apoyo-search-bar">
                <Search className="scp-apoyo-search-ic" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar área, servicio o documento..." 
                  value={apoyoSearch}
                  onChange={(e) => setApoyoSearch(e.target.value)}
                />
              </div>

              <div className="scp-apoyo-filters" role="group" aria-label="Filtro de unidades de apoyo">
                {listCat.map(cat => (
                  <button 
                    key={cat}
                    type="button"
                    className={`scp-apoyo-filter-btn ${apoyoCategory === cat ? 'active' : ''}`}
                    onClick={() => setApoyoCategory(cat)}
                  >{cat}</button>
                ))}
              </div>
            </div>

            <div className="scp-apoyo-pdf-grid" role="list">
              {filteredApoyo.length === 0 ? (
                <div className="scp-apoyo-empty">
                  No se encontraron áreas asociadas a tu búsqueda.
                </div>
              ) : (
                filteredApoyo.map((item, index) => {
                  const driveUrl = item.curico?.driveFolderUrl
                  const materialHref = item.href
                  const hasDualDestino = Boolean(driveUrl && materialHref !== driveUrl)
                  /** Sin animación de entrada larga: se ve al instante y no confunde con “carga”. */
                  const cardMotion = {
                    initial: { opacity: 1, scale: 1 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true },
                    transition: { duration: 0 }
                  } as const

                  const openMaterial = () => {
                    window.open(materialHref, '_blank', 'noopener,noreferrer')
                  }

                  const eyeLabel = `Abrir tu afiche digital — ${item.title}`

                  if (hasDualDestino) {
                    return (
                      <motion.div
                        key={item.title}
                        role="listitem"
                        className="scp-apoyo-pdf-card scp-apoyo-pdf-card--dual"
                        {...cardMotion}
                      >
                        <a
                          className="scp-apoyo-pdf-main"
                          href={driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir carpeta Google Drive — Sede Curicó"
                        >
                          <span className="scp-nav-num">{String(index + 1).padStart(2, '0')}</span>
                          <GraduationCap size={22} aria-hidden className="scp-apoyo-pdf-ic" />
                          <div className="scp-apoyo-pdf-text">
                            <strong>{item.title}</strong>
                            <span>{item.subtitle}</span>
                          </div>
                        </a>
                        <div className="scp-apoyo-dual-split" role="presentation" aria-hidden />
                        <button
                          type="button"
                          className="scp-apoyo-afiche-btn scp-apoyo-afiche-btn--apoyo"
                          aria-label={eyeLabel}
                          title="Abre el PDF de tu afiche digital en una pestaña nueva"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openMaterial()
                          }}
                        >
                          <span className="scp-apoyo-afiche-leading" aria-hidden>
                            <span className="scp-apoyo-afiche-tag">PDF</span>
                            <span className="scp-apoyo-afiche-btn-ic">
                              <Newspaper size={20} strokeWidth={2} />
                            </span>
                          </span>
                          <span className="scp-apoyo-afiche-btn-copy">
                            <span className="scp-apoyo-afiche-btn-title">Tu afiche digital</span>
                          </span>
                          <ExternalLink size={16} aria-hidden className="scp-apoyo-afiche-btn-go" />
                        </button>
                      </motion.div>
                    )
                  }

                  const href = driveUrl ?? materialHref
                  return (
                    <motion.a
                      key={item.title}
                      role="listitem"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="scp-apoyo-pdf-card"
                      {...cardMotion}
                    >
                      <span className="scp-nav-num">{String(index + 1).padStart(2, '0')}</span>
                      <GraduationCap size={22} aria-hidden className="scp-apoyo-pdf-ic" />
                      <div className="scp-apoyo-pdf-text">
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                      </div>
                    </motion.a>
                  )
                })
              )}
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
                    <span>PDF Semana Cero por carrera — abrí, buscá o filtrá por área</span>
                  </div>
                  <ChevronDown size={16} className="scp-scard-chevron" />
                </button>
                {cftPanelOpen && (
                  <div className="scp-scard-body scp-cft-panel-body" role="region" aria-labelledby="cft-panel-toggle">
                    <div className="scp-cft-interactive">
                      <p className="scp-cft-filter-hint">Encontrá tu carrera por nombre o por área formativa.</p>
                      <div className="scp-cft-search-center">
                        <div className="scp-apoyo-search-bar scp-cft-search-bar-centered">
                          <Search className="scp-apoyo-search-ic" size={18} aria-hidden />
                          <input
                            type="search"
                            value={cftSearch}
                            onChange={(e) => setCftSearch(e.target.value)}
                            placeholder="Buscar carrera… (ej. enfermería, parvularia)"
                            aria-label="Buscar carrera CFT"
                          />
                        </div>
                      </div>
                      <div className="scp-apoyo-filters" role="group" aria-label="Filtrar por área CFT">
                        {cftAreaFilters.map((area) => (
                          <button
                            key={area}
                            type="button"
                            className={`scp-apoyo-filter-btn ${cftArea === area ? 'active' : ''}`}
                            onClick={() => setCftArea(area)}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                      <p className="scp-cft-results-meta" aria-live="polite">
                        {filteredCftCarreras.length === ACADEMIC_CFT_CARRERAS_PDFS.length
                          ? `${ACADEMIC_CFT_CARRERAS_PDFS.length} carreras`
                          : `${filteredCftCarreras.length} de ${ACADEMIC_CFT_CARRERAS_PDFS.length} carreras`}
                      </p>
                    </div>
                    <div className="scp-linklist scp-cft-linklist">
                      {filteredCftCarreras.length === 0 ? (
                        <div className="scp-apoyo-empty">No hay carreras con ese criterio. Probá otra búsqueda o elegí &quot;Todas&quot;.</div>
                      ) : (
                        filteredCftCarreras.map((l) => {
                          const infoHref = l.infoHref ?? l.href
                          const hasDualDestino = infoHref !== l.href

                          if (!hasDualDestino) {
                            return (
                              <LinkRow key={l.href + l.title} title={l.title} subtitle={l.subtitle} href={infoHref} areaLabel={l.area} />
                            )
                          }

                          return (
                            <CarreraAficheDualRow
                              key={l.href + l.title}
                              title={l.title}
                              subtitle={l.subtitle}
                              areaLabel={l.area}
                              infoHref={infoHref}
                              aficheHref={l.href}
                            />
                          )
                        })
                      )}
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
              {ACADEMIC_IP_CARRERAS.map((l) => {
                const infoHref = l.infoHref ?? l.href
                const hasDualDestino = infoHref !== l.href

                if (!hasDualDestino) {
                  return <LinkRow key={l.href + l.title} title={l.title} subtitle={l.subtitle} href={infoHref} />
                }

                return (
                  <CarreraAficheDualRow
                    key={l.href + l.title}
                    title={l.title}
                    subtitle={l.subtitle}
                    infoHref={infoHref}
                    aficheHref={l.href}
                  />
                )
              })}
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
            <h2 id="sec-vcm" className="scp-h2">Vinculación con el medio</h2>
            <p className="scp-lead">Accede al material oficial de Vinculación con el medio.</p>
            <a className="scp-feature" href={LINKS.pdfVinculacionConElMedio} target="_blank" rel="noopener noreferrer">
              <div className="scp-feature-ic"><Globe size={24} /></div>
              <div><strong>Vinculación con el medio</strong><span>Documento oficial (PDF).</span></div>
              <ArrowUpRight size={20} />
            </a>
          </motion.section>
        )}

        {activeTab === 'innovacion' && (
          <motion.section key="innovacion" className="scp-block" id="semana-innovacion" aria-labelledby="sec-in" {...secMotion}>
            <h2 id="sec-in" className="scp-h2">Innovación y emprendimiento</h2>
            <p className="scp-lead">Accede al material oficial de innovación y emprendimiento.</p>
            <a className="scp-feature" href={LINKS.pdfInnovacionEmprendimiento} target="_blank" rel="noopener noreferrer">
              <div className="scp-feature-ic"><Sparkles size={24} /></div>
              <div><strong>Innovación y emprendimiento</strong><span>Documento oficial (PDF).</span></div>
              <ArrowUpRight size={20} />
            </a>
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
            <h2 id="sec-de" className="scp-h2">Denuncias</h2>
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

export const SemanaCeroFullSections = memo(SemanaCeroFullSectionsInner)
