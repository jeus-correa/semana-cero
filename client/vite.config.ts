import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Subimos el límite del aviso a 800 kB (firebase y xlsx son inevitablemente grandes)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // Firebase en su propio chunk (ya estaba separado)
          if (id.includes('firebase')) return 'firebase'

          // Librerías pesadas de inventario → solo se cargan al entrar al módulo
          if (
            id.includes('xlsx') ||
            id.includes('jspdf') ||
            id.includes('jsbarcode') ||
            id.includes('@zxing') ||
            id.includes('canvas') ||
            id.includes('canvg')
          ) return 'inventario-libs'

          // Animaciones
          if (id.includes('framer-motion')) return 'motion'

          // Iconos
          if (id.includes('lucide-react')) return 'icons'

          // React core separado del resto del vendor
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('react-is')
          ) return 'react-core'

          // React Router
          if (id.includes('react-router')) return 'router'

          // El resto del vendor
          return 'vendor'
        }
      }
    }
  }
})
