import { useState, useEffect } from 'react'
import { useRouter } from '@routes/useRouterViewModel'

export function usePageViewModel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const { currentRoute } = useRouter()

  const checkAuth = () => {
    const token = sessionStorage.getItem('token')
    const userId = sessionStorage.getItem('userId')
    const userRole = sessionStorage.getItem('userRole')
    setIsAuthenticated(!!token && !!userId)
    setIsAdmin(userRole === 'ADMINISTRADOR')
  }

  useEffect(() => {
    checkAuth()
    setAuthReady(true)

    const onStorage = (e) => {
      if (['token', 'userRole', 'userId'].includes(e.key)) checkAuth()
    }
    const onAuthChanged = () => checkAuth()

    window.addEventListener('storage', onStorage)
    window.addEventListener('authChanged', onAuthChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('authChanged', onAuthChanged)
    }
  }, [])

  // Dispara authChanged a cada troca de rota para sincronizar sidebar/header
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('authChanged'))
  }, [currentRoute])

  const AUTH_ROUTES = ['/login', '/registro', '/esqueci-senha', '/redefinir-senha', '/verificacao']
  const ADMIN_ROUTES = ['/admin', '/agenda']

  const isAuthPage = AUTH_ROUTES.some(r => currentRoute === r || currentRoute.startsWith('/redefinir-senha/'))
  const isAdminPage = ADMIN_ROUTES.some(r => currentRoute.startsWith(r))

  return {
    isAuthenticated,
    isAdmin,
    authReady,
    isAuthPage,
    shouldShowFooter: !isAuthPage && !isAdminPage,
    shouldShowSidebar: isAuthenticated && !isAuthPage,
  }
}