// RouterView.jsx - Versão Corrigida
import { useRouter } from '@shared/hooks/components/useRouterViewModel'
import { HomeView } from '@institutional/view/pages/HomeView'
import { PropertiesView } from '@institutional/view/pages/PropertiesView'
import { AboutView } from '@institutional/view/pages/AboutView'
import { ContactsView } from '@institutional/view/pages/ContactsView'
import { ScheduleView } from '@management/view/pages/ScheduleView'
import { ProfileView } from '@management/view/pages/ProfileView'
import { SettingsView } from '@management/view/pages/SettingsView'

// Componentes de página
const HomePage = () => <HomeView />
const PropertiesPage = () => <PropertiesView />
const AboutPage = () => <AboutView />
const ContactsPage = () => <ContactsView />
const SchedulePage = () => <ScheduleView />
const ProfilePage = () => <ProfileView />
const SettingsPage = () => <SettingsView />

// Views de erro
const NotFoundPage = () => (
  <div className='error-view'>
    <h1>404 - Página Não Encontrada</h1>
    <p>A página que você está procurando não existe.</p>
  </div>
)

const UnauthorizedPage = () => (
  <div className='error-view'>
    <h1>401 - Acesso Não Autorizado</h1>
    <p>Você não tem permissão para acessar esta página.</p>
  </div>
)

// Mapeamento de rotas para componentes
const routes = {
  '/': HomePage,
  '/imoveis': PropertiesPage,
  '/sobre': AboutPage,
  '/contatos': ContactsPage,
  '/agenda': SchedulePage,
  '/perfil': ProfilePage,
  '/configuracoes': SettingsPage,
  '/404': NotFoundPage,
  '/401': UnauthorizedPage,
}

export function RouterView({ isAuthenticated = false, isAdmin = false }) {
  const { currentRoute, navigateTo, requiresAuth, requiresAdmin } = useRouter()

  console.log(`🖼️ RouterView: renderizando rota ${currentRoute}`)

  const getCurrentComponent = () => {
    let matchedRoute = currentRoute
    let Component = routes[currentRoute]

    console.log(`🔍 Buscando componente para rota: ${currentRoute}`)

    // Verifica rotas com parâmetros
    if (!Component) {
      console.log('🔍 Rota não encontrada diretamente, verificando padrões...')

      const routeKeys = Object.keys(routes)
      for (const route of routeKeys) {
        if (route.includes(':')) {
          const pattern = route.replace(/:[^/]+/g, '[^/]+')
          const regex = new RegExp(`^${pattern}$`)
          if (regex.test(currentRoute)) {
            Component = routes[route]
            matchedRoute = route
            console.log(`✅ Padrão encontrado: ${route} -> ${currentRoute}`)
            break
          }
        }
      }
    }

    if (!Component) {
      console.log('❌ Componente não encontrado, usando NotFoundPage')
      return NotFoundPage
    }

    console.log(`📋 Componente encontrado, verificando permissões...`)

    // Verifica autenticação
    if (requiresAuth(matchedRoute) && !isAuthenticated) {
      console.log(
        `🔒 Rota ${matchedRoute} requer autenticação, redirecionando para 401`
      )
      navigateTo('/401')
      return UnauthorizedPage
    }

    // Verifica permissão de admin
    if (requiresAdmin(matchedRoute) && !isAdmin) {
      console.log(
        `👑 Rota ${matchedRoute} requer permissões de admin, redirecionando para 401`
      )
      navigateTo('/401')
      return UnauthorizedPage
    }

    console.log(`✅ Permissões OK, renderizando componente`)
    return Component
  }

  const CurrentComponent = getCurrentComponent()

  return (
    <main className='router-view bg-brand-white min-h-screen w-full flex-1 overflow-x-hidden'>
      <CurrentComponent />
    </main>
  )
}
