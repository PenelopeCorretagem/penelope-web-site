import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import { PageView } from './PageView'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PageView />
    </BrowserRouter>
  </StrictMode>
)
