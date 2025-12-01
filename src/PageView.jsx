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

  useEffect(() => {
    setForceUpdate(prev => prev + 1)
    const jwtToken = sessionStorage.getItem('jwtToken')
    setIsAuthenticated(!!jwtToken)
  }, [currentRoute, isAuthPage])

  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = sessionStorage.getItem('jwtToken')
      const userId = sessionStorage.getItem('userId')
      const userRole = sessionStorage.getItem('userRole')

      const newIsAuthenticated = !!jwtToken && !!userId
      const newIsAdmin = userRole === 'admin'

      // Sempre atualiza o estado para garantir sincronização
      setIsAuthenticated(newIsAuthenticated)
      setIsAdmin(newIsAdmin)
    }

    checkAuth()
    setAuthReady(true)

    // Escutar mudanças no sessionStorage
    const onStorage = (event) => {
      if (['jwtToken', 'userRole', 'userId'].includes(event.key)) {
        checkAuth()
      }
    }

    // Escutar mudanças customizadas (para mudanças na mesma aba)
    const onCustomAuth = () => {
      checkAuth()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('authChanged', onCustomAuth)

    // Verificar auth a cada segundo para garantir sincronização (somente em dev)
    let interval = null
    if (import.meta.env.DEV) {
      interval = setInterval(checkAuth, 1000)
    }

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('authChanged', onCustomAuth)
      if (interval) clearInterval(interval)
    }
  }, []) // Remove dependências circulares

  // Disparar evento customizado quando rota muda
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('authChanged'))
  }, [currentRoute])

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('userRole')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('token')
    setIsAuthenticated(false)
    setIsAdmin(false)
    window.location.href = '/'
  }

  const handleDevLogin = () => {
    sessionStorage.setItem('jwtToken', `dev-fake-token-${Date.now()}`)
    sessionStorage.setItem('userRole', 'user')
    sessionStorage.setItem('userId', '1')
    sessionStorage.setItem('userEmail', 'dev@test.com')
    sessionStorage.setItem('userName', 'Dev User')
    setIsAuthenticated(true)
    setIsAdmin(false)
    // Redireciona para a home após login
    window.location.href = '/'
  }

  const handleDevAdminLogin = () => {
    sessionStorage.setItem('jwtToken', `dev-fake-admin-token-${Date.now()}`)
    sessionStorage.setItem('userRole', 'admin')
    sessionStorage.setItem('userId', '1')
    sessionStorage.setItem('userEmail', 'admin@test.com')
    sessionStorage.setItem('userName', 'Admin User')
    setIsAuthenticated(true)
    setIsAdmin(true)
    // Redireciona para a home após login
    window.location.href = '/'
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
    </div>
  )
}
