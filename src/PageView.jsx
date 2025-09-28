import { useState, useEffect } from 'react'
import { HeaderView } from '@shared/view/components/HeaderView'
import { RouterView } from '@shared/view/components/RouterView'
import { useRouter } from '@shared/hooks/components/useRouterViewModel'

export function PageView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { currentRoute } = useRouter()

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
    console.log('🔓 Login realizado')
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setIsAuthenticated(false)
    window.location.href = '/' // Força redirecionamento para home
    console.log('🔒 Logout realizado')
  }

  // Debug: log mudanças de rota e auth
  useEffect(() => {
    console.log(
      `📍 PageView: rota atual = ${currentRoute}, auth = ${isAuthenticated}`
    )
  }, [currentRoute, isAuthenticated])

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <HeaderView isAuthenticated={isAuthenticated} />
      <RouterView isAuthenticated={isAuthenticated} />

      {/* Botões de teste */}
      {process.env.NODE_ENV === 'development' && (
        <div className='fixed right-4 bottom-4 flex gap-2 rounded bg-gray-800/90 p-4 backdrop-blur-sm'>
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
