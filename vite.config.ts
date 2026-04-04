import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react'
          }

          if (id.includes('node_modules/recharts/')) {
            return 'charts'
          }

          if (id.includes('node_modules/framer-motion/')) {
            return 'motion'
          }

          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix'
          }

          if (id.includes('node_modules/zustand/')) {
            return 'state'
          }

          if (id.includes('node_modules/lucide-react/')) {
            return 'icons'
          }

          return 'vendor'
        },
      },
    },
  },
})
