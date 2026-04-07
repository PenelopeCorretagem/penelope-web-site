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

  if (!env.API_URL) {
    throw new Error(
      `Variável API_URL não definida para o modo ${mode}. ` +
        `Configure a URL base do backend no arquivo .env correspondente.`
    )
  }

  const apiBaseUrl = env.API_URL
  const viaCepBaseUrl = env.VIACEP_URL || 'https://viacep.com.br/ws'

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.API_URL': JSON.stringify(apiBaseUrl),
      'import.meta.env.VIACEP_URL': JSON.stringify(viaCepBaseUrl),
      'import.meta.env.APP_MODEL': JSON.stringify(env.APP_MODEL || 'development'),
    },

    resolve: {
      alias: {
        // Módulos de aplicação
        '@shared': path.resolve(__dirname, './src/shared'),
        '@institutional': path.resolve(__dirname, './src/modules/institutional'),
        '@auth': path.resolve(__dirname, './src/modules/auth'),
        '@management': path.resolve(__dirname, './src/modules/management'),

        // Shared (utils, constants, hooks, components)
        '@constant': path.resolve(__dirname, './src/shared/constants'),
        '@utils': path.resolve(__dirname, './src/shared/utils'),

        // App core (API, Services, Mappers, DTOs, Routes)
        '@app': path.resolve(__dirname, './src/app'),
        '@routes': path.resolve(__dirname, './src/app/routes'),
        '@api': path.resolve(__dirname, './src/app/api'),
        '@services': path.resolve(__dirname, './src/app/services'),
        '@mappers': path.resolve(__dirname, './src/app/mappers'),
        '@dtos': path.resolve(__dirname, './src/app/dtos'),
        '@mocks': path.resolve(__dirname, './src/app/mocks'),

        // Convenience aliases para domínios/integrações específicas
        // Services
        '@service-penelopec': path.resolve(__dirname, './src/app/services/penelopec'),
        '@service-viacep': path.resolve(__dirname, './src/app/services/viacep'),
        // APIs
        '@api-penelopec': path.resolve(__dirname, './src/app/api/penelopec'),
        '@api-viacep': path.resolve(__dirname, './src/app/api/viacep'),
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
