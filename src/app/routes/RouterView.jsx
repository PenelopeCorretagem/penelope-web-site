import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ScrollToTop } from '@shared/components/layout/ScrollToTop/ScrollToTop'
import { HomeView } from '@institutional/pages/Home/HomeView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { PropertiesView } from '@institutional/pages/Properties/PropertiesView'
import { PropertyDetailsView } from '@institutional/pages/PropertyDetails/PropertyDetailsView'
import { AboutView } from '@institutional/pages/About/AboutView'
import { ContactsView } from '@institutional/pages/Contacts/ContactsView'
import { ScheduleView } from '@management/pages/Schedule/ScheduleView'
import { ProfileView } from '@management/pages/Profile/ProfileView'
import { SettingsView } from '@management/pages/Settings/SettingsView'
import ManagementView from '@management/pages/ManegementView'
import { AuthView } from '@auth/pages/Auth/AuthView'
import { ResetPasswordView } from '@auth/pages/ResetPassword/ResetPasswordView'
import { PropertyConfigView } from '@management/pages/PropertyConfig/PropertyConfigView'

// Views de erro
const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className='error-view flex min-h-[60vh] flex-col items-center justify-center p-8 text-center'>
      <h1 className='mb-4 text-4xl font-bold text-gray-800'>
        404 - Página Não Encontrada
      </h1>
      <ErrorDisplayView
        messages={['A página que você está procurando não existe.']}
        position='inline'
        variant='prominent'
        className='mb-6'
      />
      <button
        onClick={() => navigate(-1)}
        className='bg-distac-primary hover:bg-distac-secondary rounded px-6 py-2 text-white transition-colors'
      >
        Voltar
      </button>
    </div>
  )
}

const UnauthorizedPage = () => {
  const navigate = useNavigate()
  return (
    <div className='error-view flex min-h-[60vh] flex-col items-center justify-center p-8 text-center'>
      <h1 className='mb-4 text-4xl font-bold text-gray-800'>
        401 - Acesso Não Autorizado
      </h1>
      <ErrorDisplayView
        messages={['Você não tem permissão para acessar esta página.']}
        position='inline'
        variant='prominent'
        className='mb-6'
      />
      <button
        onClick={() => navigate('/')}
        className='bg-distac-primary hover:bg-distac-secondary rounded px-6 py-2 text-white transition-colors'
      >
        Ir para Home
      </button>
    </div>
  )
}

// Protected Route component
const ProtectedRoute = ({ isAuthenticated, authReady, children }) => {
  if (!authReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}

// Admin Protected Route component
const AdminProtectedRoute = ({ isAuthenticated, isAdmin, authReady, children }) => {
  if (!authReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (!isAdmin) {
    return <Navigate to='/401' replace />
  }

  return children
}

export function RouterView({ isAuthenticated = false, isAdmin = false, authReady = false }) {
  return (
    <main className='router-view bg-default-light w-full flex-1 overflow-x-hidden overflow-y-auto'>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomeView />} />
        <Route path='/imoveis' element={<PropertiesView />} />
        <Route path='/imovel/1' element={<PropertyDetailsView />} />
        <Route path='/sobre' element={<AboutView />} />
        <Route path='/contatos' element={<ContactsView />} />
        <Route path='/login' element={<AuthView />} />
        <Route path='/registro' element={<AuthView />} />
        <Route path='/esqueci-senha' element={<AuthView />} />
        <Route path='/verificacao' element={<ResetPasswordView />} />
        <Route path='/verificacao-:token' element={<ResetPasswordView />} />
        <Route path='/redefinir-senha' element={<ResetPasswordView />} />

        {/* Protected Routes */}
        <Route
          path='/agenda'
          element={(
            <ProtectedRoute isAuthenticated={isAuthenticated} authReady={authReady}>
              <ScheduleView />
            </ProtectedRoute>
          )}
        />
        <Route
          path='/perfil'
          element={(
            <ProtectedRoute isAuthenticated={isAuthenticated} authReady={authReady}>
              <ProfileView />
            </ProtectedRoute>
          )}
        />
        <Route
          path='/configuracoes'
          element={(
            <ProtectedRoute isAuthenticated={isAuthenticated} authReady={authReady}>
              <SettingsView />
            </ProtectedRoute>
          )}
        />

        {/* Management Routes - User (com sidebar próprio) */}
        <Route
          path='/management'
          element={(
            <ProtectedRoute isAuthenticated={isAuthenticated} authReady={authReady}>
              <ManagementView />
            </ProtectedRoute>
          )}
        >
          <Route path='profile' element={<ProfileView />} />
          <Route path='account' element={<SettingsView />} />
          <Route path='users' element={<div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1></div>} />
          <Route path='properties' element={<div className="p-6"><h1 className="text-2xl font-bold">Properties Management</h1></div>} />
        </Route>

        {/* Admin Routes - Renderizados diretamente (sidebar vem do PageView) */}
        <Route
          path='/admin/management/profile'
          element={(
            <AdminProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              authReady={authReady}
            >
              <div className="p-6">
                <ProfileView />
              </div>
            </AdminProtectedRoute>
          )}
        />
        <Route
          path='/admin/management/account'
          element={(
            <AdminProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              authReady={authReady}
            >
              <div className="p-6">
                <SettingsView />
              </div>
            </AdminProtectedRoute>
          )}
        />
        <Route
          path='/admin/management/users'
          element={(
            <AdminProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              authReady={authReady}
            >
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Users Management</h1>
                <p className="text-gray-600">Gerencie todos os usuários do sistema aqui.</p>
              </div>
            </AdminProtectedRoute>
          )}
        />
        <Route
          path='/admin/management/properties'
          element={(
            <AdminProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              authReady={authReady}
            >
              <PropertyConfigView />
            </AdminProtectedRoute>
          )}
        />

        {/* Error Routes */}
        <Route path='/401' element={<UnauthorizedPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}
