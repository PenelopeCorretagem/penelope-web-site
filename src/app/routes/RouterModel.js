import { ROUTES } from '@constant/routes'

/**
 * RouterModel — Camada de dados de roteamento.
 * Armazena estado da rota atual e configurações de permissão.
 * Não contém lógica de navegação — isso é responsabilidade do ViewModel.
 */
export class RouterModel {
  static #instance = null

  constructor() {
    if (RouterModel.#instance) return RouterModel.#instance

    this.currentRoute = window.location.pathname
    this.listeners = []

    // Fonte única de verdade: a constante ROUTES
    this.routes = Object.fromEntries(
      Object.entries(ROUTES).map(([key, value]) => [key, value.path])
    )

    this.routeConfig = {
      publicRoutes: [
        ROUTES.HOME.path,
        ROUTES.PROPERTIES.path,
        ROUTES.PROPERTY_DETAIL.path,
        ROUTES.ABOUT.path,
        ROUTES.CONTACTS.path,
        ROUTES.LOGIN.path,
        ROUTES.REGISTER.path,
        ROUTES.FORGOT_PASSWORD.path,
        ROUTES.VERIFICATION_CODE.path,
        ROUTES.RESET_PASSWORD.path,
        ROUTES.NOT_FOUND.path,
        ROUTES.UNAUTHORIZED.path,
        ROUTES.SERVER_ERROR.path,
      ],
      authRequiredRoutes: [
        ROUTES.SCHEDULE.path,
        ROUTES.SCHEDULE_PROPERTY.path,
        ROUTES.PROFILE.path,
        ROUTES.ACCOUNT.path,
      ],
      managementRoutes: [
        ROUTES.ADMIN.path,
        ROUTES.ADMIN_PROFILE.path,
        ROUTES.ADMIN_ACCOUNT.path,
        ROUTES.ADMIN_USERS.path,
        ROUTES.ADMIN_USER_ADD.path,
        ROUTES.ADMIN_USER_EDIT.path,
        ROUTES.ADMIN_PROPERTIES.path,
        ROUTES.ADMIN_PROPERTIES_CONFIG.path,
        ROUTES.ADMIN_AMENITIES.path,
        ROUTES.ADMIN_SCHEDULE.path,
      ],
      adminOnlyRoutes: [
        ROUTES.SCHEDULE_REPORT.path,
        ROUTES.SCHEDULE_REPORT_DASHBOARD.path,
        ROUTES.SCHEDULE_REPORT_RECORDS.path,
      ],
    }

    RouterModel.#instance = this
  }

  static getInstance() {
    if (!RouterModel.#instance) new RouterModel()
    return RouterModel.#instance
  }

  // ===== Estado =====
  setCurrentRoute(route) {
    const previous = this.currentRoute
    this.currentRoute = route
    this.#notifyListeners(previous)
  }

  getCurrentRoute() { return this.currentRoute }

  // ===== Observer =====
  addListener(callback) { this.listeners.push(callback) }
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback)
  }
  #notifyListeners(previous) {
    this.listeners.forEach(cb => cb({ route: this.currentRoute, previous }))
  }

  // ===== Getters de rotas =====
  getRoute(key) { return this.routes[key] ?? null }

  getAllRoutes() { return { ...this.routes } }

  getMenuRoutes() {
    return {
      HOME: ROUTES.HOME.path,
      PROPERTIES: ROUTES.PROPERTIES.path,
      ABOUT: ROUTES.ABOUT.path,
      CONTACTS: ROUTES.CONTACTS.path,
      SCHEDULE: ROUTES.SCHEDULE.path,
    }
  }

  getUserActionRoutes() {
    return {
      PROFILE: ROUTES.PROFILE.path,
      ACCOUNT: ROUTES.ACCOUNT.path,
    }
  }

  getAuthRoutes() {
    return {
      LOGIN: ROUTES.LOGIN.path,
      REGISTER: ROUTES.REGISTER.path,
      FORGOT_PASSWORD: ROUTES.FORGOT_PASSWORD.path,
      RESET_PASSWORD: ROUTES.RESET_PASSWORD.path,
    }
  }

  getAdminRoutes() {
    return {
      ADMIN: ROUTES.ADMIN.path,
      ADMIN_PROFILE: ROUTES.ADMIN_PROFILE.path,
      ADMIN_ACCOUNT: ROUTES.ADMIN_ACCOUNT.path,
      ADMIN_USERS: ROUTES.ADMIN_USERS.path,
      ADMIN_USER_ADD: ROUTES.ADMIN_USER_ADD.path,
      ADMIN_USER_EDIT: ROUTES.ADMIN_USER_EDIT.path,
      ADMIN_PROPERTIES: ROUTES.ADMIN_PROPERTIES.path,
      ADMIN_PROPERTIES_CONFIG: ROUTES.ADMIN_PROPERTIES_CONFIG.path,
      ADMIN_AMENITIES: ROUTES.ADMIN_AMENITIES.path,
      ADMIN_SCHEDULE: ROUTES.ADMIN_SCHEDULE.path,
      SCHEDULE_REPORT: ROUTES.SCHEDULE_REPORT.path,
      SCHEDULE_REPORT_DASHBOARD: ROUTES.SCHEDULE_REPORT_DASHBOARD.path,
      SCHEDULE_REPORT_RECORDS: ROUTES.SCHEDULE_REPORT_RECORDS.path,
    }
  }

  // ===== Permissões =====
  getPublicRoutes() { return [...this.routeConfig.publicRoutes] }
  getAuthRequiredRoutes() { return [...this.routeConfig.authRequiredRoutes] }
  getManagementRoutes() { return [...this.routeConfig.managementRoutes] }
  getAdminOnlyRoutes() { return [...this.routeConfig.adminOnlyRoutes] }
}
