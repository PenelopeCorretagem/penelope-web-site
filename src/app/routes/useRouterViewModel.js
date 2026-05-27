import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RouterModel } from '@routes/RouterModel'
import { ROUTES } from '@constant/routes'
import { buildRoute } from '@shared/utils/routerUtil'

// Instância única do Model — criada fora do hook para sobreviver re-renders
const routerModel = RouterModel.getInstance()

/**
 * useRouter — Hook principal de roteamento.
 * Conecta o RouterModel ao React Router e expõe a API para as Views.
 */
export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [, forceUpdate] = useState(0)

  // Sincroniza rota atual no Model quando a URL muda
  useEffect(() => {
    if (location.pathname !== routerModel.getCurrentRoute()) {
      routerModel.setCurrentRoute(location.pathname)
    }
  }, [location.pathname])

  // Notifica re-render quando o Model emite mudança de rota
  useEffect(() => {
    const handleChange = () => forceUpdate(p => p + 1)
    routerModel.addListener(handleChange)
    return () => routerModel.removeListener(handleChange)
  }, [])

  // ===== Navegação =====
  const navigateTo = useCallback((route) => {
    if (!isValidRoute(route)) {
      navigate(ROUTES.NOT_FOUND.path, { replace: true })
      return
    }
    navigate(route)
  }, [navigate])

  const goBack = useCallback(() => navigate(-1), [navigate])

  // ===== Validações =====
  const isValidRoute = useCallback((route) => {
    if (route.startsWith('/verificacao-')) return true

    const allPaths = Object.values(routerModel.getAllRoutes())

    if (allPaths.includes(route)) return true

    return allPaths.some(r => {
      if (!r.includes(':')) return false
      const pattern = r.replace(/:[^/]+/g, '[^/]+')
      return new RegExp(`^${pattern}$`).test(route)
    })
  }, [])

  const isRouteActive = useCallback((route) => {
    const current = location.pathname
    if (route === '/' && current === '/') return true
    if (route === current) return true
    if (route !== '/' && current.startsWith(`${route}/`)) return true
    return false
  }, [location.pathname])

  // ===== Permissões =====
  const requiresAuth = useCallback((route) => {
    const publicRoutes = routerModel.getPublicRoutes()
    if (publicRoutes.includes(route)) return false
    if (route.startsWith('/verificacao-')) return false
    return true
  }, [])

  const requiresAdmin = useCallback((route) => {
    const adminRoutes = routerModel.getAdminOnlyRoutes()
    if (adminRoutes.includes(route)) return true
    if (route.startsWith('/admin/')) return true
    return false
  }, [])

  const calculateManagementRouteAccess = useCallback((isAuthenticated, isAdmin, isBroker, authReady) => {
    if (!authReady) return { shouldRender: false, redirectTo: null }
    if (!isAuthenticated) return { shouldRender: false, redirectTo: ROUTES.LOGIN.path }
    if (!isAdmin && !isBroker) return { shouldRender: false, redirectTo: ROUTES.UNAUTHORIZED.path }
    return { shouldRender: true, redirectTo: null }
  }, [])

  // ===== Proteções de rota =====
  const calculateProtectedRouteAccess = useCallback((isAuthenticated, authReady) => {
    if (!authReady) return { shouldRender: false, redirectTo: null }
    if (!isAuthenticated) return { shouldRender: false, redirectTo: ROUTES.LOGIN.path }
    return { shouldRender: true, redirectTo: null }
  }, [])

  const calculateAdminRouteAccess = useCallback((isAuthenticated, isAdmin, authReady) => {
    if (!authReady) return { shouldRender: false, redirectTo: null }
    if (!isAuthenticated) return { shouldRender: false, redirectTo: ROUTES.LOGIN.path }
    if (!isAdmin) return { shouldRender: false, redirectTo: ROUTES.UNAUTHORIZED.path }
    return { shouldRender: true, redirectTo: null }
  }, [])

  // ===== Utilitários =====
  const generateRoute = useCallback((routeKey, params = {}) => {
    const path = routerModel.getRoute(routeKey)
    if (!path) throw new Error(`Rota '${routeKey}' não encontrada`)
    return buildRoute(path, params)
  }, [])

  const extractParams = useCallback((routePattern, actualRoute) => {
    const patternParts = routePattern.split('/')
    const routeParts = actualRoute.split('/')
    const params = {}
    patternParts.forEach((part, i) => {
      if (part.startsWith(':')) params[part.slice(1)] = routeParts[i]
    })
    return params
  }, [])

  return {
    currentRoute: location.pathname,
    navigateTo,
    goBack,
    isValidRoute,
    isRouteActive,
    requiresAuth,
    requiresAdmin,
    calculateProtectedRouteAccess,
    calculateAdminRouteAccess,
    calculateManagementRouteAccess,
    generateRoute,
    extractParams,
    getAllRoutes: () => routerModel.getAllRoutes(),
    getMenuRoutes: () => routerModel.getMenuRoutes(),
    getUserActionRoutes: () => routerModel.getUserActionRoutes(),
    getAuthRoutes: () => routerModel.getAuthRoutes(),
    getAdminRoutes: () => routerModel.getAdminRoutes(),
  }
}

/**
 * useRouteParams — Extrai parâmetros da rota atual automaticamente.
 */
export function useRouteParams() {
  const location = useLocation()
  const { extractParams, getAllRoutes } = useRouter()

  const routePattern = (() => {
    const allRoutes = Object.values(getAllRoutes())
    for (const pattern of allRoutes) {
      if (!pattern.includes(':')) continue
      const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`)
      if (regex.test(location.pathname)) return pattern
    }
    return location.pathname
  })()

  return extractParams(routePattern, location.pathname)
}
