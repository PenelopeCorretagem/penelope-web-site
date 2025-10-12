import { useState, useEffect } from 'react'
import { HeaderView } from '@shared/components/layout/Header/HeaderView'
import { RouterView } from '@routes/RouterView'
import { useRouter } from '@routes/useRouterViewModel'
import { FooterView } from '@shared/components/layout/Footer/FooterView'

export function PageView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [_forceUpdate, setForceUpdate] = useState(0)
  const { currentRoute } = useRouter()

  // Rotas onde header e footer devem ser ocultos
  const authRoutes = ['/login', '/registro', '/esqueci-senha', '/redefinir-senha', '/verificacao']
  const isAuthPage = authRoutes.some(route =>
    currentRoute === route || currentRoute.startsWith('/redefinir-senha/')
  )

  // Debug para verificar mudanças de rota
  useEffect(() => {
    // Força re-renderização quando rota muda
    setForceUpdate(prev => prev + 1)
  }, [currentRoute, isAuthPage])

  // Sincroniza estado de autenticação com o JWT
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken')
    setIsAuthenticated(!!jwtToken)
  }, [])

  const handleLogin = () => {
    // Simula um token JWT para desenvolvimento
    const mockJWT = `mock_jwt_token_${Date.now()}`
    localStorage.setItem('jwtToken', mockJWT)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setIsAuthenticated(false)
    window.location.href = '/' // Força redirecionamento para home
  }


  return (
    <div className='flex min-h-screen w-full flex-col'>
      {!isAuthPage && <HeaderView isAuthenticated={isAuthenticated} />}
      <RouterView isAuthenticated={isAuthenticated} />
      {!isAuthPage && <FooterView isAuthenticated={isAuthenticated} />}
      {/* Botões de teste */}
      {process.env.NODE_ENV === 'development' && (
        <div className='fixed right-4 bottom-4 flex gap-2 rounded bg-gray-800/90 p-4 z-50 backdrop-blur-sm'>
          <div className='flex gap-2'>
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className='rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
              >
                Login (DEV)
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className='rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600'
              >
                Logout (DEV)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
