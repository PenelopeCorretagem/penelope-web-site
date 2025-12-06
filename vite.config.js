// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Carrega variáveis de ambiente baseado no mode
  const env = loadEnv(mode, process.cwd(), '')

  const port = parseInt(env.APP_PORT)

  console.log(`Modo: ${mode} | Porta: ${port}`)

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'import.meta.env.DEV': mode === 'development',
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1'),
      'import.meta.env.VITE_VIACEP_BASE_URL': JSON.stringify(env.VITE_VIACEP_BASE_URL || 'https://viacep.com.br/ws'),
    },

    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './src/shared'),
        '@institutional': path.resolve(__dirname, './src/modules/institutional'),
        '@auth': path.resolve(__dirname, './src/modules/auth'),
        '@management': path.resolve(__dirname, './src/modules/management'),
        '@routes': path.resolve(__dirname, './src/app/routes'),
        '@domains': path.resolve(__dirname, './src/domains'),
        '@utils': path.resolve(__dirname, './src/shared/utils'),
        '@services': path.resolve(__dirname, './src/app/services'),
        '@app': path.resolve(__dirname, './src/app'),
        '@api': path.resolve(__dirname, './src/app/services/api'),
        '@mapper': path.resolve(__dirname, './src/app/services/mapper'),
        '@entity': path.resolve(__dirname, './src/app/model/entities'),
        '@constant': path.resolve(__dirname, './src/constants'),
      },
    },

    // Configurações do servidor de desenvolvimento
    server: {
      port,
      host: true, // Permite acesso via IP (0.0.0.0)
      open: true, // Abre browser automaticamente
      strictPort: true, // Falha se porta estiver ocupada
      cors: true, // Permite CORS
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
          },
        },
      },
    },
  }
})
