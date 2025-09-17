// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  // Carrega variáveis de ambiente baseado no mode
  const env = loadEnv(mode, process.cwd(), '')

  const port = parseInt(env.APP_PORT)

  console.log(`Modo: ${mode} | Porta: ${port}`)

  return {
    plugins: [
      react(),
      tailwindcss()
    ],

    // Configurações do servidor de desenvolvimento
    server: {
      port,
      host: true,           // Permite acesso via IP (0.0.0.0)
      open: true,          // Abre browser automaticamente
      strictPort: true,    // Falha se porta estiver ocupada
      cors: true,          // Permite CORS

      // Proxy para API
      proxy: mode === 'development' ? {
        '/api': {
          target: env.API_URL,
          changeOrigin: true,
          secure: false,
        }
      } : undefined
    },

    // Configurações do preview (build de produção)
    preview: {
      port: port,
      host: true,
      open: true,
      strictPort: true,
    },

    // Build otimizations por ambiente
    build: {
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['clsx'],
          }
        }
      }
    }
  }
})
