import { ROUTES } from '@constant/routes'

/**
 * Constrói uma rota substituindo parâmetros de caminho.
 */
export const buildRoute = (routePath, params = {}) => {
  if (!routePath) return null

  let result = routePath
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value))
  })

  return result
}

/**
 * Retorna o caminho da rota a partir da chave da constante ROUTES.
 */
export const getRoutePath = (routeKey) => ROUTES?.[routeKey]?.path || null

/**
 * Gera a rota final a partir da chave da rota e parâmetros.
 */
export const generateRoute = (routeKey, params = {}) => {
  const routePath = getRoutePath(routeKey)
  return buildRoute(routePath, params)
}
