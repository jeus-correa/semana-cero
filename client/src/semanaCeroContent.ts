/** Contenido y enlaces extraídos de la Semana Cero institucional (referencia HTML Santo Tomás). */

export const LINKS = {
  aulasVirtuales: 'https://aulasvirtuales.santotomas.cl/login/index.php',
  ubicacion: 'https://maps.app.goo.gl/aaUXBinnbFPXaC378',
  libroTuPuedes: 'https://librotupuedes.cl/',
  bibliotecaVirtual:
    'http://descubridor.santotomas.cl:1701/primo_library/libweb/action/search.do?vid=CST&afterPDS=true',
  instagramCurico: 'https://www.instagram.com/santotomas_curico',
  cft: 'https://www.cftsantotomas.cl/',
  ip: 'https://www.ipsantotomas.cl/',
  sede360: 'https://storage.net-fs.com/hosting/6520281/118/',
  conoceTomasinGemini: 'https://gemini.google.com/gem/7d22f9f82e12/b72da718780f6c73?usp=sharing',
  personajeSelloImg: 'https://i.imgur.com/0RRUTf8.jpeg',
  segurosDae: 'https://www.daesantotomas.cl/apoyo-estudiantil/seguros-para-estudiantes/',
  recuperaClave: 'https://recuperatuclave.santotomas.cl/',
  actualizaClave: 'https://actualizatuclave.santotomas.cl/login',
  canalDenuncias: 'https://www.ust.cl/genero-e-inclusion/canal-de-denuncias',
  formacionDocenteDrive:
    'https://drive.google.com/drive/folders/1lSfa_dTOaIZMrs_u5fIFR5vvyNqmFrdn?usp=sharing',
  pdfCentroAprendizaje: 'https://drive.google.com/file/d/1aQECKNIjJwFH7Irjd0guVIMQ3jnYSrvL/view?usp=sharing',
  pdfBiblioteca: 'https://drive.google.com/file/d/1RbFh7y2l8-oOIIiNHdvWU0BUmtGArN6I/view?usp=sharing',
  pdfDae: 'https://drive.google.com/file/d/1vkwNpxBK4WIteDfFmQaGiIQ1eUZVQaSb/view?usp=sharing',
  pdfRegistro: 'https://drive.google.com/file/d/11QETpuKU-rtpPuVTtBNQubrXZK5ZB1vc/view?usp=sharing',
  pdfDao: 'https://drive.google.com/file/d/1sd_iANRlTyB7zqPuOj5RLeduUemJpYEO/view?usp=sharing',
  pdfSoporte: 'https://drive.google.com/file/d/1MVLkEoC7CXg6EspmUJW0wqBZgiK0V0b2/view?usp=sharing',
  pdfFormacion: 'https://drive.google.com/file/d/1Haw21v8bRlhtuZow8DB1qsNINZwqvYXJ/view?usp=sharing',
  pdfFormacionDocente: 'https://drive.google.com/file/d/1GAO-aa4Wp4fSEGtHAJU6FHDjliGYGJJ5/view?usp=sharing',
  pdfComoImprimir: 'https://drive.google.com/file/d/1aucpW3M-2wfvujAPWkT4hOKYsdlhbqdU/view?usp=sharing',
  /** PDF Semana Cero — Servicio Social (IP) */
  pdfServicioSocial: 'https://drive.google.com/file/d/1-UV85Ld4UqrpuGEa4_0hFr7VG6FVPyWm/view?usp=sharing',
  pdfIngAdministracionEmpresas:
    'https://drive.google.com/file/d/1Mf1a2dsq5gEYC_BLttP86hRC0Nk83Y5Y/view?usp=sharing',
  pdfIngAgricola: 'https://drive.google.com/file/d/1u0sWrIFpr25EwYLqGEUzXO6-dUVF2wyL/view?usp=sharing',
  /** Un solo PDF cubre práctica profesional y titulación (Semana Cero) */
  pdfPracticaTituloSemanaCero:
    'https://drive.google.com/file/d/1-nV2wbtuNTT87KKu76rX8n9KY_PGlr1h/view?usp=sharing',
  /** LIM: lenguaje, inglés y matemática (coordinaciones) */
  pdfLimTransversales: 'https://drive.google.com/file/d/1RQ0YdRn1n4PnAWZyUyNxJVIvLD06ScKk/view?usp=sharing',
  pdfPlataformasELearning: 'https://drive.google.com/file/d/1bzZnUaIbXyiyFPlM3B4dwNUuejxaZ_Lu/view?usp=sharing',
  ipPortalReglamentos:
    'https://www.ipsantotomas.cl/informacion-institucional/politicas-y-reglamentos/politicas-reglamentos-y-documentos/',
  cftPortalReglamentos:
    'https://www.cftsantotomas.cl/informacion-institucional/politicas-y-reglamentos/politicas-reglamentos-y-documentos/'
} as const

export type ApoyoPdfItem = {
  title: string
  subtitle: string
  href: string
  /** Enlaces extra (ej. Formación docente: infórmate + curso/materiales) */
  extras?: { label: string; href: string }[]
}

export const APOYO_PDFS: ApoyoPdfItem[] = [
  { title: 'Centro de Aprendizaje', subtitle: 'Apoyo académico y tutorías', href: LINKS.pdfCentroAprendizaje },
  { title: 'Biblioteca', subtitle: 'Recursos y servicios bibliotecarios', href: LINKS.pdfBiblioteca },
  { title: 'DAE', subtitle: 'Beneficios y vida estudiantil', href: LINKS.pdfDae },
  { title: 'Registro Curricular', subtitle: 'Procesos y documentos académicos', href: LINKS.pdfRegistro },
  { title: 'DAO', subtitle: 'Aranceles y convenios de pago', href: LINKS.pdfDao },
  { title: 'Soporte de Informática', subtitle: 'Plataformas y accesos', href: LINKS.pdfSoporte },
  { title: 'Formación', subtitle: 'Material de apoyo institucional', href: LINKS.pdfFormacion },
  { title: 'Cómo imprimir', subtitle: 'Guía rápida de impresión', href: LINKS.pdfComoImprimir }
]

/** Carreras IP — enlaces oficiales (referencia web institucional). */
export const ACADEMIC_IP_CARRERAS: { title: string; subtitle: string; href: string }[] = [
  {
    title: 'Servicio Social',
    subtitle: 'PDF de inducción — Técnico en Trabajo Social (IP)',
    href: LINKS.pdfServicioSocial
  },
  {
    title: 'Ingeniería y carreras afines',
    subtitle: 'Oferta académica institucional (busca tu sede y carrera)',
    href: 'https://www.ipsantotomas.cl/informacion-institucional/proyecto-educativo/oferta-academica/'
  },
  {
    title: 'Ingeniería en Administración de Empresas',
    subtitle: 'PDF de inducción Semana Cero',
    href: LINKS.pdfIngAdministracionEmpresas
  },
  {
    title: 'Ingeniería Agrícola',
    subtitle: 'PDF de inducción Semana Cero',
    href: LINKS.pdfIngAgricola
  }
]

export const ACADEMIC_PRACTICA_TITULOS: { title: string; subtitle: string; href: string }[] = [
  {
    title: 'Proceso de práctica profesional',
    subtitle: 'PDF Semana Cero — práctica y título (material institucional)',
    href: LINKS.pdfPracticaTituloSemanaCero
  },
  {
    title: 'Proceso de titulación',
    subtitle: 'Incluido en el mismo PDF de práctica y titulación',
    href: LINKS.pdfPracticaTituloSemanaCero
  }
]

/** Unidades transversales LIM — referencias y apoyo. */
export const ACADEMIC_LIM: {
  title: string
  body: string
  href: string
  linkLabel: string
}[] = [
  {
    title: 'Lenguaje',
    body:
      'Comprensión lectora, producción escrita y comunicación efectiva en el aula. Refuerza bases para todas las asignaturas.',
    href: LINKS.pdfLimTransversales,
    linkLabel: 'Abrir PDF LIM — coordinaciones (Semana Cero)'
  },
  {
    title: 'Inglés',
    body:
      'Desarrollo de habilidades comunicativas en inglés para tu malla y competencias laborales. Detalle en el material LIM.',
    href: LINKS.pdfLimTransversales,
    linkLabel: 'Abrir PDF LIM — coordinaciones (Semana Cero)'
  },
  {
    title: 'Matemática',
    body:
      'Apoyo en razonamiento matemático, modelación y resolución de problemas; alineado a asignaturas transversales y de carrera.',
    href: LINKS.pdfLimTransversales,
    linkLabel: 'Abrir PDF LIM — coordinaciones (Semana Cero)'
  }
]

/** CFT — oferta y áreas (sitio oficial). */
export const ACADEMIC_CFT_BLOCKS: { title: string; subtitle: string; href: string }[] = [
  {
    title: 'Áreas y carreras (CFT)',
    subtitle: 'Listado por área del Centro de Formación Técnica',
    href: 'https://www.cftsantotomas.cl/areas-y-carreras/'
  },
  {
    title: 'Oferta académica CFT',
    subtitle: 'Proyecto educativo y carreras técnicas',
    href: 'https://www.cftsantotomas.cl/informacion-institucional/proyecto-educativo/oferta-academica/'
  }
]

/** Áreas para filtrar la lista CFT en Área académica. */
export const CFT_CARRERA_AREAS = ['Salud y deporte', 'Educación', 'Gastronomía y agro'] as const
export type CftCarreraArea = (typeof CFT_CARRERA_AREAS)[number]

/** CFT Semana Cero — PDF por carrera (Sede / material institucional). */
export const ACADEMIC_CFT_CARRERAS_PDFS: { title: string; subtitle: string; href: string; area: CftCarreraArea }[] = [
  {
    title: 'Preparador físico',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/1SECb79MaX-Xjlmy4RgUruS0nw1GGBD-i/view?usp=sharing',
    area: 'Salud y deporte'
  },
  {
    title: 'Técnico en Podología Clínica',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/1y5S9peQcOfvYDxpWDvgDX1tueEilrQxu/view?usp=sharing',
    area: 'Salud y deporte'
  },
  {
    title: 'Técnico en Odontología, mención Higienista Dental',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/1m3bepcwrs6IFPA6GgS3Abyf5YUiXMB65/view?usp=sharing',
    area: 'Salud y deporte'
  },
  {
    title: 'Técnico en Enfermería',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/18NlC3zvpjvjw1-QWAoOHwuCh_Unlk1HP/view?usp=sharing',
    area: 'Salud y deporte'
  },
  {
    title: 'Gastronomía Internacional y Tradicional Chilena',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/1cywsZUmj-XcuA_AHiwB__RC7ocuM4vkG/view?usp=sharing',
    area: 'Gastronomía y agro'
  },
  {
    title: 'Técnico en Educación Especial',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/19gBrx__LVvRtrGdzqFwVjLHyxIOX1tPV/view?usp=sharing',
    area: 'Educación'
  },
  {
    title: 'Técnico en Educación Parvularia y 1.º y 2.º básico',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/19sYmOLki0DjfP5Zxa_QNgIfrUFDU0nrX/view?usp=sharing',
    area: 'Educación'
  },
  {
    title: 'Técnico Agrícola',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/file/d/1e0MyqewKhcO9iU0HE0zoGoBeg26j-NcM/view?usp=sharing',
    area: 'Gastronomía y agro'
  }
]

export type SemanaTabId =
  | 'mision'
  | 'valores'
  | 'reglamentos'
  | 'seguros'
  | 'evacuacion'
  | 'correo'
  | 'apoyo'
  | 'academica'
  | 'vcm'
  | 'innovacion'
  | 'comite'
  | 'denuncias'

export const SEMANA_TABS: { id: SemanaTabId; label: string; num: string }[] = [
  { id: 'mision', label: 'Misión y visión', num: '01' },
  { id: 'valores', label: 'Valores institucionales', num: '02' },
  { id: 'reglamentos', label: 'Políticas y reglamentos', num: '03' },
  { id: 'seguros', label: 'Seguros', num: '04' },
  { id: 'evacuacion', label: 'Vías de evacuación', num: '05' },
  { id: 'correo', label: 'Activación correo', num: '06' },
  { id: 'apoyo', label: 'Unidades de apoyo', num: '07' },
  { id: 'academica', label: 'Área académica', num: '08' },
  { id: 'vcm', label: 'VCM', num: '09' },
  { id: 'innovacion', label: 'Innovación', num: '10' },
  { id: 'comite', label: 'Comité directivo', num: '11' },
  { id: 'denuncias', label: 'Canal de denuncias', num: '12' }
]

export const MISSION_VISION = {
  mision:
    'Contribuir al desarrollo sostenible del país, transmitiendo conocimiento mediante la formación de personas a lo largo de la vida, inspirada en valores cristianos, la vinculación con el medio y la innovación.',
  vision:
    'Ser un Instituto Profesional reconocido por su compromiso con la transformación de sus estudiantes y el desarrollo sostenible de las comunidades con que se vincula, y una gestión de excelencia.'
}

export const VALORES = [
  { title: 'Amor a la Verdad' },
  { title: 'Excelencia y Esfuerzo' },
  { title: 'Fraternidad y Solidaridad', badge: 'Valor 2026' },
  { title: 'Respeto e Inclusión' }
]

export const EVACUATION_VIDEOS: { label: string; href: string }[] = [
  { label: '3.er piso zona este', href: 'https://www.youtube.com/watch?v=vQye3IozH90' },
  { label: '3.er piso zona oeste', href: 'https://www.youtube.com/watch?v=Zh11T7Zuv5c' },
  { label: '4.to piso zona este', href: 'https://www.youtube.com/watch?v=Nx8CpMWfAYU' },
  { label: '4.to piso zona oeste', href: 'https://www.youtube.com/watch?v=4iPA0cxWQ94' },
  { label: 'Vía de emergencia calle Merced', href: 'https://www.youtube.com/watch?v=rEWRHxTMcTM' },
  { label: 'Vía de emergencia calle Peña', href: 'https://www.youtube.com/watch?v=xRWd5OKxQIs' },
  { label: 'Vías y salidas de emergencia', href: 'https://www.youtube.com/watch?v=UvHmr4BZImY' }
]

export const COMITE_CURICO: { nombre: string; cargo: string; foto: string }[] = [
  { nombre: 'Manuel Olmos Muñoz', cargo: 'Rector Sedes Rancagua y Curicó', foto: 'https://i.imgur.com/Mo5iMbo.png' },
  { nombre: 'Nancy Rodas Flores', cargo: 'Directora Académica Sede Curicó', foto: 'https://i.imgur.com/G7IQvsn.jpeg' },
  {
    nombre: 'Roberto Zúñiga Bravo',
    cargo: 'Director de Administración y Operaciones Sede Curicó',
    foto: 'https://i.imgur.com/3yIv6Py.jpeg'
  },
  {
    nombre: 'Adrián Castillo Parraguez',
    cargo: 'Director de Asuntos Estudiantiles Sede Curicó',
    foto: 'https://i.imgur.com/PvzBuAJ.jpeg'
  },
  {
    nombre: 'Margarita Rojas Abarca',
    cargo: 'Directora de Comunicaciones y Extensión Sede Curicó',
    foto: 'https://i.imgur.com/9KVB0bH.jpeg'
  },
  {
    nombre: 'Cindy Hernández Orellana',
    cargo: 'Directora de Admisión Sede Curicó',
    foto: 'https://i.imgur.com/Pv7xBQV.jpeg'
  },
  {
    nombre: 'Lorena Hernández González',
    cargo: 'Directora de Formación e Identidad Sede Curicó',
    foto: 'https://i.imgur.com/QKnOV1k.jpeg'
  },
  {
    nombre: 'María Elena Vergara Arriagada',
    cargo: 'Directora de Capacitación y Educación Continua Sede Curicó',
    foto: 'https://i.imgur.com/Cl4tdNv.jpeg'
  }
]

/** Enlaces principales IP — portal y documentos (mismo origen que la web de referencia). */
export const IP_LINKS: { title: string; subtitle?: string; href: string }[] = [
  {
    title: 'Políticas, reglamentos y documentos (portal IP)',
    subtitle: 'Normativa completa en el sitio oficial',
    href: LINKS.ipPortalReglamentos
  },
  {
    title: 'Política de solución de conflictos de intereses',
    subtitle: 'Dec. N° 010/19',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2020/03/Decreto-10-de-2019.-PSCI-IPST.pdf'
  },
  {
    title: 'Política integral CEDI — convivencia e inclusión',
    subtitle: 'Documento oficial',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2026/01/ST-13_25-Or-Politicas-CEDI-UST_Diciembre-2025.pdf'
  },
  {
    title: 'Política de innovación y emprendimiento',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2024/11/Politica-de-Innovacion-y-Emprendimiento-IPCFT-09-24.pdf'
  },
  {
    title: 'Política vinculación con el medio',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2024/07/politicas.ipst-vcm.pdf'
  },
  {
    title: 'Política de sostenibilidad',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2025/05/12.05.25_ST_Poli%CC%81ticas-Sostenibilidad-IP.pdf'
  },
  {
    title: 'Política de aseguramiento interno de la calidad',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2025/10/Politica-Aseguramiento-Calidad-IPST-2025.pdf'
  },
  {
    title: 'Reglamento académico',
    subtitle: 'Dec. N° 014/16',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2016/04/Decreto-014-2016-VRA-IP.pdf'
  },
  {
    title: 'Reglamento académico online',
    subtitle: 'Dec. N° 012/23',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2023/05/Reglamento-Academico-Online-IPST-2023.pdf'
  },
  {
    title: 'Reglamento interno de orden, higiene y seguridad',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2025/03/Reglamento-Interno-de-Orden-Higiene-y-Seguridad-IPST.pdf'
  },
  {
    title: 'Reglamento de disciplina — comunidad educativa',
    subtitle: 'Dec. N° 058/24',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2024/11/Reglamento-de-Disciplina-Comunidad-Educativa-IPST-2024.pdf'
  },
  {
    title: 'Decreto misión, visión y valores institucionales',
    subtitle: 'Dec. N° 066/23',
    href: 'https://www.ipsantotomas.cl/web/wp-content/uploads/sites/27/2024/01/Decreto-Mision-Vision-y-Valores-Institucionales-del-Instituto-Profesional-Santo-Tomas-2023.pdf'
  },
  {
    title: 'Estatutos',
    href: 'https://www.ipsantotomas.cl/informacion-institucional/politicas-y-reglamentos/estatutos/'
  },
  {
    title: 'Código de ética',
    href: 'https://www.ipsantotomas.cl/informacion-institucional/politicas-y-reglamentos/codigo-de-etica/'
  },
  {
    title: 'Calendario académico',
    href: 'https://www.ipsantotomas.cl/informacion-institucional/politicas-y-reglamentos/calendario/'
  },
  {
    title: 'Sistema de admisión',
    href: 'https://www.ipsantotomas.cl/informacion-institucional/politicas-y-reglamentos/sistema-de-admision/'
  }
]

export const CFT_LINKS: { title: string; subtitle?: string; href: string }[] = [
  {
    title: 'Políticas, reglamentos y documentos (portal CFT)',
    subtitle: 'Normativa completa en el sitio oficial',
    href: LINKS.cftPortalReglamentos
  },
  {
    title: 'Política de solución de conflictos de intereses',
    subtitle: 'Dec. N° 010/19',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2020/03/Decreto-15-de-2019.-PSCI-CFT.pdf'
  },
  {
    title: 'Política de innovación y emprendimiento',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2024/09/Politica-de-Innovacion-y-Emprendimiento-IPCFT-09-24.pdf'
  },
  {
    title: 'Reglamento general CFT',
    subtitle: 'Dec. N° 025/24',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2024/06/Reglamento-General-del-Centro-de-Formacion-Tecnica-Santo-Tomas-1.pdf'
  },
  {
    title: 'Reglamento académico',
    subtitle: 'Dec. N° 014/16',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2016/04/Reglamento-Academico-de-alumnos-CFTST-17102016.pdf'
  },
  {
    title: 'Reglamento académico online',
    subtitle: 'Dec. N° 053/23',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2023/05/Reglamento-Academico-Online-CFT-2023.pdf'
  },
  {
    title: 'Decreto misión, visión y valores institucionales',
    subtitle: 'Dec. N° 055/23',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2024/01/Decreto-Mision-Vision-y-Valores-Institucionales-del-Centro-de-Formacion-Tecnica-Santo-Tomas-2023.pdf'
  },
  {
    title: 'Estatutos',
    href: 'https://www.cftsantotomas.cl/informacion-institucional/politicas-y-reglamentos/estatutos/'
  },
  {
    title: 'Código de ética',
    href: 'https://www.cftsantotomas.cl/informacion-institucional/politicas-y-reglamentos/codigo-de-etica/'
  },
  {
    title: 'Calendario académico',
    href: 'https://www.cftsantotomas.cl/informacion-institucional/politicas-y-reglamentos/calendario-academico/'
  },
  {
    title: 'Sistema de admisión',
    href: 'https://www.cftsantotomas.cl/informacion-institucional/politicas-y-reglamentos/sistema-de-admision/'
  }
]
