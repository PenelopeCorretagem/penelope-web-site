import { Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from '@shared/components/layout/ScrollToTop/ScrollToTop'
import { HomeView } from '@institutional/pages/Home/HomeView'
import { PropertiesView } from '@institutional/pages/Properties/PropertiesView'
import { PropertyDetailsView } from '@institutional/pages/PropertyDetails/PropertyDetailsView'
import { AboutView } from '@institutional/pages/About/AboutView'
import { ContactsView } from '@institutional/pages/Contacts/ContactsView'
import { ScheduleView } from '@management/pages/Schedule/ScheduleView'
import { ProfileView } from '@management/pages/Profile/ProfileView'
import { AuthView } from '@auth/pages/Auth/AuthView'
import { ResetPasswordView } from '@auth/pages/ResetPassword/ResetPasswordView'
import { PropertyConfigView } from '@management/pages/PropertyConfig/PropertyConfigView'
import { PropertiesConfigView } from '@management/pages/PropertiesConfig/PropertiesConfigView'
import { UsersView } from '@management/pages/Users/UsersView'
import { UserConfigView } from '@management/pages/UserConfig/UserConfigView'
import { AccountView } from '@management/pages/Account/AccountView'
import { NotFoundView } from '@shared/pages/NotFound/NotFoundView'
import { UnauthorizedView } from '@shared/pages/Unauthorized/UnauthorizedView'
import { LoadingView } from '@shared/pages/Loading/LoadingView'
import { useRouter } from './useRouterViewModel'

/**
 * ProtectedRoute - Wrapper para rotas protegidas
 */
const ProtectedRoute = ({ protection, children }) => {
  const { shouldRender, redirectTo } = protection

  if (!shouldRender && !redirectTo) {
    return <LoadingView />
  }

  if (!shouldRender && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

/**
 * RouterView - View de roteamento (Camada de Apresentação)
 *
 * RESPONSABILIDADES:
 * - Renderizar rotas baseado nas props
 * - Aplicar componentes de proteção
 * - Estrutura visual consistente
 **/
export function RouterView({
  isAuthenticated = false,
  isAdmin = false,
  authReady = false,
}) {
  const {
    calculateProtectedRouteAccess,
    calculateAdminRouteAccess,
    getAllRoutes
  } = useRouter()

  const routes = getAllRoutes()

  // Calcula proteções via ViewModel
  const protectedAccess = calculateProtectedRouteAccess(isAuthenticated, authReady)
  const adminAccess = calculateAdminRouteAccess(isAuthenticated, isAdmin, authReady)

  return (
    <main className="router-view bg-default-light w-full flex-1 overflow-x-hidden overflow-y-auto">
      <ScrollToTop />
      <Routes>
        {/* ===== ROTAS PÚBLICAS ===== */}
        <Route path={routes.HOME} element={<HomeView />} />
        <Route path={routes.PROPERTIES} element={<PropertiesView />} />
        <Route path={routes.PROPERTY_DETAIL} element={<PropertyDetailsView />} />
        <Route path={routes.ABOUT} element={<AboutView />} />
        <Route path={routes.CONTACTS} element={<ContactsView />} />

        {/* ===== AUTENTICAÇÃO ===== */}
        <Route path={routes.LOGIN} element={<AuthView />} />
        <Route path={routes.REGISTER} element={<AuthView />} />
        <Route path={routes.FORGOT_PASSWORD} element={<AuthView />} />
        <Route path={routes.VERIFICATION_CODE} element={<ResetPasswordView />} />
        <Route path="/verificacao-:token" element={<ResetPasswordView />} />
        <Route path={routes.RESET_PASSWORD} element={<ResetPasswordView />} />

        {/* ===== ROTAS PROTEGIDAS ===== */}
        <Route
          path={routes.SCHEDULE}
          element={(
            <ProtectedRoute protection={protectedAccess}>
              <ScheduleView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.PROFILE}
          element={(
            <ProtectedRoute protection={protectedAccess}>
              <ProfileView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ACCOUNT}
          element={(
            <ProtectedRoute protection={protectedAccess}>
              <AccountView />
            </ProtectedRoute>
          )}
        />

        {/* ===== ROTAS ADMIN ===== */}
        <Route
          path={routes.ADMIN}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <Navigate to={routes.ADMIN_PROPERTIES} replace />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_PROFILE}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <ProfileView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_ACCOUNT}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <AccountView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_USERS}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <UsersView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_USER_ADD}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <UserConfigView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_USER_EDIT}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <UserConfigView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_PROPERTIES}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <PropertiesConfigView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_PROPERTIES_CONFIG}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <PropertyConfigView />
            </ProtectedRoute>
          )}
        />

        {/* ===== PÁGINAS DE ERRO ===== */}
        <Route path={routes.UNAUTHORIZED} element={<UnauthorizedView />} />
        <Route path={routes.NOT_FOUND} element={<NotFoundView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </main>
  )
}
