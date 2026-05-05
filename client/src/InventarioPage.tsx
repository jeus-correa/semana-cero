import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import JsBarcode from 'jsbarcode'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { jsPDF } from 'jspdf'
import { LogOut, Download, Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import { listenInventarioSession, logoutInventario } from './lib/inventoryAuth'
import {
  createInventoryUser,
  deleteInventoryUser,
  formatCallableError,
  listInventoryUsers,
  type InventoryManagedUser
} from './lib/inventoryUserAdmin'
import { uploadExcelViaAppsScript } from './lib/googleAppsScriptUpload'
import './inventario.css'

type GridRow = Record<string, string>
type RowItem = { id: string; data: GridRow }

const BASE_COLUMNS: string[] = []
const BARCODE_PREFIX = 'IPST202601'
const BARCODE_RENDER_OPTIONS = {
  format: 'CODE128' as const,
  lineColor: '#000000',
  background: '#ffffff',
  width: 2.8,
  height: 96,
  displayValue: true,
  margin: 10,
  fontSize: 18,
  textMargin: 4
}
/** Parámetros más gruesos/altos para que la pistola lea bien al imprimir el PDF. */
const BARCODE_PDF_RENDER_OPTIONS = {
  format: 'CODE128' as const,
  lineColor: '#000000',
  background: '#ffffff',
  width: 2.8,
  height: 96,
  displayValue: true,
  margin: 12,
  fontSize: 15,
  textMargin: 5,
  // Aumenta el “margen en blanco” alrededor para mejorar lectura en pistola.
  quieter: 10
}
const DRIVE_FOLDER_ID =
  (import.meta.env.VITE_DRIVE_EXCELL_FOLDER_ID as string | undefined)?.trim() || '1bVaHYYFJi8QBcGwsqqHcz8-3u_0PnMzt'
function normalizeRows(raw: unknown[]): GridRow[] {
  return raw.map((item) => {
    const row = item as Record<string, unknown>
    const clean: GridRow = {}
    Object.entries(row).forEach(([k, v]) => {
      clean[k] = String(v ?? '')
    })
    return clean
  })
}

function makeRow(columns: string[]): RowItem {
  return {
    id: crypto.randomUUID(),
    data: Object.fromEntries(columns.map((c) => [c, '']))
  }
}

function normalizeKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function InventarioPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const barcodeSvgRef = useRef<SVGSVGElement>(null)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null)
  const scannerControlsRef = useRef<{ stop: () => void } | null>(null)
  const hardwareScanBufferRef = useRef('')
  const hardwareScanTimerRef = useRef<number | null>(null)
  const hardwareScanLastKeyAtRef = useRef(0)
  /** Solo el campo de escaneo (pistola/cámara); no es el mismo que la base del lote PDF. */
  const scanCaptureInputRef = useRef<HTMLInputElement>(null)
  const [columns, setColumns] = useState<string[]>(BASE_COLUMNS)
  const [rows, setRows] = useState<RowItem[]>([])
  const [search, setSearch] = useState('')
  const [loadedFileName, setLoadedFileName] = useState('')
  const [uploadingDrive, setUploadingDrive] = useState(false)
  const [barcodeValue, setBarcodeValue] = useState(BARCODE_PREFIX)
  const [barcodeCount, setBarcodeCount] = useState(1)
  const [scanCapture, setScanCapture] = useState('')
  const [lastScan, setLastScan] = useState('')
  const [cameraReading, setCameraReading] = useState(false)
  const [scanError, setScanError] = useState('')
  const [entryModalOpen, setEntryModalOpen] = useState(false)
  const [entryForm, setEntryForm] = useState({
    departamento: '',
    codigoBarra: '',
    equipo: '',
    marca: '',
    modelo: '',
    serie: '',
    ubicacion: '',
    responsable: '',
    observacion: ''
  })
  const [sessionEmail, setSessionEmail] = useState('')
  const [sessionIsAdmin, setSessionIsAdmin] = useState(false)
  const [managedUsers, setManagedUsers] = useState<InventoryManagedUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [usersSuccess, setUsersSuccess] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [creatingUser, setCreatingUser] = useState(false)
  const [deletingUserUid, setDeletingUserUid] = useState('')
  const [adminPanelView, setAdminPanelView] = useState<'none' | 'create' | 'manage'>('create')

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => columns.some((c) => (row.data[c] ?? '').toLowerCase().includes(q)))
  }, [columns, rows, search])

  useEffect(() => {
    const svg = barcodeSvgRef.current
    const value = barcodeValue.trim()
    if (!svg || !value) return
    try {
      JsBarcode(svg, value, BARCODE_RENDER_OPTIONS)
    } catch {
      setScanError('No se pudo generar el código. Usa letras/números sin símbolos raros.')
    }
  }, [barcodeValue])

  useEffect(() => {
    return () => {
      scannerControlsRef.current?.stop()
      scannerControlsRef.current = null
      scannerRef.current = null
      setCameraReading(false)
      if (hardwareScanTimerRef.current) {
        window.clearTimeout(hardwareScanTimerRef.current)
        hardwareScanTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const un = listenInventarioSession((session) => {
      setSessionEmail(session.email)
      setSessionIsAdmin(session.isAdmin)
    })
    return () => un()
  }, [])

  const refreshManagedUsers = async () => {
    setUsersError('')
    setUsersLoading(true)
    try {
      const users = await listInventoryUsers()
      setManagedUsers(users)
    } catch (err) {
      setUsersError(formatCallableError(err))
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionIsAdmin || adminPanelView !== 'manage') {
      setManagedUsers([])
      return
    }
    void refreshManagedUsers()
  }, [sessionIsAdmin, adminPanelView])

  const onImport: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
    const importedRows = normalizeRows(json)
    const colSet = new Set<string>()
    importedRows.forEach((r) => Object.keys(r).forEach((k) => colSet.add(k)))
    const nextCols = Array.from(colSet)
    setColumns(nextCols)
    setRows(
      importedRows.map((r) => ({
        id: crypto.randomUUID(),
        data: Object.fromEntries(nextCols.map((c) => [c, r[c] ?? '']))
      }))
    )
    setLoadedFileName(file.name)
    setSearch('')
    e.target.value = ''
  }

  const buildWorkbook = () => {
    const exportRows = rows.map((r) => r.data)
    const fallbackRow =
      columns.length > 0 ? Object.fromEntries(columns.map((c) => [c, ''])) : { Hoja: 'Sin columnas definidas' }
    const ws = XLSX.utils.json_to_sheet(exportRows.length ? exportRows : [fallbackRow])
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(exportRows.length, 1), c: columns.length - 1 } }) }
    ws['!cols'] = columns.map((col) => {
      const maxData = Math.max(
        col.length,
        ...exportRows.map((row) => String(row[col] ?? '').length)
      )
      return { wch: Math.min(40, Math.max(12, maxData + 2)) }
    })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario')
    const fileName = `inventario-ust-${new Date().toISOString().slice(0, 10)}.xlsx`
    return { wb, fileName }
  }

  const onSendByEmail = async () => {
    const { wb, fileName } = buildWorkbook()
    const envTo = (import.meta.env.VITE_INVENTARIO_CONTACT_EMAIL as string | undefined)?.trim()
    const toEmail = envTo || window.prompt('Correo destino para redactar:')?.trim() || ''
    if (!toEmail) return
    XLSX.writeFile(wb, fileName)
    const subject = encodeURIComponent(`Inventario UST ${new Date().toISOString().slice(0, 10)}`)
    const body = encodeURIComponent(
      `Hola,\n\nAdjunto la planilla de inventario exportada desde la app.\n\nArchivo: ${fileName}\n\nSaludos.`
    )
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${subject}&body=${body}`
    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer')
    window.alert('Se descargó el Excel. Se abrió Gmail para redactar; ahora adjunta el archivo y envíalo.')
  }

  const onSaveToPc = () => {
    const { wb, fileName } = buildWorkbook()
    XLSX.writeFile(wb, fileName)
  }

  const onSaveToDrive = async () => {
    const { wb, fileName } = buildWorkbook()
    if (!DRIVE_FOLDER_ID) {
      window.alert('Falta VITE_DRIVE_EXCELL_FOLDER_ID en .env para definir la carpeta de Drive.')
      return
    }
    try {
      setUploadingDrive(true)
      const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' })
      const link = await uploadExcelViaAppsScript(base64, fileName, DRIVE_FOLDER_ID)
      if (link) {
        const open = window.confirm('Excel subido a Google Drive correctamente. ¿Quieres abrirlo ahora?')
        if (open) window.open(link, '_blank', 'noopener,noreferrer')
      } else {
        window.alert('Excel subido a Google Drive correctamente.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo subir a Google Drive'
      window.alert(`${msg}\n\nSi sigue fallando, vuelve a desplegar Apps Script y pega de nuevo la URL /exec en client/.env (VITE_GAS_WEBAPP_URL).`)
    } finally {
      setUploadingDrive(false)
    }
  }

  const buildBatchCodes = () => {
    const base = barcodeValue.trim()
    const qty = Math.max(1, Math.min(200, Number(barcodeCount) || 1))
    const match = base.match(/^(.*?)(\d+)$/)
    if (!match) {
      return Array.from({ length: qty }, (_, i) => `${base}${String(i + 1).padStart(4, '0')}`)
    }
    const prefix = match[1]
    const numberText = match[2]
    const start = Number(numberText)
    const width = numberText.length
    return Array.from({ length: qty }, (_, i) => `${prefix}${String(start + i).padStart(width, '0')}`)
  }

  const onDownloadBatchBarcodes = async () => {
    const codes = buildBatchCodes()
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 8
      const cols = 2
      const rowsPerPage = 5
      const cellW = (pageW - margin * 2) / cols
      const cellH = (pageH - margin * 2) / rowsPerPage
      const imageW = cellW - 5
      const imageH = 16

      for (let i = 0; i < codes.length; i++) {
        if (i > 0 && i % (cols * rowsPerPage) === 0) pdf.addPage()
        const idxOnPage = i % (cols * rowsPerPage)
        const col = idxOnPage % cols
        const row = Math.floor(idxOnPage / cols)
        const x = margin + col * cellW
        const y = margin + row * cellH
        const code = codes[i]
        const dataUrl = await barcodeToPngDataUrlForPdf(code)
        pdf.setDrawColor(210)
        pdf.rect(x + 1, y + 1, cellW - 2, cellH - 2)
        pdf.addImage(dataUrl, 'PNG', x + 3, y + 3, imageW, imageH, undefined, 'NONE')
        pdf.setFontSize(8)
        pdf.text(code, x + 3, y + imageH + 7)
      }

      pdf.save(`codigos-lote-${codes.length}.pdf`)
    } catch {
      window.alert('No se pudo generar el lote de códigos.')
    }
  }

  const applyScannedCode = (value: string) => {
    const normalized = value.trim()
    if (!normalized) return
    const parts = normalized.split('-')
    const maybeDept = parts.length >= 3 ? parts[2] : ''
    setScanCapture(normalized)
    setLastScan(normalized)
    setScanError('')
    setEntryForm((prev) => ({
      ...prev,
      codigoBarra: normalized,
      departamento: prev.departamento || maybeDept
    }))
  }

  const onScanCaptureKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter' && e.key !== 'Tab') return
    e.preventDefault()
    applyScannedCode(e.currentTarget.value)
  }

  useEffect(() => {
    const flushHardwareBuffer = () => {
      const scanned = hardwareScanBufferRef.current.trim()
      if (scanned.length >= 4) applyScannedCode(scanned)
      hardwareScanBufferRef.current = ''
      if (hardwareScanTimerRef.current) {
        window.clearTimeout(hardwareScanTimerRef.current)
        hardwareScanTimerRef.current = null
      }
    }

    const onGlobalScannerKeyDown = (e: KeyboardEvent) => {
      const ae = document.activeElement as HTMLElement | null
      // Si el foco ya está en el campo de escaneo, dejamos que el input normal maneje Enter/Tab.
      if (ae === scanCaptureInputRef.current) return

      // Si el usuario está escribiendo en otro campo (modal, etc.), 
      // pero las teclas vienen muy rápido (es un escáner), capturamos para el código de barra.
      const now = performance.now()
      const isFast = now - hardwareScanLastKeyAtRef.current < 50 // Teclas muy rápidas = escáner

      if (e.key === 'Enter' || e.key === 'Tab') {
        const scanned = hardwareScanBufferRef.current.trim()
        if (scanned.length >= 2) {
          e.preventDefault()
          e.stopPropagation()
          applyScannedCode(scanned)
          hardwareScanBufferRef.current = ''
          return
        }
      }

      if (e.key.length === 1) {
        const isInputFocused = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)
        
        if (!isInputFocused || isFast || hardwareScanBufferRef.current.length > 0) {
          if (now - hardwareScanLastKeyAtRef.current > 200) {
            hardwareScanBufferRef.current = ''
          }
          
          hardwareScanLastKeyAtRef.current = now
          hardwareScanBufferRef.current += e.key
          setScanCapture(hardwareScanBufferRef.current)
          
          if (hardwareScanTimerRef.current) window.clearTimeout(hardwareScanTimerRef.current)
          hardwareScanTimerRef.current = window.setTimeout(() => {
            flushHardwareBuffer()
          }, 150)

          if (isInputFocused && (isFast || hardwareScanBufferRef.current.length > 1)) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    }

    window.addEventListener('keydown', onGlobalScannerKeyDown)
    return () => window.removeEventListener('keydown', onGlobalScannerKeyDown)
  }, [])

  const stopCameraReader = () => {
    scannerControlsRef.current?.stop()
    scannerControlsRef.current = null
    scannerRef.current = null
    setCameraReading(false)
  }

  const startCameraReader = async () => {
    const videoEl = cameraVideoRef.current
    if (!videoEl) return
    try {
      setScanError('')
      setCameraReading(true)
      scannerControlsRef.current?.stop()
      scannerControlsRef.current = null
      const reader = new BrowserMultiFormatReader()
      scannerRef.current = reader
      const onDetect = (result: { getText: () => string } | undefined, err: unknown) => {
        if (result?.getText()) {
          applyScannedCode(result.getText())
          stopCameraReader()
          return
        }
        if (err && (err as Error).name !== 'NotFoundException') {
          setScanError('No se pudo leer la cámara en este dispositivo.')
        }
      }
      let controls
      try {
        controls = await reader.decodeFromVideoDevice(undefined, videoEl, onDetect)
      } catch {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const firstVideo = devices.find((d) => d.kind === 'videoinput')
        if (!firstVideo) throw new Error('No hay cámara disponible')
        controls = await reader.decodeFromVideoDevice(firstVideo.deviceId, videoEl, onDetect)
      }
      scannerControlsRef.current = controls
    } catch {
      stopCameraReader()
      setScanError('No se pudo iniciar la cámara. Revisa permisos del navegador.')
    }
  }

  const barcodeToPngDataUrlForPdf = (value: string) =>
    new Promise<string>((resolve, reject) => {
      try {
        const scale = 3
        const logicalWidth = 760
        const logicalHeight = 220
        const canvas = document.createElement('canvas')
        canvas.width = logicalWidth * scale
        canvas.height = logicalHeight * scale
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo crear canvas'))
          return
        }
        ctx.setTransform(scale, 0, 0, scale, 0, 0)
        ctx.imageSmoothingEnabled = false
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, logicalWidth, logicalHeight)
        JsBarcode(canvas, value, BARCODE_PDF_RENDER_OPTIONS)
        resolve(canvas.toDataURL('image/png'))
      } catch {
        reject(new Error(`Codigo invalido: ${value}`))
      }
    })

  const clearData = () => {
    setColumns(BASE_COLUMNS)
    setRows([])
    setSearch('')
    setLoadedFileName('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const addColumn = () => {
    const name = window.prompt('Nombre de la nueva columna:')
    if (!name?.trim()) return
    if (columns.includes(name)) return
    setColumns((prev) => [...prev, name])
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        data: { ...r.data, [name]: '' }
      }))
    )
  }

  const addRow = () => {
    if (columns.length === 0) {
      window.alert('Primero importa una planilla o crea al menos una columna.')
      return
    }
    setRows((prev) => [...prev, makeRow(columns)])
  }

  const resolveColumnName = (preferred: string, aliases: string[]) => {
    const all = [preferred, ...aliases].map(normalizeKey)
    const found = columns.find((c) => all.includes(normalizeKey(c)))
    return found ?? preferred
  }

  const onEntryFormChange = (field: keyof typeof entryForm, value: string) => {
    setEntryForm((prev) => ({ ...prev, [field]: value }))
  }

  const openEntryModal = () => {
    const code = scanCapture.trim()
    if (code) applyScannedCode(code)
    setEntryModalOpen(true)
  }

  const onAddRowFromModal = () => {
    if (!entryForm.codigoBarra.trim()) {
      window.alert('Primero escanea o escribe un código de barra.')
      return
    }
    const columnMap = {
      departamento: resolveColumnName('Departamento', ['Depto', 'Area']),
      codigoBarra: resolveColumnName('CodigoBarra', ['Codigo de barras', 'Codigo barra', 'Barcode', 'Codigo']),
      equipo: resolveColumnName('Equipo', ['Nombre equipo', 'Activo']),
      marca: resolveColumnName('Marca', []),
      modelo: resolveColumnName('Modelo', []),
      serie: resolveColumnName('Serie', ['Serial']),
      ubicacion: resolveColumnName('Ubicacion', ['Ubicacion fisica', 'Sala']),
      responsable: resolveColumnName('Responsable', ['Asignado a', 'Usuario']),
      observacion: resolveColumnName('Observacion', ['Observaciones', 'Detalle'])
    } as const

    const requiredColumns = Array.from(new Set(Object.values(columnMap)))
    const missingColumns = requiredColumns.filter((c) => !columns.includes(c))
    const nextColumns = [...columns, ...missingColumns]
    if (missingColumns.length > 0) {
      setColumns(nextColumns)
      setRows((prev) =>
        prev.map((r) => ({
          ...r,
          data: { ...r.data, ...Object.fromEntries(missingColumns.map((c) => [c, ''])) }
        }))
      )
    }

    const newData = Object.fromEntries(nextColumns.map((c) => [c, ''])) as GridRow
    newData[columnMap.departamento] = entryForm.departamento.trim()
    newData[columnMap.codigoBarra] = entryForm.codigoBarra.trim()
    newData[columnMap.equipo] = entryForm.equipo.trim()
    newData[columnMap.marca] = entryForm.marca.trim()
    newData[columnMap.modelo] = entryForm.modelo.trim()
    newData[columnMap.serie] = entryForm.serie.trim()
    newData[columnMap.ubicacion] = entryForm.ubicacion.trim()
    newData[columnMap.responsable] = entryForm.responsable.trim()
    newData[columnMap.observacion] = entryForm.observacion.trim()
    setRows((prev) => [...prev, { id: crypto.randomUUID(), data: newData }])
    setEntryForm((prev) => ({
      ...prev,
      codigoBarra: '',
      equipo: '',
      marca: '',
      modelo: '',
      serie: '',
      ubicacion: '',
      responsable: '',
      observacion: ''
    }))
    setEntryModalOpen(false)
  }

  const updateCell = (rowId: string, col: string, val: string) => {
    setRows((prev) => {
      return prev.map((item) => (item.id === rowId ? { ...item, data: { ...item.data, [col]: val } } : item))
    })
  }

  const onLogout = async () => {
    await logoutInventario()
    navigate('/inventario/login', { replace: true })
  }

  const onCreateUser: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setUsersError('')
    setUsersSuccess('')
    setCreatingUser(true)
    try {
      await createInventoryUser({
        email: newUserEmail.trim(),
        password: newUserPassword,
        displayName: newUserName.trim() || undefined
      })
      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserName('')
      setUsersSuccess(
        'Quedó guardado en Firestore. Crea la cuenta en Firebase Console → Authentication con el mismo correo (y la clave que quieras) para que pueda entrar al inventario.'
      )
      await refreshManagedUsers()
    } catch (err) {
      setUsersError(formatCallableError(err))
    } finally {
      setCreatingUser(false)
    }
  }

  const onDeleteUser = async (uid: string, email: string) => {
    const ok = window.confirm(`Se eliminará la cuenta ${email}. Deseas continuar?`)
    if (!ok) return
    setUsersError('')
    setUsersSuccess('')
    setDeletingUserUid(uid)
    try {
      await deleteInventoryUser({ uid })
      setUsersSuccess('Se borró de la lista en Firestore. Si tenía cuenta en Authentication, bórrala también en la consola si corresponde.')
      await refreshManagedUsers()
    } catch (err) {
      setUsersError(formatCallableError(err))
    } finally {
      setDeletingUserUid('')
    }
  }

  return (
    <div className="inv-page">
      <header className="inv-header">
        <div>
          <p className="inv-kicker">INSTITUTO PROFECIONAL SANTOTOMAS</p>
          <h1>Registro de equipos informáticos</h1>
          <p>
            {sessionIsAdmin
              ? 'Gestión del inventario: planilla Excel, códigos de barra, envío por correo y Drive.'
              : 'Acceso solo a la planilla: importar, editar celdas y bajar el Excel a tu PC.'}
          </p>
          {sessionEmail && <p className="inv-session-user">Sesión: {sessionEmail}</p>}
          {sessionIsAdmin && <p className="inv-session-user">Perfil administrador: sí</p>}
          {!sessionIsAdmin && sessionEmail && (
            <p className="inv-session-user inv-session-hint">
              Modo planilla: podés escanear códigos y rellenar datos; no hay lote PDF ni envío a correo/Drive.
            </p>
          )}
        </div>
        <button className="inv-logout" onClick={onLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </header>

      <main className="inv-main">
        {sessionIsAdmin && (
          <section className="inv-card">
            <h2>Administrador de usuarios</h2>
            <div className="inv-user-admin-actions">
              <button
                className={`inv-btn ${adminPanelView === 'create' ? '' : 'inv-btn-secondary'}`}
                type="button"
                onClick={() => {
                  setUsersError('')
                  setUsersSuccess('')
                  setAdminPanelView('create')
                }}
              >
                Agregar
              </button>
              <button
                className={`inv-btn ${adminPanelView === 'manage' ? '' : 'inv-btn-secondary'}`}
                type="button"
                onClick={() => {
                  setUsersError('')
                  setUsersSuccess('')
                  setAdminPanelView('manage')
                }}
              >
                Ver lista
              </button>
            </div>
            {usersError && <p className="inv-scan-error">{usersError}</p>}
            {usersSuccess && <p className="inv-success-hint">{usersSuccess}</p>}
            {adminPanelView === 'create' && (
              <form className="inv-user-form" onSubmit={onCreateUser}>
                <input
                  className="inv-search"
                  type="email"
                  placeholder="Correo nuevo usuario"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
                <input
                  className="inv-search"
                  type="password"
                  placeholder="Clave (no se guarda aquí; úsala al crear el usuario en la consola)"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <input
                  className="inv-search"
                  type="text"
                  placeholder="Nombre (opcional)"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
                <button className="inv-btn" type="submit" disabled={creatingUser}>
                  {creatingUser ? 'Guardando...' : 'Guardar'}
                </button>
              </form>
            )}
            {adminPanelView === 'manage' && (
              <>
                <button className="inv-btn inv-btn-secondary" type="button" disabled={usersLoading} onClick={() => void refreshManagedUsers()}>
                  {usersLoading ? 'Actualizando...' : 'Recargar lista'}
                </button>
                <div className="inv-users-list">
                  {usersLoading && managedUsers.length === 0 ? (
                    <p className="inv-empty-sheet">Cargando...</p>
                  ) : managedUsers.length === 0 ? (
                    <p className="inv-empty-sheet">Lista vacía.</p>
                  ) : (
                    managedUsers.map((user) => (
                      <article key={user.uid} className="inv-user-row">
                        <div>
                          <p className="inv-user-email">{user.email}</p>
                          {user.displayName ? <p className="inv-user-meta">Nombre: {user.displayName}</p> : null}
                        </div>
                        <button
                          className="inv-btn inv-btn-danger"
                          type="button"
                          disabled={deletingUserUid === user.uid || user.email.toLowerCase() === sessionEmail.toLowerCase()}
                          onClick={() => void onDeleteUser(user.uid, user.email)}
                        >
                          {deletingUserUid === user.uid ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </article>
                    ))
                  )}
                </div>
              </>
            )}
            {adminPanelView === 'none' && <p className="inv-empty-sheet">Selecciona una acción para comenzar.</p>}
          </section>
        )}

        <section className="inv-card">
          <h2>{sessionIsAdmin ? 'Acciones' : 'Planilla Excel'}</h2>
          {loadedFileName && <p className="inv-loaded-file">Archivo cargado: {loadedFileName}</p>}
          <div className="inv-actions">
            <label className="inv-btn">
              Importar planilla
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={onImport} />
            </label>
            {sessionIsAdmin && (
              <>
                <button type="button" className="inv-btn" onClick={() => void onSendByEmail()}>
                  Enviar por correo
                </button>
                <button type="button" className="inv-btn" onClick={() => void onSaveToDrive()} disabled={uploadingDrive}>
                  {uploadingDrive ? 'Subiendo a Drive...' : 'Guardar en Drive'}
                </button>
              </>
            )}
            <button type="button" className="inv-btn" onClick={onSaveToPc}>
              Guardar en PC
            </button>
            <button type="button" className="inv-btn inv-btn-secondary" onClick={addColumn}>
              Nueva columna
            </button>
            <button type="button" className="inv-btn inv-btn-secondary" onClick={addRow}>
              Nueva fila
            </button>
            <button type="button" className="inv-btn inv-btn-danger" onClick={clearData}>
              Limpiar Excel completo
            </button>
          </div>
        </section>

        <section className="inv-card">
          <h2>Códigos de barra</h2>

          {sessionIsAdmin && (
            <div className="inv-barcode-box inv-barcode-lote-block">
              <p className="inv-barcode-label">Generar lote PDF CODE128 (solo administrador)</p>
              <p className="inv-scan-result">
                Este bloque es independiente del escaneo: acá definís la base numérica para imprimir etiquetas (no se llena con la pistola abajo).
              </p>
              <input
                className="inv-search"
                type="text"
                value={barcodeValue}
                placeholder="Base para lote, ej: IPST2026010001"
                onChange={(e) => setBarcodeValue(e.target.value.replace(/\s+/g, ''))}
              />
              <div className="inv-batch-grid">
                <input
                  className="inv-search"
                  type="number"
                  min={1}
                  max={200}
                  value={barcodeCount}
                  onChange={(e) => setBarcodeCount(Number(e.target.value))}
                  placeholder="Cant."
                />
                <button className="inv-btn inv-btn-secondary" onClick={() => void onDownloadBatchBarcodes()}>
                  <Download size={18} /> Generar lote PDF
                </button>
              </div>

              <div className="inv-barcode-preview">
                {barcodeValue.trim() ? <svg ref={barcodeSvgRef} /> : <p>Vista previa de la base del lote.</p>}
              </div>
            </div>
          )}

          <div className="inv-barcode-box inv-barcode-scan-block">
            <p className="inv-barcode-label">Escanear código (pistola o cámara)</p>
            <p className="inv-scan-result">
              Campo aparte del lote PDF: escribí acá o usá pistola/cámara. No modifica la base de arriba.
            </p>
            <div className="inv-barcode-actions">
              <div className="inv-scanner-input-wrap">
                <Barcode className="inv-scanner-ic" size={20} />
                <input
                  ref={scanCaptureInputRef}
                  className="inv-search inv-scanner-bar"
                  type="text"
                  value={scanCapture}
                  placeholder="Código leído — pistola (Enter/Tab) o manual"
                  onChange={(e) => setScanCapture(e.target.value.replace(/\s+/g, ''))}
                  onKeyDown={onScanCaptureKeyDown}
                  autoComplete="off"
                  autoFocus
                />
                <div className="inv-scanner-status-pulse" />
              </div>

              <div className="inv-scanner-actions-row">
                <button
                  className="inv-btn inv-btn-secondary"
                  type="button"
                  onClick={() => {
                    if (cameraReading) stopCameraReader()
                    else void startCameraReader()
                  }}
                >
                  <Camera size={18} /> {cameraReading ? 'Detener cámara' : 'Escanear con cámara'}
                </button>
                <button className="inv-btn" type="button" onClick={openEntryModal}>
                  <FilePlus size={18} /> Rellenar datos
                </button>
              </div>
            </div>
            <video ref={cameraVideoRef} className={`inv-camera ${cameraReading ? 'is-on' : ''}`} muted playsInline />
            {lastScan && (
              <p className="inv-scan-result">
                <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Último código leído: <strong>{lastScan}</strong>
              </p>
            )}
            {scanError && (
              <p className="inv-scan-error">
                <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {scanError}
              </p>
            )}
          </div>
        </section>

        <section className="inv-card">
          <h2>Búsqueda</h2>
          <div className="inv-scanner-input-wrap">
            <Search className="inv-scanner-ic" size={18} />
            <input
              className="inv-search inv-scanner-bar"
              type="search"
              value={search}
              placeholder="Buscar en todas las columnas..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="inv-card">
          <div className="inv-meta">
            <span>Registros: {filteredRows.length}</span>
            <span>Columnas: {columns.length}</span>
            <Link to="/" className="inv-back-link">
              Ir a Semana Cero
            </Link>
          </div>
          {columns.length === 0 ? (
            <p className="inv-empty-sheet">No hay columnas activas. Importa un Excel para cargar su estructura.</p>
          ) : (
            <div className="inv-table-wrap">
              <table className="inv-sheet-table">
                <thead>
                  <tr>
                    <th className="inv-rownum-head">#</th>
                    {columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1}>
                        Planilla cargada sin filas o sin coincidencias en la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, rowIndex) => (
                      <tr key={row.id}>
                        <td className="inv-rownum-cell">{rowIndex + 1}</td>
                        {columns.map((col) => (
                          <td key={col}>
                            <input value={row.data[col] ?? ''} onChange={(e) => updateCell(row.id, col, e.target.value)} />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {entryModalOpen && (
        <div className="inv-modal-backdrop" role="presentation" onClick={() => setEntryModalOpen(false)}>
          <section className="inv-modal" role="dialog" aria-modal="true" aria-label="Agregar equipo" onClick={(e) => e.stopPropagation()}>
            <h3>Completar datos del equipo</h3>
            <div className="inv-entry-grid">
              <input className="inv-search" type="text" value={entryForm.departamento} placeholder="Departamento" onChange={(e) => onEntryFormChange('departamento', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.codigoBarra} placeholder="Código de barra" onChange={(e) => onEntryFormChange('codigoBarra', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.equipo} placeholder="Equipo" onChange={(e) => onEntryFormChange('equipo', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.marca} placeholder="Marca" onChange={(e) => onEntryFormChange('marca', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.modelo} placeholder="Modelo" onChange={(e) => onEntryFormChange('modelo', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.serie} placeholder="Serie" onChange={(e) => onEntryFormChange('serie', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.ubicacion} placeholder="Ubicación" onChange={(e) => onEntryFormChange('ubicacion', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.responsable} placeholder="Responsable" onChange={(e) => onEntryFormChange('responsable', e.target.value)} />
              <input className="inv-search" type="text" value={entryForm.observacion} placeholder="Observación" onChange={(e) => onEntryFormChange('observacion', e.target.value)} />
            </div>
            <div className="inv-modal-actions">
              <button className="inv-btn inv-btn-secondary" type="button" onClick={() => setEntryModalOpen(false)}>
                Cancelar
              </button>
              <button className="inv-btn" type="button" onClick={onAddRowFromModal}>
                Guardar en Excel
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default InventarioPage
