import { Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from '@shared/components/layout/ScrollToTop/ScrollToTop'
import { FooterView } from '@shared/components/layout/Footer/FooterView'
import { HomeView } from '@institutional/pages/Home/HomeView'
import { AdvertisementsView } from '@institutional/pages/Advertisements/AdvertisementsView'
import { AdvertisementDetailsView } from '@institutional/pages/AdvertisementDetails/AdvertisementDetailsView'
import { AboutView } from '@institutional/pages/About/AboutView'
import { ContactsView } from '@institutional/pages/Contacts/ContactsView'
import { ScheduleView } from '@management/pages/Schedule/ScheduleView'
import { ProfileView } from '@management/pages/Profile/ProfileView'
import { AuthView } from '@auth/pages/Auth/AuthView'
import { ResetPasswordView } from '@auth/pages/ResetPassword/ResetPasswordView'
import { AdvertisementConfigView } from '@management/pages/AdvertisementConfig/AdvertisementConfigView'
import { AdvertisementsConfigView } from '@management/pages/AdvertisementsConfig/AdvertisementsConfigView'
import { UsersView } from '@management/pages/Users/UsersView'
import { UserConfigView } from '@management/pages/UserConfig/UserConfigView'
import { AccountView } from '@management/pages/Account/AccountView'
import { AmenitiesView } from '@management/pages/Amenities/AmenitiesView'
import { NotFoundView } from '@shared/pages/NotFound/NotFoundView'
import { UnauthorizedView } from '@shared/pages/Unauthorized/UnauthorizedView'
import { AuthTransitionView } from '@shared/pages/AuthTransition/AuthTransitionView'
import { useRouter } from './useRouterViewModel'

/**
 * ProtectedRoute - Wrapper para rotas protegidas
 *
 * Renderiza:
 * - AuthTransitionView: enquanto verifica autenticação
 * - Redirect: se não autenticado e sem permissão
 * - Children: se autenticado e com permissão
 */
const ProtectedRoute = ({ protection, children }) => {
  const { shouldRender, redirectTo } = protection

  // Enquanto carrega a verificação de auth
  if (!shouldRender && !redirectTo) {
    return <AuthTransitionView status="verifying" message="Verificando acesso..." />
  }

  // Sem permissão, redireciona
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
  shouldShowFooter = false,
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
    <main className="router-view bg-default-light w-full h-full flex-1 overflow-x-hidden overflow-y-auto">
      <ScrollToTop />
      <Routes>
        {/* ===== ROTAS PÚBLICAS ===== */}
        <Route path={routes.HOME} element={<HomeView />} />
        <Route path={routes.PROPERTIES} element={<AdvertisementsView />} />
        <Route path={routes.PROPERTY_DETAIL} element={<AdvertisementDetailsView />} />
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
              <AdvertisementsConfigView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_PROPERTIES_CONFIG}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <AdvertisementConfigView />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_AMENITIES}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <AmenitiesView />
            </ProtectedRoute>
          )}
        />

        {/* ===== PÁGINAS DE ERRO ===== */}
        <Route path={routes.UNAUTHORIZED} element={<UnauthorizedView />} />
        <Route path={routes.NOT_FOUND} element={<NotFoundView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
      {shouldShowFooter && <FooterView isAuthenticated={isAuthenticated} />}
    </main>
  )
}
