/**
 * Tipos de imagem disponíveis no sistema com seus IDs específicos
 */
export const IMAGE_TYPES = {
  COVER: { id: 1, description: 'Capa', friendlyName: 'Capa' },
  GALLERY: { id: 2, description: 'Galeria', friendlyName: 'Galeria' },
  FLOOR_PLAN: { id: 3, description: 'Planta', friendlyName: 'Planta' }
}

/**
 * Mapas para facilitar busca
 */
export const IMAGE_TYPE_BY_ID = {
  1: IMAGE_TYPES.COVER,
  2: IMAGE_TYPES.GALLERY,
  3: IMAGE_TYPES.FLOOR_PLAN
}

export const IMAGE_TYPE_BY_DESCRIPTION = {
  'Capa': IMAGE_TYPES.COVER,
  'Galeria': IMAGE_TYPES.GALLERY,
  'Planta': IMAGE_TYPES.FLOOR_PLAN
}

/**
 * Lista de todos os tipos de imagem
 */
export const IMAGE_TYPE_LIST = Object.values(IMAGE_TYPES)

/**
 * Verifica se um tipo de imagem é válido por descrição
 */
export const isValidImageType = (description) => {
  return Object.prototype.hasOwnProperty.call(IMAGE_TYPE_BY_DESCRIPTION, description)
}

/**
 * Verifica se um ID de tipo de imagem é válido
 */
export const isValidImageTypeId = (id) => {
  return Object.prototype.hasOwnProperty.call(IMAGE_TYPE_BY_ID, id)
}

/**
 * Busca tipo de imagem por ID
 */
export const getImageTypeById = (id) => {
  return IMAGE_TYPE_BY_ID[id] || null
}

/**
 * Busca tipo de imagem por descrição
 */
export const getImageTypeByDescription = (description) => {
  return IMAGE_TYPE_BY_DESCRIPTION[description] || null
}

/**
 * Constantes para fácil acesso aos IDs
 */
export const IMAGE_TYPE_IDS = {
  COVER: 1,
  GALLERY: 2,
  FLOOR_PLAN: 3
}

/**
 * Constantes para fácil acesso às descrições
 */
export const IMAGE_TYPE_DESCRIPTIONS = {
  COVER: 'Capa',
  GALLERY: 'Galeria',
  FLOOR_PLAN: 'Planta'
}
