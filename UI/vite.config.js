import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Proje kökünü ve mode'u vererek env'leri yükle
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      https: env.VITE_HTTPS === "true",
      proxy: {
        '/api': {
          target: env.VITE_BASE_API_URL, // https://localhost:5156
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
