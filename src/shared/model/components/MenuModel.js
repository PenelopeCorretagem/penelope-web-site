// modules/institutional/model/components/MenuModel.js
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

    return [
      {
        id: 'home',
        label: 'Home',
        icon: 'House',
        variant: 'default',
        route: routes.HOME,
        requiresAuth: false,
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

  // Ações do usuário (perfil sempre, configurações apenas autenticado)
  getUserActions() {
    const userRoutes = this.routerModel.getUserActionRoutes()

    const baseActions = [
      {
        id: 'profile',
        icon: 'User',
        variant: 'destac',
        shape: 'circle',
        route: userRoutes.PROFILE,
        requiresAuth: false,
      },
    ]

    const authActions = [
      {
        id: 'settings',
        icon: 'Settings',
        variant: 'destac',
        shape: 'circle',
        route: userRoutes.SETTINGS,
        requiresAuth: true,
      },
    ]

    return this.isAuthenticated ? [...baseActions, ...authActions] : baseActions
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
    this.isAuthenticated = isAuthenticated
  }

  // Define item ativo
  setActiveItem(itemId) {
    this.currentActiveItem = itemId
  }

  // Define item ativo por rota
  setActiveItemByRoute(route) {
    const item = this.getItemByRoute(route)
    if (item) {
      this.currentActiveItem = item.id
      return { success: true, item }
    }
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
