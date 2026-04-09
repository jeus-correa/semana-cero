/**
 * Sincroniza el viewport con variables CSS en <html> para que el layout sea estable
 * en celular (100vh vs barra de URL), tablet, escritorio y TV.
 *
 * Variables que quedan en :root:
 * - --st-vh / --st-vw : 1% del alto y ancho visibles (en px)
 * - --st-inner-w / --st-inner-h : innerWidth / innerHeight (px)
 * - data-bp : xs | sm | md | lg | xl | 2xl | tv (ancho aproximado)
 * - data-orientation : portrait | landscape
 *
 * Uso: llamar initViewportSync() una vez al arrancar la app (main.tsx).
 */

const docEl = () => document.documentElement

let raf = 0
let started = false

function readViewportSize(): { w: number; h: number } {
  const vv = window.visualViewport
  if (vv) {
    return { w: Math.round(vv.width), h: Math.round(vv.height) }
  }
  return { w: Math.round(window.innerWidth), h: Math.round(window.innerHeight) }
}

function applyViewportVars(): void {
  const { w, h } = readViewportSize()
  const el = docEl()
  const vh = h * 0.01
  const vw = w * 0.01

  el.style.setProperty('--st-vh', `${vh}px`)
  el.style.setProperty('--st-vw', `${vw}px`)
  el.style.setProperty('--st-inner-w', `${w}px`)
  el.style.setProperty('--st-inner-h', `${h}px`)

  el.dataset.orientation = w >= h ? 'landscape' : 'portrait'

  let bp: string
  if (w < 480) bp = 'xs'
  else if (w < 768) bp = 'sm'
  else if (w < 1024) bp = 'md'
  else if (w < 1280) bp = 'lg'
  else if (w < 1920) bp = 'xl'
  else if (w < 2560) bp = '2xl'
  else bp = 'tv'
  el.dataset.bp = bp
}

function scheduleApply(): void {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    applyViewportVars()
    raf = 0
  })
}

export function initViewportSync(): void {
  if (typeof window === 'undefined' || started) return
  started = true

  applyViewportVars()

  window.addEventListener('resize', scheduleApply, { passive: true })
  window.addEventListener('orientationchange', scheduleApply, { passive: true })

  const vv = window.visualViewport
  if (vv) {
    vv.addEventListener('resize', scheduleApply, { passive: true })
    vv.addEventListener('scroll', scheduleApply, { passive: true })
  }
}
