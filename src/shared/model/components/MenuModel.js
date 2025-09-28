import { RouterModel } from '@shared/model/components/RouterModel'

/**
 * MenuModel - Gerencia estado e lógica do menu da aplicação
 * Integra com RouterModel para navegação
 * Controla itens do menu, autenticação e validações
 */
export class MenuModel {
  constructor(isAuthenticated = false) {
    this.isAuthenticated = isAuthenticated
    this.currentActiveItem = 'home'
    // Usar instância singleton do RouterModel
    this.routerModel = RouterModel.getInstance()
  }

  // Menu base (sempre visível) - usando rotas centralizadas
  getBaseMenuItems() {
    const routes = this.routerModel.getMenuRoutes()
    const currentPath = window.location.pathname

    return [
      {
        id: 'home',
        label: 'Home',
        icon: 'House',
        variant: 'default',
        route: routes.HOME,
        requiresAuth: false,
        active: currentPath === routes.HOME,
      },
      {
        id: 'properties',
        label: 'Imóveis',
        icon: 'Search',
        variant: 'destac',
        route: routes.PROPERTIES,
        requiresAuth: false,
      },
      {
        id: 'about',
        label: 'Sobre',
        variant: 'default',
        route: routes.ABOUT,
        requiresAuth: false,
      },
      {
        id: 'contacts',
        label: 'Contatos',
        variant: 'default',
        route: routes.CONTACTS,
        requiresAuth: false,
      },
    ]
  }

  // Itens apenas para usuários autenticados
  getAuthMenuItems() {
    const routes = this.routerModel.getMenuRoutes()

    return [
      {
        id: 'schedule',
        label: 'Agenda',
        variant: 'default',
        route: routes.SCHEDULE,
        requiresAuth: true,
      },
    ]
  }

  // Ações do usuário - diferentes para autenticado/não autenticado
  getUserActions() {
    const userRoutes = this.routerModel.getUserActionRoutes()
    const authRoutes = this.routerModel.getAuthRoutes()

    if (!this.isAuthenticated) {
      // Usuário não autenticado - mostrar apenas login
      return [
        {
          id: 'login',
          label: 'Login',
          icon: 'User',
          variant: 'destac',
          shape: 'circle',
          route: authRoutes.LOGIN, // Ou uma rota específica de login se você tiver
          requiresAuth: false,
          iconOnly: true,
        },
      ]
    } else {
      // Usuário autenticado - mostrar perfil e configurações
      return [
        {
          id: 'profile',
          label: 'Perfil',
          icon: 'User',
          variant: 'destac',
          shape: 'circle',
          route: userRoutes.PROFILE,
          requiresAuth: true,
          iconOnly: true,
        },
        {
          id: 'settings',
          label: 'Configurações',
          icon: 'Settings',
          variant: 'destac',
          shape: 'circle',
          route: userRoutes.SETTINGS,
          requiresAuth: true,
          iconOnly: true,
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: 'LogOut',
          variant: 'default',
          shape: 'circle',
          route: this.routes.HOME,
          requiresAuth: true,
          iconOnly: true,
        },
      ]
    }
  }

  // Menu completo baseado no estado de auth
  getMenuItems() {
    const baseItems = this.getBaseMenuItems()
    const authItems = this.isAuthenticated ? this.getAuthMenuItems() : []
    return [...baseItems, ...authItems]
  }

  // Busca item por ID
  getItemById(id) {
    const allItems = [...this.getMenuItems(), ...this.getUserActions()]
    return allItems.find(item => item.id === id)
  }

  // Busca item por rota
  getItemByRoute(route) {
    const allItems = [...this.getMenuItems(), ...this.getUserActions()]
    return allItems.find(item => item.route === route)
  }

  // Valida se item existe e pode ser acessado
  validateMenuItem(itemId) {
    const item = this.getItemById(itemId)

    if (!item) {
      return { valid: false, error: `Item ${itemId} não encontrado` }
    }

    // Para o item de login quando não autenticado, sempre válido
    if (itemId === 'login' && !this.isAuthenticated) {
      return { valid: true, item }
    }

    // Para o item de logout, sempre válido se autenticado
    if (itemId === 'logout' && this.isAuthenticated) {
      return { valid: true, item }
    }

    if (item.requiresAuth && !this.isAuthenticated) {
      return { valid: false, error: `Item ${itemId} requer autenticação` }
    }

    return { valid: true, item }
  }

  // Valida rota diretamente (útil para navegação externa)
  validateRoute(route) {
    const requiresAuth = this.routerModel.requiresAuth(route)
    const requiresAdmin = this.routerModel.requiresAdmin(route)

    if (requiresAuth && !this.isAuthenticated) {
      return {
        valid: false,
        error: 'Rota requer autenticação',
        redirectTo: this.routerModel.get('LOGIN'),
      }
    }

    if (requiresAdmin && !this.isAdmin) {
      return {
        valid: false,
        error: 'Rota requer permissões de administrador',
        redirectTo: this.routerModel.get('UNAUTHORIZED'),
      }
    }

    return { valid: true, route }
  }

  // Atualiza estado de autenticação
  setAuthenticationStatus(isAuthenticated) {
    const wasAuthenticated = this.isAuthenticated
    this.isAuthenticated = isAuthenticated

    // Se mudou o estado de autenticação, pode precisar atualizar o item ativo
    if (wasAuthenticated !== isAuthenticated) {
      // Se ficou desautenticado e estava em página que requer auth, volta para home
      if (!isAuthenticated) {
        const currentItem = this.getItemById(this.currentActiveItem)
        if (currentItem && currentItem.requiresAuth) {
          this.setActiveItem('home')
        }
      }
    }

    return {
      changed: wasAuthenticated !== isAuthenticated,
      wasAuthenticated,
      isAuthenticated,
    }
  }

  // Define item ativo
  setActiveItem(itemId) {
    this.currentActiveItem = itemId
  }

  // Define item ativo por rota
  setActiveItemByRoute(route) {
    console.log(`🎯 MenuModel: procurando item para rota ${route}`)

    const allItems = [...this.getMenuItems(), ...this.getUserActions()]

    // Primeira tentativa: correspondência exata
    let item = allItems.find(item => item.route === route)

    if (!item) {
      console.log(
        `🔍 Correspondência exata não encontrada, tentando padrões...`
      )

      // Segunda tentativa: correspondência por padrão
      item = allItems.find(item => {
        if (!item.route) return false

        // Padrões com parâmetros (ex: /user/:id)
        if (item.route.includes(':')) {
          const pattern = item.route.replace(/:[^/]+/g, '[^/]+')
          const regex = new RegExp(`^${pattern}$`)
          return regex.test(route)
        }

        // Rotas base (ex: /imoveis corresponde a /imoveis/detalhes)
        if (route.startsWith(`${item.route}/`) && item.route !== '/') {
          return true
        }

        return false
      })
    }

    if (item) {
      console.log(`✅ Item encontrado: ${item.id} para rota ${route}`)
      this.currentActiveItem = item.id
      return { success: true, item }
    }

    console.log(`❌ Nenhum item encontrado para rota ${route}`)
    return { success: false, error: 'Rota não encontrada no menu' }
  }

  // Getters
  get activeItem() {
    return this.currentActiveItem
  }

  get isAdmin() {
    return false // Por enquanto sempre false
  }

  // Acesso ao RouterModel para casos especiais
  get routes() {
    return this.routerModel
  }
}
