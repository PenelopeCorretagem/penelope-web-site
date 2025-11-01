import { useState, useEffect } from 'react'
import { HeaderView } from '@shared/components/layout/Header/HeaderView'
import { RouterView } from '@routes/RouterView'
import { useRouter } from '@routes/useRouterViewModel'
import { FooterView } from '@shared/components/layout/Footer/FooterView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'

export function PageView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [_forceUpdate, setForceUpdate] = useState(0)
  const { currentRoute } = useRouter()

  // Feedback de exemplo
  const [showFeedback, setShowFeedback] = useState(false)

  // Rotas onde header e footer devem ser ocultos
  const authRoutes = ['/login', '/registro', '/esqueci-senha', '/redefinir-senha', '/verificacao']
  const isAuthPage = authRoutes.some(route =>
    currentRoute === route || currentRoute.startsWith('/redefinir-senha/')
  )

  useEffect(() => {
    setForceUpdate(prev => prev + 1)
    const jwtToken = localStorage.getItem('jwtToken')
    setIsAuthenticated(!!jwtToken)
  }, [currentRoute, isAuthPage])

  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = localStorage.getItem('jwtToken')
      setIsAuthenticated(!!jwtToken)
    }

    checkAuth()

    setAuthReady(true)

    const onStorage = (event) => {
      if (event.key === 'jwtToken') {
        checkAuth()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  return (
    <div className='flex min-h-screen w-full flex-col'>
  {!isAuthPage && <HeaderView isAuthenticated={isAuthenticated} />}
  <RouterView isAuthenticated={isAuthenticated} authReady={authReady} />
  {!isAuthPage && <FooterView isAuthenticated={isAuthenticated} />}

      {/* Botões de teste */}
      {process.env.NODE_ENV === 'development' && (
        <div className='fixed right-4 bottom-4 flex gap-2 rounded bg-gray-800/90 p-4 z-50 backdrop-blur-sm'>
          <div className='flex gap-2'>
            {/* Only keep logout for convenience in dev; login must be done via the real form */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className='rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600'
              >
                Logout (DEV)
              </button>
            ) : null}
            {/* Botão para mostrar feedback */}
            <button
              onClick={() => setShowFeedback(true)}
              className='rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600'
            >
              Mostrar Feedback
            </button>
          </div>
        </div>
      )}

      {/* Exemplo de AlertView flutuante */}
      <AlertView
        isVisible={showFeedback}
        message="Este é um feedback flutuante de exemplo!"
        onClose={() => setShowFeedback(false)}
      >
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowFeedback(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            OK, Entendi
          </button>
        </div>
      </AlertView>
    </div>
  )
}
