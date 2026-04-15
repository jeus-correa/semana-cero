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
  pdfCentroAprendizaje: 'https://drive.google.com/drive/folders/1xGz_EeAqA7uQO_EWr88D2K3CCjTh_npc?usp=drive_link',
  pdfBiblioteca: 'https://drive.google.com/drive/folders/1brjHSFt5JXCeHC3eHDDzbYHli4csdF5e?usp=drive_link',
  pdfDae: 'https://drive.google.com/drive/folders/1I1Wa58o-2GX4zQNUbGPFiYcnGoxwD4gV?usp=drive_link',
  pdfRegistro: 'https://drive.google.com/drive/folders/1amjkSBTKf1hh-cDzcmvekL-fqye-Tzcx?usp=drive_link',
  pdfDao: 'https://drive.google.com/drive/folders/17HAUU78r85YvOOz3b7dVObLW590DREZJ?usp=drive_link',
  pdfSoporte: 'https://drive.google.com/drive/folders/1QmaZT2EZQzyyrJSNzrk8d4D_5g-nZI7N?usp=drive_link',
  pdfFormacion: 'https://drive.google.com/drive/folders/1fnMPtt33Yy0BUOBHtJCjrqn3OnhEFwUA?usp=drive_link',
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
  pdfLimTransversales: 'https://drive.google.com/drive/folders/1BiQaDAP2QBA_ipox-EKENtFYHyx10N8P?usp=drive_link',
  pdfPlataformasELearning: 'https://drive.google.com/file/d/1bzZnUaIbXyiyFPlM3B4dwNUuejxaZ_Lu/view?usp=sharing',
  ipPortalReglamentos:
    'https://www.ipsantotomas.cl/informacion-institucional/politicas-y-reglamentos/politicas-reglamentos-y-documentos/',
  cftPortalReglamentos:
    'https://www.cftsantotomas.cl/informacion-institucional/politicas-y-reglamentos/politicas-reglamentos-y-documentos/',
  pdfInnovacionEmprendimiento: 'https://drive.google.com/file/d/1SO7ENKJf8ffUX70NiH59NS0zWRUzySHg/view',
  pdfVinculacionConElMedio: 'https://drive.google.com/file/d/1jcBVJ2hVz3A0uhUpIHqWrhG-Hr2DO7HI/view',
  /** Planos simbología emergencia — Sede Curicó */
  pdfEvacPlanta3Emergencia: 'https://drive.google.com/file/d/11gInreHeFsxtcb5UyjG3o2wI7k5WZfAq/view',
  pdfEvacPlanta4Emergencia: 'https://drive.google.com/file/d/148OnzJSSBaqWAo4x5SDTf2xiRtkSUFrI/view'
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
  { title: 'Cómo imprimir', subtitle: 'Guía rápida de impresión', href: LINKS.pdfComoImprimir },
  { title: 'E-learning', subtitle: 'Aulas virtuales y soporte de plataforma', href: 'https://drive.google.com/drive/folders/1ZQtpnBym6be-lOKQ2quo2cB_-vVUQapX?usp=sharing' }
]

/** Sede Curicó: correo + carpeta Google Drive por unidad (clave = título como en APOYO_PDFS / APOYO_AREAS). */
export const APOYO_CURICO_CONTACT: Partial<Record<string, { email: string; driveFolderUrl: string }>> = {
  Biblioteca: {
    email: 'st.curico.biblioteca@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1gaZ6skUKjgvMlpXqSf-6EBGhP7_F_Tby?usp=drive_link'
  },
  DAE: {
    email: 'st.curico.dae@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1ECklHIHIBnIS3itbKOoAPMPjGikH81So?usp=drive_link'
  },
  Admisión: {
    email: 'st.curico.admision@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1n6LAlfUK7OTd9ZKSPWkqeP_qXM3f9q7y?usp=drive_link'
  },
  'Educación Continua': {
    email: 'st.curico.educacion.continua@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1QWf6cIPSBtOMN6DWJ4B1f2srTUA8VPXP?usp=drive_link'
  },
  Rectoría: {
    email: 'st.curico.rectoria@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1xMUxjvMFh8_sr7djwTygF0sxQfq7xNbt?usp=drive_link'
  },
  'Soporte de Informática': {
    email: 'st.curico.informatica@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1svTBEulj_SdTq1zxDYo2Lqlv6oeRppIj?usp=drive_link'
  },
  DAO: {
    email: 'st.curico.dao@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1xCDohH5EkTit7zIENUbVKvBcw3CIwzVK?usp=drive_link'
  },
  'Registro Curricular': {
    email: 'st.curico.curricular@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1D9EpqxMffEYsUcZQRqTuC9x1Cjd6gooX?usp=drive_link'
  },
  'Centro de Aprendizaje': {
    email: 'st.curico.centro.aprendizaje@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1IDCaNb500ZT2ZNwjv1GUzZwkr3p-L6kX?usp=drive_link'
  },
  Innovación: {
    email: 'st.curico.innovacion@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1jZnE7yMpLsJEUu1IPqXPbX48ujkQuuZ3?usp=drive_link'
  },
  'Prevención de Riesgo': {
    email: 'st.curico.prevencion.riesgos@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1wPPJyCvFZOZwMK8gkSk7lc25XDmBMJV5?usp=drive_link'
  },
  Formación: {
    email: 'st.curico.formacion@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1VRN6aGYVgxRbjESbzBjg3z2ZEoYZRoB4?usp=drive_link'
  },
  LIM: {
    email: 'st.curico.lim@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1sST5f6AW1rrT1R6uyIib-b8zlJM9Uj8j?usp=drive_link'
  },
  Vinculación: {
    email: 'st.curico.vinculacion@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1uCcB8eIR9e1BRYxtCj7vqXL0Ga2-d3Oi?usp=drive_link'
  },
  'E-learning': {
    email: 'st.curico.elearning@gmail.com',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1r0ZOlr3PXLwDsHXi3mgxqvngz56ymkjL?usp=sharing'
  }
}

/** Carreras IP — ficha virtual (ojo) + carpeta información (click principal). */
export const ACADEMIC_IP_CARRERAS: { title: string; subtitle: string; href: string; infoHref?: string }[] = [
  {
    title: 'Servicio Social',
    subtitle: 'PDF de inducción — Técnico en Trabajo Social (IP)',
    href: 'https://drive.google.com/drive/folders/1QBhEtXo9npWEc5mCxJzWaBwELVkzLTqf?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/18ktksL3SMOfmx9MbYqYrUV0wycSZjYcw?usp=drive_link'
  },
  {
    title: 'Ingeniería en Administración de Empresas',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1t_Q7vbSKYKJ46dLssgjMAgXU3NCrSo7h?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1ns5V3NAA0X1EHbylcrwGaX9CsG2bWgRq?usp=drive_link'
  },
  {
    title: 'Ingeniería Agrícola',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1QemvBKaPnTwM_EoSkABoFeMACrvSlCyD?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1L7v3N_s99dvGGEWbwS3Oji9mebPDgqzp?usp=drive_link'
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

/** CFT Semana Cero — carrera con ficha virtual + carpeta informativa. */
export const ACADEMIC_CFT_CARRERAS_PDFS: {
  title: string
  subtitle: string
  href: string
  infoHref?: string
  area: CftCarreraArea
}[] = [
  {
    title: 'Preparador físico',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1S5d603_V-aYcgDhxb4-kkS18nnCHUgZc?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1_WjWq9jACk_dfGeajdnaxiiIyoG1pt99?usp=drive_link',
    area: 'Salud y deporte'
  },
  {
    title: 'Técnico en Podología Clínica',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1BOPVlGHS_el8MKePQP37ML9PIr3rYMWX?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1GOUDjh9D4VwafkMwHgLPag6DIx7O4FB_?usp=drive_link',
    area: 'Salud y deporte'
  },
  {
    title: 'Técnico en Odontología, mención Higienista Dental',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1utt9zKjvox5aQjBXKb8A01hw_A-0U71g?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1FAh63KA3ovzslU-KBUKF5FE5w7dDX-Fs?usp=sharing',
    area: 'Salud y deporte'
  },
  {
    title: 'Técnico en Enfermería',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1xsy63T-EkQYc6qkrbpiXGnxjvoyFHD-0?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/15eDtwnW7lNZFNOrDLQ09hQqJ7IF6VKZ_?usp=drive_link',
    area: 'Salud y deporte'
  },
  {
    title: 'Gastronomía Internacional y Tradicional Chilena',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1qVMjYFSBCHx_zYOvOmHZQqmoYHZqEb8z?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1DGFL55h6SAY-R40rn9EForiex_f3rr9b?usp=drive_link',
    area: 'Gastronomía y agro'
  },
  {
    title: 'Técnico en Educación Especial',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1VExRfJqfoecJla6KHN0pmdUmQ1AHBTqR?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1rZ6jSm-7HZw3UMwgDBwjeYI9sP4RjWd1?usp=drive_link',
    area: 'Educación'
  },
  {
    title: 'Técnico en Educación Parvularia y 1.º y 2.º básico',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1zx7coZi0KyxiKIyZ8DRVZvyLuMg9IU6T?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/1VFv27Zaiku5-gZS-HV1ET5dz0-O5JF_Y?usp=drive_link',
    area: 'Educación'
  },
  {
    title: 'Técnico Agrícola',
    subtitle: 'PDF de inducción Semana Cero',
    href: 'https://drive.google.com/drive/folders/1tKR2d7ZUJLxK1IrUGSRy6eQBZbIHy-9V?usp=drive_link',
    infoHref: 'https://drive.google.com/drive/folders/13djnaMP1_SVVsWdo8Dhpll8AzWO9kuo8?usp=drive_link',
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
  }
]

/** IP — documentos institucionales en sección separada. */
export const IP_DOCUMENTOS_INSTITUCIONALES: { title: string; subtitle?: string; href: string }[] = [
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
    title: 'Política integral CEDI — convivencia e inclusión',
    href: LINKS.cftPortalReglamentos
  },
  {
    title: 'Política de innovación y emprendimiento',
    href: 'https://www.cftsantotomas.cl/web/wp-content/uploads/sites/7/2024/09/Politica-de-Innovacion-y-Emprendimiento-IPCFT-09-24.pdf'
  },
  {
    title: 'Política vinculación con el medio',
    href: LINKS.cftPortalReglamentos
  },
  {
    title: 'Política de sostenibilidad',
    href: LINKS.cftPortalReglamentos
  },
  {
    title: 'Política de aseguramiento interno de la calidad',
    href: LINKS.cftPortalReglamentos
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
    title: 'Reglamento interno de orden, higiene y seguridad',
    href: LINKS.cftPortalReglamentos
  },
  {
    title: 'Reglamento de disciplina — comunidad educativa',
    href: LINKS.cftPortalReglamentos
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
