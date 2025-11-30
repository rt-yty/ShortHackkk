import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    host: '0.0.0.0',     // Позволяет доступ извне (для ngrok)
    port: 5173,
    allowedHosts: true,  // Разрешаем ВСЕ хосты (включая любые ngrok домены)
    // Proxy API запросов к бекенду
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
