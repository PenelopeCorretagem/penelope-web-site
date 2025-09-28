import { RouterViewModel } from '@shared/viewmodel/components/RouterViewModel'

/**
 * RouterService - Serviço singleton para navegação
 * Integra com RouterViewModel para navegação consistente
 */
class RouterService {
  constructor() {
    this.routerViewModel = RouterViewModel.getInstance()
  }

  get route() {
    return this.routerViewModel.route
  }

  navigateTo(route) {
    return this.routerViewModel.navigateTo(route)
  }

  goBack() {
    return this.routerViewModel.goBack()
  }

  addRouteChangeListener(callback) {
    this.routerViewModel.addRouteChangeListener(callback)
    return () => {
      this.routerViewModel.removeRouteChangeListener(callback)
    }
  }

  removeRouteChangeListener(callback) {
    this.routerViewModel.removeRouteChangeListener(callback)
  }

  isRouteActive(route) {
    const currentRoute = this.route

    // Caso especial para a home
    if (route === '/' && currentRoute === '/') return true

    // Para outras rotas, verifica correspondência exata primeiro
    if (route === currentRoute) return true

    // Para subrotas, verifica se a rota atual começa com a rota do item
    // mas apenas se não for a rota raiz '/'
    if (route !== '/' && currentRoute.startsWith(`${route}/`)) return true

    return false
  }
  requiresAuth(route) {
    return this.routerViewModel.requiresAuth(route)
  }

  requiresAdmin(route) {
    return this.routerViewModel.requiresAdmin(route)
  }
}

export const routerService = new RouterService()
