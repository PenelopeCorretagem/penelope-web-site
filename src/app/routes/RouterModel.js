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
      SCHEDULE_PROPERTY: '/agenda/:title',
      PROFILE: '/meu-perfil',
      ACCOUNT: '/minha-conta',

      // Rotas protegidas - admin
      ADMIN: '/admin',
      ADMIN_PROFILE: '/admin/meu-perfil',
      ADMIN_ACCOUNT: '/admin/minha-conta',
      ADMIN_USERS: '/admin/usuarios',
      ADMIN_USER_ADD: '/admin/usuarios/adicionar',
      ADMIN_USER_EDIT: '/admin/usuarios/:id/editar',
      ADMIN_PROPERTIES: '/admin/gerenciar-imoveis',
      ADMIN_PROPERTIES_CONFIG: '/admin/gerenciar-imoveis/:id',
      ADMIN_SCHEDULE: '/admin/agenda',

      // Rotas de erro
      NOT_FOUND: '/404',
      UNAUTHORIZED: '/401',
      SERVER_ERROR: '/500',
    }

    // Configuração de permissões por rota
    this.routeConfig = {
      publicRoutes: [
        this.routes.HOME,
        this.routes.PROPERTIES,
        this.routes.PROPERTY_DETAIL,
        this.routes.ABOUT,
        this.routes.CONTACTS,
        this.routes.LOGIN,
        this.routes.REGISTER,
        this.routes.FORGOT_PASSWORD,
        this.routes.VERIFICATION_CODE,
        this.routes.RESET_PASSWORD,
        this.routes.NOT_FOUND,
        this.routes.UNAUTHORIZED,
        this.routes.SERVER_ERROR,
      ],
      authRequiredRoutes: [
        this.routes.SCHEDULE,
        this.routes.SCHEDULE_PROPERTY,
        this.routes.PROFILE,
        this.routes.ACCOUNT,
      ],
      adminRequiredRoutes: [
        this.routes.ADMIN,
        this.routes.ADMIN_PROFILE,
        this.routes.ADMIN_ACCOUNT,
        this.routes.ADMIN_USERS,
        this.routes.ADMIN_USER_ADD,
        this.routes.ADMIN_USER_EDIT,
        this.routes.ADMIN_PROPERTIES,
        this.routes.ADMIN_PROPERTIES_CONFIG,
        this.routes.ADMIN_SCHEDULE,
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
      ADMIN_USER_ADD: this.routes.ADMIN_USER_ADD,
      ADMIN_USER_EDIT: this.routes.ADMIN_USER_EDIT,
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

  // ===== Route Generation =====
  /**
   * Generate route with parameters
   * @param {string} routeName - Name of the route
   * @param {Object} params - Parameters to replace in route
   * @returns {string} Generated route
   */
  generateRoute(routeName, params = {}) {
    let route = this.getRoute(routeName)

    if (!route) {
      console.error(`Rota ${routeName} não encontrada`)
      return '/'
    }

    Object.keys(params).forEach(param => {
      route = route.replace(`:${param}`, params[param])
    })

    return route
  }

  /**
   * Extract parameters from current route based on pattern
   * @param {string} routePattern - Route pattern with :param syntax
   * @param {string} actualRoute - Actual route path
   * @returns {Object} Parameters object
   */
  extractParams(routePattern, actualRoute) {
    const patternParts = routePattern.split('/')
    const routeParts = actualRoute.split('/')
    const params = {}

    patternParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1)
        params[paramName] = routeParts[index]
      }
    })

    return params
  }

  navigateTo(routeName, params = {}) {
    const path = this.generateRoute(routeName, params)

    if (!path) return

    window.history.pushState({}, '', path)
    this.setCurrentRoute(path)

    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}
