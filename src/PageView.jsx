import { useState, useEffect } from 'react'
import { HeaderView } from '@shared/components/layout/Header/HeaderView'
import { RouterView } from '@routes/RouterView'
import { useRouter } from '@routes/useRouterViewModel'
import { FooterView } from '@shared/components/layout/Footer/FooterView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'
import { SidebarView } from '@shared/components/layout/Sidebar/SidebarView'

export function PageView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [_forceUpdate, setForceUpdate] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentRoute } = useRouter()

  // Feedback de exemplo
  const [showFeedback, setShowFeedback] = useState(false)

  // Rotas onde header e footer devem ser ocultos
  const authRoutes = ['/login', '/registro', '/esqueci-senha', '/redefinir-senha', '/verificacao']
  const isAuthPage = authRoutes.some(route =>
    currentRoute === route || currentRoute.startsWith('/redefinir-senha/')
  )

  // Sidebar aparece para usuários autenticados em todas as páginas, exceto páginas de autenticação
  const shouldShowSidebar = isAuthenticated && !isAuthPage

  // Debug adicional
  useEffect(() => {
    console.log('SIDEBAR DEBUG:', {
      currentRoute,
      isAuthenticated,
      isAuthPage,
      shouldShowSidebar,
      isAdmin
    })
  }, [currentRoute, isAuthenticated, isAuthPage, shouldShowSidebar, isAdmin])

  useEffect(() => {
    setForceUpdate(prev => prev + 1)
    const jwtToken = localStorage.getItem('jwtToken')
    setIsAuthenticated(!!jwtToken)
  }, [currentRoute, isAuthPage])

  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = localStorage.getItem('jwtToken')
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')

      console.log('🔍 Auth check:', {
        hasToken: !!jwtToken,
        userId,
        userRole
      })

      setIsAuthenticated(!!jwtToken && !!userId)
      setIsAdmin(userRole === 'admin')
    }

    checkAuth()

    setAuthReady(true)

    const onStorage = (event) => {
      if (event.key === 'jwtToken' || event.key === 'userRole' || event.key === 'userId') {
        checkAuth()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    setIsAdmin(false)
    window.location.href = '/'
  }

  const handleDevLogin = () => {
    localStorage.setItem('jwtToken', `dev-fake-token-${Date.now()}`)
    localStorage.setItem('userRole', 'user')
    localStorage.setItem('userId', '1')
    localStorage.setItem('userEmail', 'dev@test.com')
    localStorage.setItem('userName', 'Dev User')
    setIsAuthenticated(true)
    setIsAdmin(false)
    // Redireciona para a home após login
    window.location.href = '/'
  }

  const handleDevAdminLogin = () => {
    localStorage.setItem('jwtToken', `dev-fake-admin-token-${Date.now()}`)
    localStorage.setItem('userRole', 'admin')
    localStorage.setItem('userId', '1')
    localStorage.setItem('userEmail', 'admin@test.com')
    localStorage.setItem('userName', 'Admin User')
    setIsAuthenticated(true)
    setIsAdmin(true)
    // Redireciona para a home após login
    window.location.href = '/'
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Debug logs
  useEffect(() => {
    console.log('DEV MODE DEBUG:', {
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
      isAuthenticated,
      isAdmin,
      shouldShowSidebar,
      currentRoute,
      isAuthPage,
      shouldShowDevButtons: import.meta.env.DEV && import.meta.env.MODE === 'development'
    })
  }, [isAuthenticated, isAdmin, shouldShowSidebar, currentRoute, isAuthPage])

  return (
    <div className='flex h-screen w-full overflow-hidden'>
      {shouldShowSidebar && (
        <SidebarView open={sidebarOpen} onToggle={toggleSidebar} isAdmin={isAdmin} />
      )}

      <div className='flex flex-col w-full h-full overflow-hidden'>
        {!isAuthPage && <HeaderView isAuthenticated={isAuthenticated} sidebarVisible={shouldShowSidebar} />}

        <div className='flex-1 overflow-x-hidden overflow-y-auto'>
          <RouterView isAuthenticated={isAuthenticated} isAdmin={isAdmin} authReady={authReady} />
          {!isAuthPage && <FooterView isAuthenticated={isAuthenticated} />}
        </div>
      </div>


      {/* Botões de teste */}
      {import.meta.env.DEV && (
        <div className='fixed right-4 bottom-4 flex flex-col gap-2 rounded bg-gray-800/90 p-4 z-[9999] backdrop-blur-sm shadow-lg'>
          <div className='flex flex-col gap-2'>
            {isAuthenticated ? (
              <>
                <div className='text-xs text-white mb-1'>
                  {isAdmin ? '👑 Admin' : '👤 User'}
                </div>
                <button
                  onClick={handleLogout}
                  className='rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 text-sm'
                >
                  Logout (DEV)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDevLogin}
                  className='rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 text-sm'
                >
                  Login User (DEV)
                </button>
                <button
                  onClick={handleDevAdminLogin}
                  className='rounded bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 text-sm'
                >
                  Login Admin (DEV)
                </button>
              </>
            )}
            {/* Botão para mostrar feedback */}
            <button
              onClick={() => setShowFeedback(true)}
              className='rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 text-sm'
            >
              Feedback
            </button>
          </div>
        </div>
      )}

      {/* Exemplo de AlertView flutuante */}
      <AlertView
        isVisible={showFeedback}
        message="Este é um feedback flutuante de exemplo!"
        onClose={() => setShowFeedback(false)}
        buttonsLayout='col'
      >
        <TextView className={getAuthLinkContainerThemeClasses()}>
          <button className={getAuthLinkButtonThemeClasses()}>
            Recuperar senha
          </button>
        </TextView>
      </AlertView>
    </div>
  )
}
