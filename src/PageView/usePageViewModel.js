import { useRouter } from '@routes/useRouterViewModel'
import { useAuthSession } from '@shared/hooks/useAuthSession'

export function usePageViewModel() {
  const { currentRoute } = useRouter()
  const { isAuthenticated, isAdmin, authReady } = useAuthSession()

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
