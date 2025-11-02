import { useState, useEffect } from 'react'
import { RouterModel } from '@routes/RouterModel'

/**
 * RouterViewModel - Gerencia a lógica e apresentação do Router
 * Implementa Singleton e centraliza navegação e estado das rotas
 */
class RouterViewModel {
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
      this.navigateTo('/404')
      return
    }

    // Usa o React Router para navegação
    this.routerModel.setCurrentRoute(route)
  }

  goBack() {
    if (this.routerModel.canGoBack()) {
      window.history.back()
      const history = this.routerModel.getHistory()
      const previousRoute = history[history.length - 2]
      this.routerModel.setCurrentRoute(previousRoute)
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

// Função para obter a instância singleton
/**
 * Obtém instância singleton do RouterViewModel
 * @returns {RouterViewModel} Instância única do RouterViewModel
 */
function getRouterViewModel() {
  const routerViewModel = RouterViewModel.getInstance()

  // Configura listener do browser apenas uma vez
  if (!window.__routerListenerConfigured) {
    window.addEventListener('popstate', () => {
      routerViewModel.routerModel.setCurrentRoute(window.location.pathname)
    })

    window.__routerListenerConfigured = true
  }

  return routerViewModel
}

/**
 * Hook para gerenciar navegação e estado das rotas
 * Implementa Factory Pattern - usa o ViewModel singleton internamente
 * @returns {Object} APIs de navegação e estado atual
 */
export function useRouter() {
  const [routerViewModel] = useState(() => getRouterViewModel())
  const [currentRoute, setCurrentRoute] = useState(routerViewModel.route)

  useEffect(() => {
    // Sincroniza com o React Router
    const handleRouteChange = () => {
      const currentPath = window.location.pathname
      console.log('🔄 Route change detected:', currentPath, 'from:', routerViewModel.route)
      if (currentPath !== routerViewModel.route) {
        routerViewModel.routerModel.setCurrentRoute(currentPath)
        setCurrentRoute(currentPath)
      }
    }

    // Handler específico para popstate (botão voltar/avançar)
    const handlePopState = (_event) => {
      const currentPath = window.location.pathname
      routerViewModel.routerModel.setCurrentRoute(currentPath)
      setCurrentRoute(currentPath)
    }

    // Escuta mudanças de rota do navegador (botão voltar/avançar)
    window.addEventListener('popstate', handlePopState)

    // Escuta mudanças programáticas de rota (pushState/replaceState)
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      originalPushState.apply(this, args)
      handleRouteChange()
    }

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args)
      handleRouteChange()
    }

    // Configura estado inicial
    handleRouteChange()

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [routerViewModel])

  // Retorna os métodos já com bind
  return {
    currentRoute,
    navigateTo: routerViewModel.navigateTo,
    goBack: routerViewModel.goBack,
    isRouteActive: route => routerViewModel.isRouteActive(route),
    requiresAuth: route => routerViewModel.requiresAuth(route),
    requiresAdmin: route => routerViewModel.requiresAdmin(route),
    generateRoute: (name, params) =>
      routerViewModel.generateRoute(name, params),
    extractParams: (pattern, route) =>
      routerViewModel.extractParams(pattern, route),
    getAllRoutes: () => routerViewModel.getAllRoutes(),
    getMenuRoutes: () => routerViewModel.getMenuRoutes(),
    getUserActionRoutes: () => routerViewModel.getUserActionRoutes(),
    getAuthRoutes: () => routerViewModel.getAuthRoutes(),
    getAdminRoutes: () => routerViewModel.getAdminRoutes(),
  }
}

// Hook para parâmetros da rota
/**
 * Hook para extrair parâmetros da rota atual
 * @returns {Object} Parâmetros da rota
 */
export function useRouteParams() {
  const { currentRoute, extractParams, getAllRoutes } = useRouter()

  const findRoutePattern = () => {
    const allRoutes = getAllRoutes()
    for (const [pattern] of Object.entries(allRoutes)) {
      if (pattern.includes(':')) {
        const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`)
        if (regex.test(currentRoute)) {
          return pattern
        }
      }
    }
    return currentRoute
  }

  const routePattern = findRoutePattern()
  const params = extractParams(routePattern, currentRoute)

  return params
}

export { RouterViewModel }
