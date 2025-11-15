/**
 * RouterModel - Modelo de dados de roteamento (Camada de Dados)
 *
 * RESPONSABILIDADES:
 * - Armazenar definições de rotas
 * - Manter estado atual da rota
 * - Gerenciar histórico de navegação
 * - Notificar mudanças (Observer Pattern)
 **/
export class RouterModel {
  static instance = null

  constructor() {
    if (RouterModel.instance) {
      return RouterModel.instance
    }

    this.currentRoute = window.location.pathname
    this.listeners = []
    this.history = []

    // Definição de todas as rotas
    this.routes = {
      // Rotas públicas
      HOME: '/',
      PROPERTIES: '/imoveis',
      PROPERTY_DETAIL: '/imoveis/:id',
      ABOUT: '/sobre',
      CONTACTS: '/contatos',

      // Rotas de autenticação
      LOGIN: '/login',
      REGISTER: '/registro',
      FORGOT_PASSWORD: '/esqueci-senha',
      VERIFICATION_CODE: '/verificacao',
      RESET_PASSWORD: '/redefinir-senha',

      // Rotas protegidas - usuário comum
      SCHEDULE: '/agenda',
      PROFILE: '/perfil',
      ACCOUNT: '/conta',

      // Rotas protegidas - admin
      ADMIN: '/admin',
      ADMIN_PROFILE: '/admin/perfil',
      ADMIN_ACCOUNT: '/admin/conta',
      ADMIN_USERS: '/admin/usuarios',
      ADMIN_PROPERTIES: '/admin/imoveis',
      ADMIN_PROPERTIES_CONFIG: '/admin/imoveis/:id',
      ADMIN_SCHEDULE: '/admin/agenda',

      // Rotas de erro
      NOT_FOUND: '/404',
      UNAUTHORIZED: '/401',
      SERVER_ERROR: '/500',
    }

    // Configuração de permissões por rota
    this.routeConfig = {
      publicRoutes: [
        '/',
        '/imoveis',
        '/imoveis/:id',
        '/sobre',
        '/contatos',
        '/login',
        '/registro',
        '/esqueci-senha',
        '/verificacao',
        '/redefinir-senha',
        '/404',
        '/401',
        '/500',
      ],
      authRequiredRoutes: [
        '/agenda',
        '/perfil',
        '/conta',
      ],
      adminRequiredRoutes: [
        '/admin',
        '/admin/perfil',
        '/admin/conta',
        '/admin/usuarios',
        '/admin/imoveis',
        '/admin/imoveis/:id',
        '/admin/agenda',
      ],
    }

    RouterModel.instance = this
  }

  static getInstance() {
    if (!RouterModel.instance) {
      RouterModel.instance = new RouterModel()
    }
    return RouterModel.instance
  }

  // ===== Estado =====
  setCurrentRoute(route) {
    const previousRoute = this.currentRoute
    this.currentRoute = route
    this.history.push(route)
    this.notifyListeners(previousRoute)
  }

  getCurrentRoute() {
    return this.currentRoute
  }

  getHistory() {
    return [...this.history]
  }

  // ===== Listeners (Observer Pattern) =====
  addListener(callback) {
    this.listeners.push(callback)
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }

  notifyListeners(previousRoute) {
    this.listeners.forEach(callback => {
      callback({
        route: this.currentRoute,
        previous: previousRoute,
      })
    })
  }

  // ===== Getters de Rotas =====
  getRoute(routeName) {
    return this.routes[routeName]
  }

  getAllRoutes() {
    return { ...this.routes }
  }

  getMenuRoutes() {
    return {
      HOME: this.routes.HOME,
      PROPERTIES: this.routes.PROPERTIES,
      ABOUT: this.routes.ABOUT,
      CONTACTS: this.routes.CONTACTS,
      SCHEDULE: this.routes.SCHEDULE,
    }
  }

  getUserActionRoutes() {
    return {
      PROFILE: this.routes.PROFILE,
      ACCOUNT: this.routes.ACCOUNT,
    }
  }

  getAuthRoutes() {
    return {
      LOGIN: this.routes.LOGIN,
      REGISTER: this.routes.REGISTER,
      FORGOT_PASSWORD: this.routes.FORGOT_PASSWORD,
      RESET_PASSWORD: this.routes.RESET_PASSWORD,
    }
  }

  getAdminRoutes() {
    return {
      ADMIN: this.routes.ADMIN,
      ADMIN_PROFILE: this.routes.ADMIN_PROFILE,
      ADMIN_ACCOUNT: this.routes.ADMIN_ACCOUNT,
      ADMIN_USERS: this.routes.ADMIN_USERS,
      ADMIN_PROPERTIES: this.routes.ADMIN_PROPERTIES,
      ADMIN_PROPERTIES_CONFIG: this.routes.ADMIN_PROPERTIES_CONFIG,
      ADMIN_SCHEDULE: this.routes.ADMIN_SCHEDULE,
    }
  }

  // ===== Configurações de Permissão =====
  getPublicRoutes() {
    return [...this.routeConfig.publicRoutes]
  }

  getAuthRequiredRoutes() {
    return [...this.routeConfig.authRequiredRoutes]
  }

  getAdminRequiredRoutes() {
    return [...this.routeConfig.adminRequiredRoutes]
  }
}
