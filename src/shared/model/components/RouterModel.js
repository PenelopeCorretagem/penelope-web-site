/**
 * RouterModel - Modelo central de roteamento da aplicação
 * Implementa Singleton para garantir uma única fonte de verdade
 * Gerencia rotas, histórico e permissões
 */
// @shared/model/components/RouterModel.js
export class RouterModel {
  static instance = null

  constructor() {
    if (RouterModel.instance) {
      return RouterModel.instance
    }

    this.currentRoute = window.location.pathname
    this.listeners = []
    this.history = []

    // Todas as rotas da aplicação
    this.routes = {
      // Rotas públicas
      HOME: '/',
      PROPERTIES: '/imoveis',
      PROPERTY_DETAIL: '/imoveis/:id',
      PROPERTY_SEARCH: '/imoveis/busca',
      ABOUT: '/sobre',
      CONTACTS: '/contatos',
      CONTACT_FORM: '/contatos/formulario',

      // Rotas de autenticação
      LOGIN: '/login',
      REGISTER: '/registro',
      FORGOT_PASSWORD: '/esqueci-senha',
      RESET_PASSWORD: '/redefinir-senha/:token',

      // Rotas autenticadas - usuário comum
      PROFILE: '/perfil',
      PROFILE_EDIT: '/perfil/editar',
      SCHEDULE: '/agenda',
      MY_APPOINTMENTS: '/meus-agendamentos',

      // Rotas autenticadas - admin/gestão
      ADMIN_DASHBOARD: '/admin',
      ADMIN_PROPERTIES: '/admin/imoveis',
      ADMIN_USERS: '/admin/usuarios',
      ADMIN_REPORTS: '/admin/relatorios',
      SETTINGS: '/configuracoes',

      // Rotas de erro
      NOT_FOUND: '/404',
      UNAUTHORIZED: '/401',
      SERVER_ERROR: '/500',
    }

    RouterModel.instance = this
  }

  static getInstance() {
    if (!RouterModel.instance) {
      RouterModel.instance = new RouterModel()
    }
    return RouterModel.instance
  }

  // ===== Gerenciamento de estado =====
  setCurrentRoute(route) {
    const previousRoute = this.currentRoute
    this.currentRoute = route
    this.history.push(route)

    console.log(`🔀 RouterModel: rota mudou de ${previousRoute} para ${route}`)

    this.notifyListeners(previousRoute)
  }

  getCurrentRoute() {
    return this.currentRoute
  }

  getHistory() {
    return [...this.history]
  }

  canGoBack() {
    return this.history.length > 1
  }

  // ===== Sistema de listeners =====
  addListener(callback) {
    this.listeners.push(callback)
    console.log(
      `👂 RouterModel: listener adicionado (total: ${this.listeners.length})`
    )
  }

  removeListener(callback) {
    const initialLength = this.listeners.length
    this.listeners = this.listeners.filter(listener => listener !== callback)
    console.log(
      `👂 RouterModel: listener removido (${initialLength} -> ${this.listeners.length})`
    )
  }

  notifyListeners(previousRoute) {
    console.log(
      `📢 RouterModel: notificando ${this.listeners.length} listeners`
    )
    this.listeners.forEach(callback => {
      callback({
        route: this.currentRoute,
        previous: previousRoute,
      })
    })
  }

  // ===== Métodos de rotas =====
  get(routeName) {
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
      SETTINGS: this.routes.SETTINGS,
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
      ADMIN_DASHBOARD: this.routes.ADMIN_DASHBOARD,
      ADMIN_PROPERTIES: this.routes.ADMIN_PROPERTIES,
      ADMIN_USERS: this.routes.ADMIN_USERS,
      ADMIN_REPORTS: this.routes.ADMIN_REPORTS,
    }
  }

  requiresAuth(route) {
    const publicRoutes = [
      this.routes.HOME,
      this.routes.PROPERTIES,
      this.routes.PROPERTY_DETAIL,
      this.routes.PROPERTY_SEARCH,
      this.routes.ABOUT,
      this.routes.CONTACTS,
      this.routes.CONTACT_FORM,
      this.routes.LOGIN,
      this.routes.REGISTER,
      this.routes.FORGOT_PASSWORD,
      this.routes.RESET_PASSWORD,
      this.routes.NOT_FOUND,
      this.routes.UNAUTHORIZED,
      this.routes.SERVER_ERROR,
    ]

    return !publicRoutes.includes(route)
  }

  requiresAdmin(route) {
    const adminRoutes = Object.values(this.getAdminRoutes())
    return adminRoutes.includes(route)
  }

  generateRoute(routeName, params = {}) {
    let route = this.routes[routeName]

    if (!route) {
      throw new Error(`Rota ${routeName} não encontrada`)
    }

    Object.keys(params).forEach(param => {
      route = route.replace(`:${param}`, params[param])
    })

    return route
  }

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
}
