/**
 * Tipos de estate disponíveis no sistema (sem IDs)
 */
export const ESTATE_TYPES = {
  LANCAMENTO: { key: 'LANCAMENTO', apiValue: 'LANCAMENTO', friendlyName: 'LANÇAMENTO' },
  DISPONIVEL: { key: 'DISPONIVEL', apiValue: 'DISPONIVEL', friendlyName: 'DISPONÍVEL' },
  EM_OBRAS: { key: 'EM_OBRAS', apiValue: 'EMOBRAS', friendlyName: 'EM OBRAS' }
}

/**
 * Mapas para facilitar busca
 */
export const ESTATE_TYPE_BY_KEY = {
  LANCAMENTO: ESTATE_TYPES.LANCAMENTO,
  DISPONIVEL: ESTATE_TYPES.DISPONIVEL,
  EM_OBRAS: ESTATE_TYPES.EM_OBRAS
}

export const ESTATE_TYPE_BY_API_VALUE = {
  LANCAMENTO: ESTATE_TYPES.LANCAMENTO,
  DISPONIVEL: ESTATE_TYPES.DISPONIVEL,
  EMOBRAS: ESTATE_TYPES.EM_OBRAS
}

export const ESTATE_TYPE_BY_FRIENDLY_NAME = {
  'LANÇAMENTO': ESTATE_TYPES.LANCAMENTO,
  'DISPONÍVEL': ESTATE_TYPES.DISPONIVEL,
  'EM OBRAS': ESTATE_TYPES.EM_OBRAS
}

/**
 * Lista de todos os tipos
 */
export const ESTATE_TYPE_LIST = Object.values(ESTATE_TYPES)

/**
 * Verifica se um tipo é válido pela key
 */
export const isValidEstateType = (key) => {
  return Object.prototype.hasOwnProperty.call(ESTATE_TYPE_BY_KEY, key)
}

/**
 * Verifica se um valor externo do tipo é válido.
 */
export const isValidEstateApiValue = (apiValue) => {
  return Object.prototype.hasOwnProperty.call(ESTATE_TYPE_BY_API_VALUE, apiValue)
}

/**
 * Verifica se um friendlyName é válido
 */
export const isValidEstateFriendlyName = (friendlyName) => {
  return Object.prototype.hasOwnProperty.call(ESTATE_TYPE_BY_FRIENDLY_NAME, friendlyName)
}

/**
 * Busca tipo pelo key
 */
export const getEstateTypeByKey = (key) => {
  if (!key) return null
  const normalized = String(key).toUpperCase()
  return ESTATE_TYPE_BY_KEY[normalized] || null
}

/**
 * Busca tipo pelo valor externo enviado/recebido da API.
 */
export const getEstateTypeByApiValue = (apiValue) => {
  if (!apiValue) return null
  const normalized = String(apiValue).toUpperCase()
  return ESTATE_TYPE_BY_API_VALUE[normalized] || null
}

/**
 * Busca tipo pelo nome amigável
 */
export const getEstateTypeByFriendlyName = (friendlyName) => {
  if (!friendlyName) return null
  const normalized = String(friendlyName).toUpperCase()
  return ESTATE_TYPE_BY_FRIENDLY_NAME[normalized] || null
}

/**
 * Constantes para fácil acesso às keys
 */
export const ESTATE_TYPE_KEYS = {
  LANCAMENTO: 'LANCAMENTO',
  DISPONIVEL: 'DISPONIVEL',
  EM_OBRAS: 'EM_OBRAS'
}

/**
 * Constantes para fácil acesso aos friendly names
 */
export const ESTATE_TYPE_FRIENDLY_NAMES = {
  LANCAMENTO: 'LANÇAMENTO',
  DISPONIVEL: 'DISPONÍVEL',
  EM_OBRAS: 'EM OBRAS'
}
