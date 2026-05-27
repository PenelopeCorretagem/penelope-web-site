import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authSessionUtil } from '@utils/authSession/authSessionUtil'
import { ScrollToTop } from '@shared/components/layout/ScrollToTop/ScrollToTop'
import { FooterView } from '@shared/components/layout/Footer/FooterView'
import { HomeView } from '@institutional/pages/Home/HomeView'
import { AdvertisementsView } from '@institutional/pages/Advertisements/AdvertisementsView'
import { AdvertisementDetailsView } from '@institutional/pages/AdvertisementDetails/AdvertisementDetailsView'
import { AboutView } from '@institutional/pages/About/AboutView'
import { ContactsView } from '@institutional/pages/Contacts/ContactsView'
import { ScheduleView } from '@management/pages/Schedule/ScheduleView'
import { AppointmentReportView } from '@management/pages/AppointmentReport/AppointmentReportView'
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
 * ProtectedRoute — Wrapper para rotas protegidas.
 * Salva a rota de retorno via authSessionUtil antes de redirecionar.
 */
const ProtectedRoute = ({ protection, children }) => {
  const { shouldRender, redirectTo } = protection
  const location = useLocation()

  if (!shouldRender && !redirectTo) {
    return <AuthTransitionView status="verifying" message="Verificando acesso..." />
  }

  if (!shouldRender && redirectTo) {
    authSessionUtil.savePostLoginRedirect({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
    })

    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return children
}

/**
 * RouterView — Camada de apresentação do roteamento.
 */
export function RouterView({
  isAuthenticated = false,
  isAdmin = false,
  isBroker = false,
  authReady = false,
  shouldShowFooter = false,
}) {
  const { calculateProtectedRouteAccess, calculateAdminRouteAccess, calculateManagementRouteAccess, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  const protectedAccess = calculateProtectedRouteAccess(isAuthenticated, authReady)
  const adminAccess = calculateAdminRouteAccess(isAuthenticated, isAdmin, authReady)
  const managementAccess = calculateManagementRouteAccess(isAuthenticated, isAdmin, isBroker, authReady)

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
          element={
            <ProtectedRoute protection={protectedAccess}><ScheduleView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.SCHEDULE_REPORT}
          element={(
            <ProtectedRoute protection={adminAccess}>
              <Navigate to={routes.SCHEDULE_REPORT_DASHBOARD} replace />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.SCHEDULE_REPORT_DASHBOARD}
          element={
            <ProtectedRoute protection={adminAccess}><AppointmentReportView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.SCHEDULE_REPORT_RECORDS}
          element={
            <ProtectedRoute protection={adminAccess}><AppointmentReportView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.PROFILE}
          element={
            <ProtectedRoute protection={protectedAccess}><ProfileView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ACCOUNT}
          element={
            <ProtectedRoute protection={protectedAccess}><AccountView /></ProtectedRoute>
          }
        />

        {/* ===== ROTAS ADMIN ===== */}
        <Route
          path={routes.ADMIN}
          element={(
            <ProtectedRoute protection={managementAccess}>
              <Navigate to={routes.ADMIN_PROPERTIES} replace />
            </ProtectedRoute>
          )}
        />
        <Route
          path={routes.ADMIN_PROFILE}
          element={
            <ProtectedRoute protection={managementAccess}><ProfileView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_ACCOUNT}
          element={
            <ProtectedRoute protection={managementAccess}><AccountView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_USERS}
          element={
            <ProtectedRoute protection={managementAccess}><UsersView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_USER_ADD}
          element={
            <ProtectedRoute protection={managementAccess}><UserConfigView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_USER_EDIT}
          element={
            <ProtectedRoute protection={managementAccess}><UserConfigView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_PROPERTIES}
          element={
            <ProtectedRoute protection={managementAccess}><AdvertisementsConfigView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_PROPERTIES_CONFIG}
          element={
            <ProtectedRoute protection={managementAccess}><AdvertisementConfigView /></ProtectedRoute>
          }
        />
        <Route
          path={routes.ADMIN_AMENITIES}
          element={
            <ProtectedRoute protection={managementAccess}><AmenitiesView /></ProtectedRoute>
          }
        />

        {/* ===== ERROS ===== */}
        <Route path={routes.UNAUTHORIZED} element={<UnauthorizedView />} />
        <Route path={routes.NOT_FOUND} element={<NotFoundView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>

      {shouldShowFooter && <FooterView isAuthenticated={isAuthenticated} />}
    </main>
  )
}
