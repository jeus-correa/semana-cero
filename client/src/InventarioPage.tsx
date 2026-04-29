import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { LogOut } from 'lucide-react'
import { logoutInventario } from './lib/inventoryAuth'
import './inventario.css'

type GridRow = Record<string, string>
type RowItem = { id: string; data: GridRow }

const BASE_COLUMNS: string[] = []
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

function InventarioPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [columns, setColumns] = useState<string[]>(BASE_COLUMNS)
  const [rows, setRows] = useState<RowItem[]>([])
  const [search, setSearch] = useState('')
  const [loadedFileName, setLoadedFileName] = useState('')

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => columns.some((c) => (row.data[c] ?? '').toLowerCase().includes(q)))
  }, [columns, rows, search])

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

  const updateCell = (rowId: string, col: string, val: string) => {
    setRows((prev) => {
      return prev.map((item) => (item.id === rowId ? { ...item, data: { ...item.data, [col]: val } } : item))
    })
  }

  const onLogout = async () => {
    await logoutInventario()
    navigate('/inventario/login', { replace: true })
  }

  return (
    <div className="inv-page">
      <header className="inv-header">
        <div>
          <p className="inv-kicker">Universidad Santo Tomás</p>
          <h1>Registro de equipos informáticos</h1>
          <p>Gestión local del inventario con importación, exportación Excel y envío por correo.</p>
        </div>
        <button className="inv-logout" onClick={onLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </header>

      <main className="inv-main">
        <section className="inv-card">
          <h2>Operaciones</h2>
          {loadedFileName && <p className="inv-loaded-file">Archivo cargado: {loadedFileName}</p>}
          <div className="inv-actions">
            <label className="inv-btn">
              Importar planilla
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={onImport} />
            </label>
            <button className="inv-btn" onClick={() => void onSendByEmail()}>
              Enviar por correo
            </button>
            <button className="inv-btn" onClick={onSaveToPc}>
              Guardar en PC
            </button>
            <button className="inv-btn inv-btn-secondary" onClick={addColumn}>
              Nueva columna
            </button>
            <button className="inv-btn inv-btn-secondary" onClick={addRow}>
              Nueva fila
            </button>
            <button className="inv-btn inv-btn-danger" onClick={clearData}>
              Limpiar Excel completo
            </button>
          </div>
        </section>

        <section className="inv-card">
          <h2>Búsqueda</h2>
          <input
            className="inv-search"
            type="search"
            value={search}
            placeholder="Buscar en todas las columnas..."
            onChange={(e) => setSearch(e.target.value)}
          />
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
    </div>
  )
}

export default InventarioPage
