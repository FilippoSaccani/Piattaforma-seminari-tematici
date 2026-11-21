import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Inoltra le chiamate alle API al backend Flask
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
