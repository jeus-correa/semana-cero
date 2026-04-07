const fs = require('fs');

let content = fs.readFileSync('client/src/SemanaCeroSections.tsx', 'utf8');

// Add useEffect import
content = content.replace("import { useState } from 'react'", "import { useState, useEffect } from 'react'");
content = content.replace("  GraduationCap,", "  GraduationCap,\\n  Library,");

const header_new = `export function SemanaCeroFullSections() {
  const [cftPanelOpen, setCftPanelOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<{ nombre: string; cargo: string; foto: string } | null>(null)
  const [activeTab, setActiveTab] = useState<string>('mision')

  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail)
    }
    window.addEventListener('changeSemanaTab', handleTabChange)
    return () => window.removeEventListener('changeSemanaTab', handleTabChange)
  }, [])

  const TABS = [
    { id: 'mision', label: 'Misión y Visión', icon: Target },
    { id: 'valores', label: 'Valores', icon: Heart },
    { id: 'reglamentos', label: 'Políticas', icon: BookOpen },
    { id: 'seguros', label: 'Seguros', icon: Shield },
    { id: 'evacuacion', label: 'Evacuación', icon: Video },
    { id: 'correo', label: 'Correo', icon: Mail },
    { id: 'apoyo', label: 'Apoyo', icon: GraduationCap },
    { id: 'academica', label: 'Académica', icon: Library },
    { id: 'vcm', label: 'Vinculación', icon: Globe },
    { id: 'innovacion', label: 'Innovación', icon: Sparkles },
    { id: 'comite', label: 'Comité', icon: User },
    { id: 'denuncias', label: 'Canal', icon: Flag }
  ]

  return (
    <div className="scp-panel">
      <div className="scp-tabs-container">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={\`scp-tab-btn \${activeTab === t.id ? 'active' : ''}\`}
              onClick={() => setActiveTab(t.id)}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      <div className="scp-tab-content">
`;

content = content.replace(/export function SemanaCeroFullSections\(\) \{[\\s\\S]*?return \(\\s*<div className="scp-panel scp-full-scroll">/, header_new);

const wrap = (id) => `{activeTab === '${id}' && (\\n      <motion.section$1id="semana-${id}"$2</motion.section>\\n      )}`;

content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-mision"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'mision' && (\n      <motion.section${p1}id="semana-mision"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-valores"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'valores' && (\n      <motion.section${p1}id="semana-valores"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-reglamentos"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'reglamentos' && (\n      <motion.section${p1}id="semana-reglamentos"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-seguros"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'seguros' && (\n      <motion.section${p1}id="semana-seguros"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-evacuacion"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'evacuacion' && (\n      <motion.section${p1}id="semana-evacuacion"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-correo"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'correo' && (\n      <motion.section${p1}id="semana-correo"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-apoyo"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'apoyo' && (\n      <motion.section${p1}id="semana-apoyo"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-academica"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'academica' && (\n      <motion.section${p1}id="semana-academica"${p2}</motion.section>\n      )}`);

const VCM_NEW = `{activeTab === 'vcm' && (
      <motion.section className="scp-block" id="semana-vcm" aria-labelledby="sec-vcm" {...secMotion}>
        <h2 id="sec-vcm" className="scp-h2">Vinculación con el medio (VCM)</h2>
        <p className="scp-lead">Proyectos con la comunidad, prácticas y alianzas.</p>
        <div className="scp-cards" style={{ marginTop: '1.5rem' }}>
          <div className="scp-scard scp-scard-highlight" style={{ cursor: 'default' }}>
             <Globe size={28} style={{ color: '#00c48c' }} />
             <div>
               <strong>Prácticas y Comunidad</strong>
               <span>Conectamos el talento de nuestros estudiantes con las urgencias del entorno, entregando valor real.</span>
             </div>
          </div>
          <div className="scp-scard scp-scard-highlight" style={{ cursor: 'default' }}>
             <Target size={28} style={{ color: '#ea580c' }} />
             <div>
               <strong>Proyectos e Iniciativas</strong>
               <span>Programas integradores que fortalecen comunidades y enriquecen la formación profesional.</span>
             </div>
          </div>
        </div>
        <p className="scp-prose" style={{ marginTop: '1.5rem' }}>
          La VCM conecta tu formación con organizaciones y territorios. Revisa también las{' '}
          <button type="button" className="scp-inline-link" onClick={() => setActiveTab('reglamentos')}>
            políticas de vinculación
          </button>{' '}
          en la sección de reglamentos.
        </p>
      </motion.section>
      )}`;
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-vcm"([\\s\\S]*?)<\\/motion\\.section>/, VCM_NEW);

const INNOV_NEW = `{activeTab === 'innovacion' && (
      <motion.section className="scp-block" id="semana-innovacion" aria-labelledby="sec-in" {...secMotion}>
        <h2 id="sec-in" className="scp-h2">Innovación y emprendimiento</h2>
        <p className="scp-lead">Líneas de desarrollo de ideas y proyectos.</p>
        <div className="scp-mv-grid" style={{ marginTop: '1.5rem' }}>
          <article className="scp-card-mv">
            <div className="scp-card-mv-ic" style={{ color: '#0284c7' }}>
              <Sparkles size={22} />
            </div>
            <h3>Talleres Activos</h3>
            <p>Fomentamos el pensamiento crítico para que nuestras ideas transformen nuestro futuro profesional.</p>
          </article>
          <article className="scp-card-mv">
            <div className="scp-card-mv-ic" style={{ color: '#ea580c' }}>
              <BookOpen size={22} />
            </div>
            <h3>Línea Emprendedora</h3>
            <p>Construye tu propio futuro a partir de proyectos tangibles diseñados directamente desde el aula.</p>
          </article>
        </div>
        <p className="scp-prose" style={{ marginTop: '1.5rem' }}>
          Participa en talleres y programas que impulsan el emprendimiento desde el aula. Documentación normativa en portal IP/CFT (
          <button type="button" className="scp-inline-link" onClick={() => setActiveTab('reglamentos')}>
            ver políticas
          </button>
          ).
        </p>
      </motion.section>
      )}`;
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-innovacion"([\\s\\S]*?)<\\/motion\\.section>/, INNOV_NEW);

content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-comite"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'comite' && (\n      <motion.section${p1}id="semana-comite"${p2}</motion.section>\n      )}`);
content = content.replace(/<motion\\.section([\\s\\S]*?)id="semana-denuncias"([\\s\\S]*?)<\\/motion\\.section>/, (full, p1, p2) => `{activeTab === 'denuncias' && (\n      <motion.section${p1}id="semana-denuncias"${p2}</motion.section>\n      )}`);

content = content.replace('{/* Modal para miembro del comité */}', '</div>\\n      {/* Modal para miembro del comité */}');

fs.writeFileSync('client/src/SemanaCeroSections.tsx', content);
console.log("patched!");
