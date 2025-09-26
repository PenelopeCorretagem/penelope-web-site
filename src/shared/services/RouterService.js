import { RouterViewModel } from '../viewmodel/components/RouterViewModel'

/**
 * RouterService - Camada de serviço para gerenciamento de rotas
 * Integra com RouterViewModel e fornece uma API simplificada
 * Implementa padrão Observer para notificação de mudanças
 */
class RouterService {
  constructor() {
    this.routerViewModel = RouterViewModel.getInstance()
    this._listeners = []
    this._previousRoute = null

    // Escuta mudanças do RouterViewModel e repassa para os listeners do service
    this.routerViewModel.addRouteChangeListener(({ route, previous }) => {
      this._listeners.forEach(listener => {
        listener({ route, previous: previous || this._previousRoute })
      })
      this._previousRoute = route
    })
  }

  /**
   * Obtém a rota atual da aplicação
   * @returns {string} Rota atual
   */
  get route() {
    return this.routerViewModel.route
  }

  /**
   * Navega para uma nova rota
   * @param {string} route - Rota de destino
   * @returns {Object} Resultado da navegação
   */
  navigateTo(route) {
    try {
      this.routerViewModel.navigateTo(route)
      return { success: true, route }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Retorna para a rota anterior
   * @returns {Object} Resultado da operação
   */
  goBack() {
    try {
      this.routerViewModel.goBack()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Adiciona um listener para mudanças de rota
   * @param {Function} callback - Função a ser chamada quando a rota mudar
   * @returns {Function} Função para remover o listener
   */
  addRouteChangeListener(callback) {
    this._listeners.push(callback)

    // Retorna função para remover o listener
    return () => {
      this._listeners = this._listeners.filter(
        listener => listener !== callback
      )
    }
  }

  /**
   * Remove um listener específico
   * @param {Function} callback - Listener a ser removido
   */
  removeRouteChangeListener(callback) {
    this._listeners = this._listeners.filter(listener => listener !== callback)
  }

  /**
   * Verifica se uma rota está ativa
   * @param {string} route - Rota a ser verificada
   * @returns {boolean} Estado de ativação da rota
   */
  isRouteActive(route) {
    return this.routerViewModel.isRouteActive(route)
  }

  /**
   * Verifica se uma rota requer autenticação
   * @param {string} route - Rota a ser verificada
   * @returns {boolean} Se requer autenticação
   */
  requiresAuth(route) {
    return this.routerViewModel.requiresAuth(route)
  }

  /**
   * Verifica se uma rota requer privilégios de admin
   * @param {string} route - Rota a ser verificada
   * @returns {boolean} Se requer privilégios de admin
   */
  requiresAdmin(route) {
    return this.routerViewModel.requiresAdmin(route)
  }

  /**
   * Extrai parâmetros dinâmicos de uma rota
   * @param {string} routePattern - Padrão da rota
   * @param {string} actualRoute - Rota atual
   * @returns {Object} Parâmetros extraídos
   */
  extractParams(routePattern, actualRoute) {
    return this.routerViewModel.extractParams(routePattern, actualRoute)
  }

  /**
   * Obtém todas as rotas registradas
   * @returns {Object} Mapa de rotas
   */
  getAllRoutes() {
    return this.routerViewModel.getAllRoutes()
  }
}

// Exporta instância única do serviço
export const routerService = new RouterService()
