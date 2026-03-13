import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ command, mode }) => {

  // apenas utilizar variáveis vindas de arquivos .env
  // e garantir que pelo menos um arquivo esteja presente para o modo atual
  const envFiles = [
    path.resolve(process.cwd(), `.env`),
    path.resolve(process.cwd(), `.env.${mode}`),
  ]

  const hasEnvFile = envFiles.some(f => fs.existsSync(f))
  if (!hasEnvFile) {
    throw new Error(
      `Nenhum arquivo de ambiente encontrado (.env ou .env.${mode}). ` +
        `Crie um dos arquivos para continuar.`
    )
  }

  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.APP_PORT)

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_VIACEP_BASE_URL': JSON.stringify(env.VITE_VIACEP_BASE_URL),
      'import.meta.env.APP_MODEL': JSON.stringify(env.APP_MODEL || 'development'),
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
