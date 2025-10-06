import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { HomeView } from '@institutional/view/pages/HomeView'
import { ErrorDisplayView } from './ErrorDisplayView'
import { PropertiesView } from '@institutional/view/pages/PropertiesView'
import { AboutView } from '@institutional/view/pages/AboutView'
import { ContactsView } from '@institutional/view/pages/ContactsView'
import { ScheduleView } from '@management/view/pages/ScheduleView'
import { ProfileView } from '@management/view/pages/ProfileView'
import { SettingsView } from '@management/view/pages/SettingsView'
import { LoginView } from '@auth/view/pages/LoginView'

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
        className='bg-brand-pink hover:bg-brand-brown rounded px-6 py-2 text-white transition-colors'
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
        className='bg-brand-pink hover:bg-brand-brown rounded px-6 py-2 text-white transition-colors'
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
    <main className='router-view bg-brand-white w-full flex-1'>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomeView />} />
        <Route path='/imoveis' element={<PropertiesView />} />
        <Route path='/sobre' element={<AboutView />} />
        <Route path='/contatos' element={<ContactsView />} />
        <Route path='/login' element={<LoginView />} />

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
