import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@shared/styles/style.css'
import { PageView } from './PageView'

async function startApp() {
  if (import.meta.env.VITE_API_MODE === 'mock') {
    const { worker } = await import('@mocks/browser')
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
