import { setupWorker } from 'msw'
import { handlers } from './handlers'

// configura um service worker no navegador com os handlers definidos
export const worker = setupWorker(...handlers)
