// @shared/viewmodel/components/RouterViewModel.js
import { RouterModel } from '@shared/model/components/RouterModel'

export class RouterViewModel {
  static instance = null

  constructor() {
    // Impede criação de nova instância se já existir
    if (RouterViewModel.instance) {
      return RouterViewModel.instance
    }

    // Inicializa o routerModel antes de qualquer outra coisa
    this.routerModel = RouterModel.getInstance()

    // Define a instância antes dos binds
    RouterViewModel.instance = this

    // Bind de TODOS os métodos que acessam this.routerModel
    this.navigateTo = this.navigateTo.bind(this)
    this.goBack = this.goBack.bind(this)
    this.requiresAuth = this.requiresAuth.bind(this)
    this.requiresAdmin = this.requiresAdmin.bind(this)
    this.generateRoute = this.generateRoute.bind(this)
    this.extractParams = this.extractParams.bind(this)
    this.getAllRoutes = this.getAllRoutes.bind(this)
    this.getMenuRoutes = this.getMenuRoutes.bind(this)
    this.getUserActionRoutes = this.getUserActionRoutes.bind(this)
    this.getAuthRoutes = this.getAuthRoutes.bind(this)
    this.getAdminRoutes = this.getAdminRoutes.bind(this)
    this.addRouteChangeListener = this.addRouteChangeListener.bind(this)
    this.removeRouteChangeListener = this.removeRouteChangeListener.bind(this)

    console.log('🏗️ RouterViewModel instância criada')
  }

  static getInstance() {
    if (!RouterViewModel.instance) {
      RouterViewModel.instance = new RouterViewModel()
    }
    return RouterViewModel.instance
  }

  get route() {
    return this.routerModel.getCurrentRoute()
  }

  navigateTo(route) {
    console.log(`🚀 RouterViewModel: navegando para ${route}`)

    // Valida se a rota existe
    const allRoutes = Object.values(this.routerModel.getAllRoutes())
    const routeExists = allRoutes.some(r => {
      if (r.includes(':')) {
        const pattern = r.replace(/:[^/]+/g, '[^/]+')
        const regex = new RegExp(`^${pattern}$`)
        return regex.test(route)
      }
      return r === route
    })

    if (!routeExists && route !== '/404') {
      console.log(`❌ Rota ${route} não existe, redirecionando para 404`)
      this.navigateTo('/404')
      return
    }

    // Usa o React Router para navegação
    this.routerModel.setCurrentRoute(route)
    console.log(`✅ Navegação concluída para ${route}`)
  }

  goBack() {
    if (this.routerModel.canGoBack()) {
      window.history.back()
      const history = this.routerModel.getHistory()
      const previousRoute = history[history.length - 2]
      this.routerModel.setCurrentRoute(previousRoute)
      console.log(`⬅️ Voltando para ${previousRoute}`)
    } else {
      console.log(`⚠️ Não é possível voltar - histórico vazio`)
    }
  }

  addRouteChangeListener(callback) {
    this.routerModel.addListener(callback)
  }

  removeRouteChangeListener(callback) {
    this.routerModel.removeListener(callback)
  }

  isRouteActive(route) {
    return this.route === route
  }

  // Delega métodos do modelo
  requiresAuth(route) {
    return this.routerModel.requiresAuth(route)
  }

  requiresAdmin(route) {
    return this.routerModel.requiresAdmin(route)
  }

  generateRoute(routeName, params = {}) {
    return this.routerModel.generateRoute(routeName, params)
  }

  extractParams(routePattern, actualRoute) {
    return this.routerModel.extractParams(routePattern, actualRoute)
  }

  get(routeName) {
    return this.routerModel.get(routeName)
  }

  getAllRoutes() {
    return this.routerModel.getAllRoutes()
  }

  getMenuRoutes() {
    return this.routerModel.getMenuRoutes()
  }

  getUserActionRoutes() {
    return this.routerModel.getUserActionRoutes()
  }

  getAuthRoutes() {
    return this.routerModel.getAuthRoutes()
  }

  getAdminRoutes() {
    return this.routerModel.getAdminRoutes()
  }
}
