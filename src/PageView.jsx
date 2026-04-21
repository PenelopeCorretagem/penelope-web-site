import { useState, useEffect } from 'react'
import { HeaderView } from '@shared/components/layout/Header/HeaderView'
import { RouterView } from '@routes/RouterView'
import { useRouter } from '@routes/useRouterViewModel'
import { ChatbotView } from '@shared/components/ui/Chatbot/ChatbotView'
import { SidebarView } from '@shared/components/layout/Sidebar/SidebarView'
import { AuthTransitionView } from '@shared/pages/AuthTransition/AuthTransitionView'
import { useAuthTransitionViewModel } from '@shared/pages/AuthTransition/useAuthTransitionViewModel'

/**
 * PageView - Componente raiz da aplicação
 *
 * RESPONSABILIDADES:
 * - Layout principal (header, sidebar, router, footer)
 * - Gerenciar autenticação (isAuthenticated, isAdmin)
 * - Controlar exibição de transição de auth
 * - Sincronizar estado entre abas
 * - Gerenciar logout
 */
export function PageView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [_forceUpdate, setForceUpdate] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentRoute } = useRouter()

  // Hook para gerenciar transição de autenticação
  const { isTransitioning, status, message } = useAuthTransitionViewModel()

  // Rotas onde header e footer devem ser ocultos
  const authRoutes = ['/login', '/registro', '/esqueci-senha', '/redefinir-senha', '/verificacao']
  const isAuthPage = authRoutes.some(route =>
    currentRoute === route || currentRoute.startsWith('/redefinir-senha/')
  )

  // Rotas administrativas/privadas onde footer não deve aparecer
  const adminRoutes = ['/admin', '/agenda']
  const isAdminPage = adminRoutes.some(route => currentRoute.startsWith(route))

  // Deve mostrar footer apenas em páginas públicas (não auth, não admin)
  const shouldShowFooter = !isAuthPage && !isAdminPage

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
      const newIsAdmin = userRole === 'ADMINISTRADOR'

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
    // Dispara transição de logout
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'logout', message: 'Encerrando sua sessão...' }
    }))

    // Remove dados de autenticação após um pequeno delay para a transição renderizar
    setTimeout(() => {
      sessionStorage.removeItem('jwtToken')
      sessionStorage.removeItem('userRole')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('userEmail')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('_hadToken')
      setIsAuthenticated(false)
      setIsAdmin(false)
      
      // Aguarda a animação terminar antes de redirecionar
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    }, 300)
  }

  const handleDevLogin = () => {
    // Dispara transição de login
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'login', message: 'Autenticando sua conta...' }
    }))

    setTimeout(() => {
      sessionStorage.setItem('jwtToken', `dev-fake-token-${Date.now()}`)
      sessionStorage.setItem('userRole', 'CLIENTE')
      sessionStorage.setItem('userId', '1')
      sessionStorage.setItem('userEmail', 'dev@test.com')
      sessionStorage.setItem('userName', 'Dev User')
      sessionStorage.setItem('_hadToken', 'true')
      setIsAuthenticated(true)
      setIsAdmin(false)
      window.dispatchEvent(new CustomEvent('authChanged'))
      // Redireciona para a home após login
      window.location.href = '/'
    }, 500)
  }

  const handleDevAdminLogin = () => {
    // Dispara transição de login
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'login', message: 'Autenticando sua conta de administrador...' }
    }))

    setTimeout(() => {
      sessionStorage.setItem('jwtToken', `dev-fake-admin-token-${Date.now()}`)
      sessionStorage.setItem('userRole', 'ADMINISTRADOR')
      sessionStorage.setItem('userId', '1')
      sessionStorage.setItem('userEmail', 'admin@test.com')
      sessionStorage.setItem('userName', 'Admin User')
      sessionStorage.setItem('_hadToken', 'true')
      setIsAuthenticated(true)
      setIsAdmin(true)
      window.dispatchEvent(new CustomEvent('authChanged'))
      // Redireciona para a home após login
      window.location.href = '/'
    }, 500)
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

        <div className='flex-1 overflow-x-hidden overflow-y-hidden'>
          <RouterView isAuthenticated={isAuthenticated} isAdmin={isAdmin} authReady={authReady} shouldShowFooter={shouldShowFooter} />
          <ChatbotView />
        </div>
      </div>

      {/* Tela de Transição de Autenticação */}
      {isTransitioning && (
        <AuthTransitionView status={status} message={message} />
      )}
    </div>
  )
}
