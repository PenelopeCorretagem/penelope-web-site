import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RouterModel } from '@routes/RouterModel'

/**
 * RouterViewModel - Lógica de apresentação do Router (Camada de Apresentação/Lógica)
 *
 * RESPONSABILIDADES:
 * - Gerenciar navegação (integração com React Router)
 * - Validar permissões de rotas
 * - Calcular proteções (auth, admin)
 * - Validar rotas antes de navegar
 * - Extrair parâmetros de rotas
 * - Expor API para Views
 *
 * INTEGRAÇÕES:
 * - React Router (useNavigate, useLocation)
 * - RouterModel (dados)
 */
class RouterViewModel {
  static instance = null

  constructor() {
    if (RouterViewModel.instance) {
      return RouterViewModel.instance
    }

    this.routerModel = RouterModel.getInstance()
    this.navigate = null

    RouterViewModel.instance = this
  }

  static getInstance() {
    if (!RouterViewModel.instance) {
      RouterViewModel.instance = new RouterViewModel()
    }
    return RouterViewModel.instance
  }

  // ===== Injeção de Dependências =====
  setNavigate(navigateFn) {
    this.navigate = navigateFn
  }

  // ===== Lógica de Navegação =====
  navigateTo(route) {
    if (!this.navigate) {
      console.error('Navigate not initialized')
      return
    }

    if (!this.isValidRoute(route)) {
      this.navigate(this.routerModel.getRoute('NOT_FOUND'), { replace: true })
      this.routerModel.setCurrentRoute(this.routerModel.getRoute('NOT_FOUND'))
      return
    }

    this.navigate(route)
    this.routerModel.setCurrentRoute(route)
  }

  goBack() {
    if (!this.navigate) {
      console.error('Navigate not initialized')
      return
    }
    this.navigate(-1)
  }

  // ===== Validações de Rota =====
  isValidRoute(route) {
    const allRoutes = Object.values(this.routerModel.getAllRoutes())

    // Caso especial: verificação dinâmica (tokens)
    if (route.startsWith('/verificacao-')) {
      return true
    }

    // Verifica rota exata
    if (allRoutes.includes(route)) {
      return true
    }

    // Verifica rotas com parâmetros
    return allRoutes.some(r => {
      if (r.includes(':')) {
        const pattern = r.replace(/:[^/]+/g, '[^/]+')
        const regex = new RegExp(`^${pattern}$`)
        return regex.test(route)
      }
      return false
    })
  }

  isRouteActive(route, currentRoute) {
    if (route === '/' && currentRoute === '/') return true
    if (route === currentRoute) return true
    if (route !== '/' && currentRoute.startsWith(`${route}/`)) return true
    return false
  }

  // ===== Lógica de Permissões =====
  requiresAuth(route) {
    const publicRoutes = this.routerModel.getPublicRoutes()

    // Verifica rota exata
    if (publicRoutes.includes(route)) {
      return false
    }

    // Verifica padrões dinâmicos
    if (route.startsWith('/verificacao-')) {
      return false
    }

    return true
  }

  requiresAdmin(route) {
    const adminRoutes = this.routerModel.getAdminRequiredRoutes()

    // Verifica rota exata
    if (adminRoutes.includes(route)) {
      return true
    }

    // Verifica se começa com /admin/
    if (route.startsWith('/admin/')) {
      return true
    }

    return false
  }

  /**
   * Calcula proteção de rota autenticada
   */
  calculateProtectedRouteAccess(isAuthenticated, authReady) {
    if (!authReady) {
      return { shouldRender: false, redirectTo: null }
    }

    if (!isAuthenticated) {
      return { shouldRender: false, redirectTo: this.routerModel.getRoute('LOGIN') }
    }

    return { shouldRender: true, redirectTo: null }
  }

  /**
   * Calcula proteção de rota admin
   */
  calculateAdminRouteAccess(isAuthenticated, isAdmin, authReady) {
    if (!authReady) {
      return { shouldRender: false, redirectTo: null }
    }

    if (!isAuthenticated) {
      return { shouldRender: false, redirectTo: this.routerModel.getRoute('LOGIN') }
    }

    if (!isAdmin) {
      return { shouldRender: false, redirectTo: this.routerModel.getRoute('UNAUTHORIZED') }
    }

    return { shouldRender: true, redirectTo: null }
  }

  // ===== Utilitários de Rotas =====
  generateRoute(routeName, params = {}) {
    let route = this.routerModel.getRoute(routeName)

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

  // ===== Listeners =====
  addRouteChangeListener(callback) {
    this.routerModel.addListener(callback)
  }

  removeRouteChangeListener(callback) {
    this.routerModel.removeListener(callback)
  }

  // ===== Getters =====
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

/**
 * useRouter - Hook principal para componentes React
 */
export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [routerViewModel] = useState(() => RouterViewModel.getInstance())

  useEffect(() => {
    routerViewModel.setNavigate(navigate)
  }, [navigate, routerViewModel])

  useEffect(() => {
    const currentPath = location.pathname
    const modelRoute = routerViewModel.routerModel.getCurrentRoute()

    if (currentPath !== modelRoute) {
      routerViewModel.routerModel.setCurrentRoute(currentPath)
    }
  }, [location.pathname, routerViewModel])

  const navigateTo = useCallback((route) => {
    routerViewModel.navigateTo(route)
  }, [routerViewModel])

  const goBack = useCallback(() => {
    routerViewModel.goBack()
  }, [routerViewModel])

  const isRouteActive = useCallback((route) => {
    return routerViewModel.isRouteActive(route, location.pathname)
  }, [routerViewModel, location.pathname])

  const requiresAuth = useCallback((route) => {
    return routerViewModel.requiresAuth(route)
  }, [routerViewModel])

  const requiresAdmin = useCallback((route) => {
    return routerViewModel.requiresAdmin(route)
  }, [routerViewModel])

  const calculateProtectedRouteAccess = useCallback((isAuth, authReady) => {
    return routerViewModel.calculateProtectedRouteAccess(isAuth, authReady)
  }, [routerViewModel])

  const calculateAdminRouteAccess = useCallback((isAuth, isAdmin, authReady) => {
    return routerViewModel.calculateAdminRouteAccess(isAuth, isAdmin, authReady)
  }, [routerViewModel])

  const generateRoute = useCallback((name, params) => {
    return routerViewModel.generateRoute(name, params)
  }, [routerViewModel])

  const extractParams = useCallback((pattern, route) => {
    return routerViewModel.extractParams(pattern, route)
  }, [routerViewModel])

  return {
    currentRoute: location.pathname,
    navigateTo,
    goBack,
    isRouteActive,
    requiresAuth,
    requiresAdmin,
    calculateProtectedRouteAccess,
    calculateAdminRouteAccess,
    generateRoute,
    extractParams,
    getAllRoutes: useCallback(() => routerViewModel.getAllRoutes(), [routerViewModel]),
    getMenuRoutes: useCallback(() => routerViewModel.getMenuRoutes(), [routerViewModel]),
    getUserActionRoutes: useCallback(() => routerViewModel.getUserActionRoutes(), [routerViewModel]),
    getAuthRoutes: useCallback(() => routerViewModel.getAuthRoutes(), [routerViewModel]),
    getAdminRoutes: useCallback(() => routerViewModel.getAdminRoutes(), [routerViewModel]),
  }
}

/**
 * useRouteParams - Extrai parâmetros da rota atual
 */
export function useRouteParams() {
  const location = useLocation()
  const { extractParams, getAllRoutes } = useRouter()

  const findRoutePattern = useCallback(() => {
    const allRoutes = getAllRoutes()
    const currentRoute = location.pathname

    for (const routePattern of Object.values(allRoutes)) {
      if (routePattern.includes(':')) {
        const pattern = routePattern.replace(/:[^/]+/g, '[^/]+')
        const regex = new RegExp(`^${pattern}$`)
        if (regex.test(currentRoute)) {
          return routePattern
        }
      }
    }
    return currentRoute
  }, [location.pathname, getAllRoutes])

  const routePattern = findRoutePattern()
  const params = extractParams(routePattern, location.pathname)

  return params
}

export { RouterViewModel }
