import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Flag,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  Shield,
  Sparkles,
  Target,
  Video
} from 'lucide-react'
import { listSupportItems, type SupportItem } from './api'
import {
  ACADEMIC_CFT_BLOCKS,
  ACADEMIC_CFT_CARRERAS_PDFS,
  ACADEMIC_IP_CARRERAS,
  ACADEMIC_LIM,
  ACADEMIC_PRACTICA_TITULOS,
  APOYO_PDFS,
  CFT_LINKS,
  COMITE_CURICO,
  EVACUATION_VIDEOS,
  IP_LINKS,
  LINKS,
  MISSION_VISION,
  VALORES,
  type SemanaTabId
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

type Props = {
  tab: SemanaTabId
  onTabChange: (id: SemanaTabId) => void
}

const APOYO_INFO: Record<string, { detail: string; hours: string }> = {
  Biblioteca: { detail: 'Atención y apoyo bibliográfico para estudiantes.', hours: '08:00 a 23:00 horas' },
  DAE: { detail: 'Atendido por equipo DAE para orientación y beneficios.', hours: '08:00 a 23:00 horas' },
  'Centro de Aprendizaje': { detail: 'Tutorías y reforzamiento académico personalizado.', hours: '08:00 a 23:00 horas' },
  'Registro Curricular': { detail: 'Gestión de documentos y procesos curriculares.', hours: '08:00 a 23:00 horas' },
  DAO: { detail: 'Apoyo financiero, aranceles y convenios de pago.', hours: '08:00 a 23:00 horas' },
  'Soporte de Informática': {
    detail: 'Informática atendido por Maikel, Javier y Sebastián.',
    hours: '08:00 a 23:00 horas'
  },
  Formación: { detail: 'Acompañamiento institucional y contenidos formativos.', hours: '08:00 a 23:00 horas' },
  'Cómo imprimir': { detail: 'Guía de impresión y uso de equipos de sede.', hours: '08:00 a 23:00 horas' }
}

export function SemanaCeroSections({ tab, onTabChange }: Props) {
  const [dynamicSupport, setDynamicSupport] = useState<SupportItem[]>([])
  const [openSupportCard, setOpenSupportCard] = useState<string | null>(null)
  const [cftPanelOpen, setCftPanelOpen] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const items = await listSupportItems()
        if (active) setDynamicSupport(items)
      } catch {
        if (active) setDynamicSupport([])
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  const latestSupport = useMemo(() => dynamicSupport.slice(0, 10), [dynamicSupport])

  return (
    <div className="scp-panel">
      {tab === 'mision' && (
        <section className="scp-block" aria-labelledby="sec-mision">
          <h2 id="sec-mision" className="scp-h2">
            Misión y visión
          </h2>
          <p className="scp-lead">El propósito y la proyección de nuestra institución.</p>
          <div className="scp-mv-grid">
            <article className="scp-card-mv">
              <div className="scp-card-mv-ic">
                <Target size={22} />
              </div>
              <h3>Misión</h3>
              <p>{MISSION_VISION.mision}</p>
            </article>
            <article className="scp-card-mv">
              <div className="scp-card-mv-ic">
                <Sparkles size={22} />
              </div>
              <h3>Visión</h3>
              <p>{MISSION_VISION.vision}</p>
            </article>
          </div>
        </section>
      )}

      {tab === 'valores' && (
        <section className="scp-block" aria-labelledby="sec-valores">
          <h2 id="sec-valores" className="scp-h2">
            Valores institucionales
          </h2>
          <p className="scp-lead">Los pilares que guían nuestra comunidad educativa.</p>
          <div className="scp-val-grid">
            {VALORES.map((v) => (
              <div key={v.title} className="scp-val-card">
                <Heart className="scp-val-heart" size={20} />
                <h3>{v.title}</h3>
                {v.badge && <span className="scp-val-badge">{v.badge}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'reglamentos' && (
        <section className="scp-block" aria-labelledby="sec-reg">
          <h2 id="sec-reg" className="scp-h2">
            Políticas y reglamentos
          </h2>
          <p className="scp-lead">
            Normativa oficial del Instituto Profesional y del Centro de Formación Técnica. Los enlaces se abren en una
            nueva pestaña.
          </p>
          <div className="scp-reg-grid">
            <div className="scp-reg-col">
              <h3 className="scp-h3">
                <GraduationCap size={18} aria-hidden /> Instituto Profesional (IP)
              </h3>
              <div className="scp-linklist">
                {IP_LINKS.map((l) => (
                  <LinkRow key={l.href + l.title} {...l} />
                ))}
              </div>
            </div>
            <div className="scp-reg-col">
              <h3 className="scp-h3">
                <BookOpen size={18} aria-hidden /> Centro de Formación Técnica (CFT)
              </h3>
              <div className="scp-linklist">
                {CFT_LINKS.map((l) => (
                  <LinkRow key={l.href + l.title} {...l} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === 'seguros' && (
        <section className="scp-block" aria-labelledby="sec-seg">
          <h2 id="sec-seg" className="scp-h2">
            Seguros para estudiantes
          </h2>
          <p className="scp-lead">Coberturas y apoyo institucional (DAE).</p>
          <div className="scp-cards">
            <a className="scp-scard" href={LINKS.segurosDae} target="_blank" rel="noopener noreferrer">
              <Shield size={22} />
              <div>
                <strong>Seguro escolar Ley 16.744</strong>
                <span>Cobertura de accidentes escolares</span>
              </div>
              <ExternalLink size={16} />
            </a>
            <a className="scp-scard" href={LINKS.segurosDae} target="_blank" rel="noopener noreferrer">
              <Shield size={22} />
              <div>
                <strong>Seguro de accidentes personales</strong>
                <span>Información y requisitos en portal DAE</span>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="scp-footnote">
            Todo estudiante matriculado cuenta con seguro contra accidentes. Ante cualquier duda, acércate a Dirección
            de Asuntos Estudiantiles (DAE).
          </p>
        </section>
      )}

      {tab === 'evacuacion' && (
        <section className="scp-block" aria-labelledby="sec-ev">
          <h2 id="sec-ev" className="scp-h2">
            Vías de evacuación
          </h2>
          <p className="scp-lead">Videos instructivos y referencias de seguridad (Sede Curicó).</p>
          <h3 className="scp-h3-inline">
            <Video size={16} aria-hidden /> Videos en YouTube
          </h3>
          <div className="scp-video-grid">
            {EVACUATION_VIDEOS.map((v) => (
              <a key={v.href} className="scp-vid-card" href={v.href} target="_blank" rel="noopener noreferrer">
                <span className="scp-vid-play">▶</span>
                <span>{v.label}</span>
              </a>
            ))}
          </div>
          <p className="scp-alert">
            Ante emergencias, sigue las indicaciones del personal y dirígete a la zona de seguridad más cercana.
          </p>
        </section>
      )}

      {tab === 'correo' && (
        <section className="scp-block" aria-labelledby="sec-co">
          <h2 id="sec-co" className="scp-h2">
            Activa tu correo y cuenta
          </h2>
          <p className="scp-lead">Acceso a sistemas institucionales Microsoft.</p>
          <div className="scp-cards">
            <a className="scp-scard" href={LINKS.recuperaClave} target="_blank" rel="noopener noreferrer">
              <Mail size={22} />
              <div>
                <strong>Recupera tu clave</strong>
                <span>Si olvidaste tus credenciales</span>
              </div>
              <ExternalLink size={16} />
            </a>
            <a className="scp-scard" href={LINKS.actualizaClave} target="_blank" rel="noopener noreferrer">
              <Mail size={22} />
              <div>
                <strong>Actualiza tu clave</strong>
                <span>Renueva tu contraseña de forma segura</span>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="scp-footnote">
            ¿Problemas técnicos? Solicita apoyo en <strong>Soporte de Informática</strong> (4.° piso en sede).
          </p>
        </section>
      )}

      {tab === 'apoyo' && (
        <section className="scp-block" aria-labelledby="sec-ap">
          <h2 id="sec-ap" className="scp-h2">
            Unidades de apoyo
          </h2>
          <p className="scp-lead">Selecciona el apartado que necesitas y abre su PDF directo.</p>

          <div className="scp-doc-hero" aria-labelledby="doc-hero-title">
            <div className="scp-doc-hero-glow" aria-hidden />
            <div className="scp-doc-hero-inner">
              <div className="scp-doc-hero-icon" aria-hidden>
                <Sparkles size={26} strokeWidth={1.75} />
              </div>
              <div className="scp-doc-hero-copy">
                <p className="scp-doc-hero-kicker">Semana Cero · Docencia</p>
                <h3 id="doc-hero-title" className="scp-doc-hero-title">
                  Tu formación y desarrollo docente
                </h3>
                <p className="scp-doc-hero-desc">
                  Inducción pedagógica, lineamientos y recursos para fortalecer tu práctica en el aula.
                </p>
                <div className="scp-doc-hero-actions">
                  <a
                    className="scp-doc-hero-btn scp-doc-hero-btn-primary"
                    href={LINKS.pdfFormacionDocente}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Información <ExternalLink size={16} />
                  </a>
                  <a
                    className="scp-doc-hero-btn scp-doc-hero-btn-secondary"
                    href={LINKS.formacionDocenteDrive}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Materiales y curso (Drive) <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <ol className="scp-apoyo-list" aria-label="Listado de unidades de apoyo">
            {APOYO_PDFS.map((item, index) => (
              <li key={item.title}>
                <article
                  className={`scp-scard scp-scard-expand scp-apoyo-row ${openSupportCard === item.title ? 'is-open' : ''} ${item.extras?.length ? 'has-extras' : ''}`}
                >
                  <button
                    type="button"
                    className="scp-scard-head"
                    onClick={() => setOpenSupportCard((prev) => (prev === item.title ? null : item.title))}
                    aria-expanded={openSupportCard === item.title}
                  >
                    <span className="scp-nav-num">{String(index + 1).padStart(2, '0')}</span>
                    <GraduationCap size={22} aria-hidden />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                    <ChevronDown size={16} className="scp-scard-chevron" aria-hidden />
                  </button>
                  <div className="scp-scard-body-wrap">
                    <div className="scp-scard-body">
                      <span className="scp-scard-meta">
                        {APOYO_INFO[item.title]?.detail ?? 'Información de la unidad.'} ·{' '}
                        {APOYO_INFO[item.title]?.hours ?? 'Horario por confirmar'}
                      </span>
                      {item.extras && item.extras.length > 0 && (
                        <div className="scp-scard-extras">
                          {item.extras.map((ex) => (
                            <a
                              key={ex.label}
                              className="scp-scard-extra-btn"
                              href={ex.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {ex.label} <ExternalLink size={13} />
                            </a>
                          ))}
                        </div>
                      )}
                      <a className="scp-scard-link" href={item.href} target="_blank" rel="noopener noreferrer">
                        Ver PDF de la unidad <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          {latestSupport.length > 0 && (
            <>
              <div className="scp-docentes-head">
                <h3 className="scp-docentes-title">Contenidos cargados por docentes</h3>
                <p className="scp-docentes-sub">Material complementario publicado por equipos académicos</p>
              </div>
              <div className="scp-linklist scp-linklist-docentes">
                {latestSupport.map((item) => (
                  <a key={item.id} className="scp-linkrow" href={item.contentUrl} target="_blank" rel="noopener noreferrer">
                    <div className="scp-linkrow-body">
                      <strong>{item.title}</strong>
                      <span>
                        {item.unit} · {item.description}
                      </span>
                    </div>
                    <ArrowUpRight size={18} aria-hidden />
                  </a>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {tab === 'academica' && (
        <section className="scp-block" aria-labelledby="sec-ac">
          <h2 id="sec-ac" className="scp-h2">
            Área académica
          </h2>
          <p className="scp-lead">
            Carreras IP y CFT, práctica y titulación, unidades transversales (LIM) y accesos digitales institucionales.
          </p>

          <div className="scp-cft-accordion-wrap">
            <article
              className={`scp-scard scp-scard-expand scp-cft-panel ${cftPanelOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="scp-scard-head"
                onClick={() => setCftPanelOpen((v) => !v)}
                aria-expanded={cftPanelOpen}
                id="cft-panel-toggle"
              >
                <BookOpen size={22} />
                <div>
                  <strong>Centro de Formación Técnica (CFT)</strong>
                  <span>Carreras Semana Cero — PDF por programa (toca para desplegar u ocultar)</span>
                </div>
                <ChevronDown size={16} className="scp-scard-chevron" />
              </button>
              <div className="scp-scard-body scp-cft-panel-body" role="region" aria-labelledby="cft-panel-toggle">
                <p className="scp-cft-panel-intro">
                  Elige tu carrera para abrir el PDF de inducción. Abajo, enlaces al portal oficial del CFT.
                </p>
                <div className="scp-linklist">
                  {ACADEMIC_CFT_CARRERAS_PDFS.map((l) => (
                    <LinkRow key={l.href + l.title} {...l} />
                  ))}
                </div>
                <p className="scp-h3-inline scp-cft-portal-label">
                  <Globe size={16} aria-hidden /> Portal CFT
                </p>
                <div className="scp-linklist">
                  {ACADEMIC_CFT_BLOCKS.map((l) => (
                    <LinkRow key={l.href + l.title} {...l} />
                  ))}
                </div>
              </div>
            </article>
          </div>

          <a className="scp-feature" href={LINKS.aulasVirtuales} target="_blank" rel="noopener noreferrer">
            <div className="scp-feature-ic">
              <BookOpen size={24} />
            </div>
            <div>
              <strong>Aulas virtuales — E-learning</strong>
              <span>Accede a la plataforma oficial de cursos y recursos.</span>
            </div>
            <ArrowUpRight size={20} />
          </a>
          <a className="scp-feature" href={LINKS.pdfPlataformasELearning} target="_blank" rel="noopener noreferrer">
            <div className="scp-feature-ic">
              <BookOpen size={24} />
            </div>
            <div>
              <strong>Plataformas E-Learning — PDF Semana Cero</strong>
              <span>Guía de plataformas y modalidad digital (documento institucional).</span>
            </div>
            <ArrowUpRight size={20} />
          </a>
          <a className="scp-feature scp-feature-neutral" href={LINKS.sede360} target="_blank" rel="noopener noreferrer">
            <div className="scp-feature-ic scp-feature-ic-neutral">
              <Globe size={24} />
            </div>
            <div>
              <strong>Conoce la sede en 360°</strong>
              <span>Recorrido virtual (se abre en una nueva pestaña; funciona en cualquier dispositivo).</span>
            </div>
            <ArrowUpRight size={20} />
          </a>

          <h3 className="scp-h3">
            <GraduationCap size={18} aria-hidden /> Instituto Profesional (IP) — carreras
          </h3>
          <p className="scp-prose scp-prose-tight">
            PDF de inducción Semana Cero por carrera; la fila «Ingeniería y carreras afines» lleva al sitio oficial para
            revisar toda la oferta IP.
          </p>
          <div className="scp-linklist">
            {ACADEMIC_IP_CARRERAS.map((l) => (
              <LinkRow key={l.href + l.title} {...l} />
            ))}
          </div>

          <h3 className="scp-h3">
            <BookOpen size={18} aria-hidden /> Práctica y títulos
          </h3>
          <div className="scp-linklist">
            {ACADEMIC_PRACTICA_TITULOS.map((l) => (
              <LinkRow key={l.title} {...l} />
            ))}
          </div>

          <h3 className="scp-h3">
            <Sparkles size={18} aria-hidden /> Unidades transversales — LIM
          </h3>
          <p className="scp-prose scp-prose-tight">
            Lenguaje, Inglés y Matemática (LIM): el PDF de coordinaciones reúne la información transversal para las
            tres áreas.
          </p>
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

          <p className="scp-footnote">
            Dudas de carrera, calendario o documentación: coordinación académica y DAE de tu sede.
          </p>
        </section>
      )}

      {tab === 'vcm' && (
        <section className="scp-block" aria-labelledby="sec-vcm">
          <h2 id="sec-vcm" className="scp-h2">
            Vinculación con el medio (VCM)
          </h2>
          <p className="scp-lead">Proyectos con la comunidad, prácticas y alianzas.</p>
          <p className="scp-prose">
            La VCM conecta tu formación con organizaciones y territorios. Revisa también las{' '}
            <button type="button" className="scp-inline-link" onClick={() => onTabChange('reglamentos')}>
              políticas de vinculación
            </button>{' '}
            en la sección de reglamentos.
          </p>
        </section>
      )}

      {tab === 'innovacion' && (
        <section className="scp-block" aria-labelledby="sec-in">
          <h2 id="sec-in" className="scp-h2">
            Innovación y emprendimiento
          </h2>
          <p className="scp-lead">Líneas de desarrollo de ideas y proyectos.</p>
          <p className="scp-prose">
            Participa en talleres y programas que impulsan el emprendimiento desde el aula. Documentación normativa en
            portal IP/CFT (
            <button type="button" className="scp-inline-link" onClick={() => onTabChange('reglamentos')}>
              ver políticas
            </button>
            ).
          </p>
        </section>
      )}

      {tab === 'comite' && (
        <section className="scp-block" aria-labelledby="sec-com">
          <h2 id="sec-com" className="scp-h2">
            Comité directivo — Sede Curicó
          </h2>
          <p className="scp-lead">Equipo que lidera la gestión en la sede.</p>
          <div className="scp-comite-grid">
            {COMITE_CURICO.map((p) => (
              <article key={p.nombre} className="scp-comite-card">
                <img src={p.foto} alt="" loading="lazy" />
                <div>
                  <strong>{p.nombre}</strong>
                  <span>{p.cargo}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'denuncias' && (
        <section className="scp-block" aria-labelledby="sec-de">
          <h2 id="sec-de" className="scp-h2">
            Canal de denuncias
          </h2>
          <p className="scp-lead">Plataforma confidencial para reportar situaciones.</p>
          <a className="scp-feature" href={LINKS.canalDenuncias} target="_blank" rel="noopener noreferrer">
            <div className="scp-feature-ic scp-feature-ic-warn">
              <Flag size={24} />
            </div>
            <div>
              <strong>Canal oficial Universidad Santo Tomás</strong>
              <span>Reporta con resguardo y confidencialidad.</span>
            </div>
            <ArrowUpRight size={20} />
          </a>
        </section>
      )}
    </div>
  )
}
