// @shared/hooks/components/useRouterViewModel.js
import { useState, useEffect } from 'react'
import { RouterViewModel } from '@shared/viewmodel/components/RouterViewModel'

// Função para obter a instância singleton
/**
 * Obtém instância singleton do RouterViewModel
 * @returns {RouterViewModel} Instância única do RouterViewModel
 */
function getRouterViewModel() {
  const routerViewModel = RouterViewModel.getInstance()

  // Configura listener do browser apenas uma vez
  if (!window.__routerListenerConfigured) {
    console.log('🔌 Configurando listener do browser (popstate)')

    window.addEventListener('popstate', () => {
      console.log('⬅️ Evento popstate detectado')
      routerViewModel.routerModel.setCurrentRoute(window.location.pathname)
    })

    window.__routerListenerConfigured = true
  }

  return routerViewModel
}

/**
 * Hook para gerenciar navegação e estado das rotas
 * @returns {Object} APIs de navegação e estado atual
 */
export function useRouter() {
  const routerViewModel = getRouterViewModel()
  const [currentRoute, setCurrentRoute] = useState(routerViewModel.route)

  useEffect(() => {
    // Sincroniza com o React Router
    const handleRouteChange = () => {
      const currentPath = window.location.pathname
      if (currentPath !== routerViewModel.route) {
        routerViewModel.routerModel.setCurrentRoute(currentPath)
        setCurrentRoute(currentPath)
      }
    }

    // Escuta mudanças de rota do React Router
    window.addEventListener('popstate', handleRouteChange)

    // Configura estado inicial
    handleRouteChange()

    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

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
