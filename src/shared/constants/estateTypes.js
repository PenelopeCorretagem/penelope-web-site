/**
 * Tipos de estate disponíveis no sistema (sem IDs)
 */
export const ESTATE_TYPES = {
  LANCAMENTO: { key: 'LANCAMENTO', apiValue: 'lancamento', friendlyName: 'Lançamento' },
  DISPONIVEL: { key: 'DISPONIVEL', apiValue: 'disponivel', friendlyName: 'Disponível' },
  EM_OBRAS: { key: 'EM_OBRAS', apiValue: 'emObras', friendlyName: 'Em obras' }
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
  lancamento: ESTATE_TYPES.LANCAMENTO,
  disponivel: ESTATE_TYPES.DISPONIVEL,
  emObras: ESTATE_TYPES.EM_OBRAS
}

export const ESTATE_TYPE_BY_FRIENDLY_NAME = {
  'Lançamento': ESTATE_TYPES.LANCAMENTO,
  'Disponível': ESTATE_TYPES.DISPONIVEL,
  'Em obras': ESTATE_TYPES.EM_OBRAS
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
  return ESTATE_TYPE_BY_KEY[key] || null
}

/**
 * Busca tipo pelo valor externo enviado/recebido da API.
 */
export const getEstateTypeByApiValue = (apiValue) => {
  return ESTATE_TYPE_BY_API_VALUE[apiValue] || null
}

/**
 * Busca tipo pelo nome amigável
 */
export const getEstateTypeByFriendlyName = (friendlyName) => {
  return ESTATE_TYPE_BY_FRIENDLY_NAME[friendlyName] || null
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
  LANCAMENTO: 'Lançamento',
  DISPONIVEL: 'Disponível',
  EM_OBRAS: 'Em obras'
}
