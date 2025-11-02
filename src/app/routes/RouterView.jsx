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
import { AuthView } from '@auth/pages/Auth/AuthView'
import { ResetPasswordView } from '@auth/pages/ResetPassword/ResetPasswordView'

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
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  return children
}

export function RouterView({ isAuthenticated = false }) {
  return (
    <main className='router-view bg-default-light w-full flex-1'>
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
          element={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ScheduleView />
            </ProtectedRoute>
          }
        />
        <Route
          path='/perfil'
          element={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path='/configuracoes'
          element={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsView />
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        <Route path='/401' element={<UnauthorizedPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}
