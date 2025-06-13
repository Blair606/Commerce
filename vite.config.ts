import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Ecommerce-/',
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  css: {
    postcss: './postcss.config.js'
  }
})
