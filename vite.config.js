import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const basePath = env.VITE_BASE_PATH || '/'

  return {
    base: basePath,
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:7221',
          changeOrigin: true,
          secure: false,
        },
      },
      // Asegura que todas las rutas se sirvan desde index.html
      middlewareMode: false,
    },
    preview: {
      // Para la vista previa, también hacer fallback a index.html
      historyApiFallback: true,
    },
  }
})
