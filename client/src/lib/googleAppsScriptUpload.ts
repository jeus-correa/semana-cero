export async function uploadExcelViaAppsScript(base64: string, fileName: string, folderId: string): Promise<string> {
  const endpoint = (import.meta.env.VITE_GAS_WEBAPP_URL as string | undefined)?.trim()
  if (!endpoint) {
    throw new Error('Falta VITE_GAS_WEBAPP_URL en .env (URL del Web App de Apps Script)')
  }

  const payloadObj = {
    folderId,
    fileName,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    base64,
    replaceIfExists: true
  }
  const parseResponse = async (res: Response) => {
    if (!res.ok) throw new Error(`Apps Script respondio ${res.status}`)
    const text = await res.text()
    try {
      return JSON.parse(text.trim()) as { ok?: boolean; error?: string; url?: string }
    } catch {
      throw new Error(`Respuesta invalida de Apps Script: ${text.slice(0, 120)}`)
    }
  }

  try {
    // Intento 1: JSON como text/plain (evita preflight y funciona con JSON.parse(e.postData.contents)).
    const asText = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payloadObj)
    })
    const data = await parseResponse(asText)
    if (!data.ok) throw new Error(data.error || 'Apps Script no pudo guardar el archivo en Drive')
    return data.url || ''
  } catch {
    // Intento 2: form-urlencoded (compatibilidad si el script usa e.parameter).
    try {
      const form = new URLSearchParams({
        ...payloadObj,
        replaceIfExists: String(payloadObj.replaceIfExists)
      })
      const asForm = await fetch(endpoint, { method: 'POST', body: form })
      const data = await parseResponse(asForm)
      if (!data.ok) throw new Error(data.error || 'Apps Script no pudo guardar el archivo en Drive')
      return data.url || ''
    } catch {
      throw new Error(
        'No se pudo conectar con Apps Script (Failed to fetch). Revisa que el Web App este en "Cualquiera con el enlace", que la URL termine en /exec y vuelve a desplegar la ultima version.'
      )
    }
  }
}
