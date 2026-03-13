import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@shared/styles/style.css'
import { PageView } from './PageView'

// o MSW só é inicializado quando estiver no modo de mock
async function startApp() {
  if (import.meta.env.VITE_API_MODE === 'mock') {
    // importa dinamicamente para não carregar o worker no modo normal
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'warn' })
    console.log('[MSW] Modo mock ativado: requisições HTTP serão interceptadas')
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <PageView />
      </BrowserRouter>
    </StrictMode>
  )
}

startApp()
