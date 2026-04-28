import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Valida que uma variável existe e não está vazia.
// Lança erro descritivo apontando qual variável e em qual arquivo .env configurar.
function requireEnv(env, key, mode) {
  if (!env[key] || env[key].trim() === '') {
    throw new Error(
      `[vite.config] Variável obrigatória "${key}" não definida ou vazia ` +
      `para o modo "${mode}". Configure-a no arquivo .env ou .env.${mode}.`
    )
  }
  return env[key].trim()
}

// Compõe uma URL a partir de partes, validando cada uma individualmente.
function composeUrl(env, mode, { protocolKey, ipKey, portKey, pathKey }) {
  const protocol = requireEnv(env, protocolKey, mode)
  const ip       = requireEnv(env, ipKey,       mode)
  const port     = requireEnv(env, portKey,     mode)
  const urlPath  = pathKey ? requireEnv(env, pathKey, mode) : ''
  return `${protocol}://${ip}:${port}${urlPath}`
}

export default defineConfig(({ mode }) => {
  // Garante que ao menos um arquivo .env existe para o modo atual
  const envFiles = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), `.env.${mode}`),
  ]

  const hasEnvFile = envFiles.some(f => fs.existsSync(f))
  if (!hasEnvFile) {
    throw new Error(
      `[vite.config] Nenhum arquivo de ambiente encontrado (.env ou .env.${mode}). ` +
      `Crie um dos arquivos para continuar.`
    )
  }

  const env = loadEnv(mode, process.cwd(), '')

  // ── Metadados do frontend ────────────────────────────────────────────────
  const frontModel   = requireEnv(env, 'FRONT_MODEL',   mode)
  const frontVersion = requireEnv(env, 'FRONT_VERSION', mode)
  const frontName    = requireEnv(env, 'FRONT_NAME',    mode)
  const frontPort    = parseInt(requireEnv(env, 'FRONT_PORT', mode), 10)

  // ── URLs compostas ───────────────────────────────────────────────────────
  const frontUrl = composeUrl(env, mode, {
    protocolKey: 'FRONT_PROTOCOL',
    ipKey:       'FRONT_IP',
    portKey:     'FRONT_PORT',
  })

  const penelopecUrl = composeUrl(env, mode, {
    protocolKey: 'PENELOPEC_PROTOCOL',
    ipKey:       'PENELOPEC_IP',
    portKey:     'PENELOPEC_PORT',
    pathKey:     'PENELOPEC_PATH',
  })

  const calServiceUrl = composeUrl(env, mode, {
    protocolKey: 'CAL_SERVICE_PROTOCOL',
    ipKey:       'CAL_SERVICE_IP',
    portKey:     'CAL_SERVICE_PORT',
    pathKey:     'CAL_SERVICE_PATH',
  })

  // ViaCEP: URL completa, sem composição
  const viaCepUrl = requireEnv(env, 'VIACEP_URL', mode)

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'import.meta.env.FRONT_MODEL':     JSON.stringify(frontModel),
      'import.meta.env.FRONT_VERSION':   JSON.stringify(frontVersion),
      'import.meta.env.FRONT_NAME':      JSON.stringify(frontName),
      'import.meta.env.FRONT_URL':       JSON.stringify(frontUrl),
      'import.meta.env.PENELOPEC_URL':   JSON.stringify(penelopecUrl),
      'import.meta.env.CAL_SERVICE_URL': JSON.stringify(calServiceUrl),
      'import.meta.env.VIACEP_URL':      JSON.stringify(viaCepUrl),
    },

    resolve: {
      alias: {
        // Módulos de aplicação
        '@shared':        path.resolve(__dirname, './src/shared'),
        '@institutional': path.resolve(__dirname, './src/modules/institutional'),
        '@auth':          path.resolve(__dirname, './src/modules/auth'),
        '@management':    path.resolve(__dirname, './src/modules/management'),

        // Shared (utils, constants, hooks, components)
        '@constant': path.resolve(__dirname, './src/shared/constants'),
        '@utils':    path.resolve(__dirname, './src/shared/utils'),

        // App core (API, Services, Mappers, DTOs, Routes)
        '@app':      path.resolve(__dirname, './src/app'),
        '@routes':   path.resolve(__dirname, './src/app/routes'),
        '@api':      path.resolve(__dirname, './src/app/api'),
        '@services': path.resolve(__dirname, './src/app/services'),
        '@mappers':  path.resolve(__dirname, './src/app/mappers'),
        '@dtos':     path.resolve(__dirname, './src/app/dtos'),
        '@mocks':    path.resolve(__dirname, './src/app/mocks'),

        // Aliases por domínio/integração
        '@service-penelopec':  path.resolve(__dirname, './src/app/services/penelopec'),
        '@service-viacep':     path.resolve(__dirname, './src/app/services/viacep'),
        '@service-calservice': path.resolve(__dirname, './src/app/services/calservice'),
        '@api-penelopec':      path.resolve(__dirname, './src/app/api/penelopec'),
        '@api-viacep':         path.resolve(__dirname, './src/app/api/viacep'),
        '@api-calservice':     path.resolve(__dirname, './src/app/api/calservice'),
      },
    },

    server: {
      port: frontPort,
      host: true,
      open: true,
      strictPort: true,
      cors: true,
    },

    preview: {
      port: frontPort,
      host: true,
      open: true,
      strictPort: true,
    },

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