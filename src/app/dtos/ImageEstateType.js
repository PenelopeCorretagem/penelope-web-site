import {
  IMAGE_TYPES,
  IMAGE_TYPE_BY_ID,
  IMAGE_TYPE_BY_DESCRIPTION,
  IMAGE_TYPE_IDS
} from '@constant/imageTypes'

/**
 * Representa o tipo de uma imagem de imóvel (Capa, Galeria, Planta).
 *
 * Esta classe garante:
 * - Campos privados (#id, #description)
 * - Somente leitura via getters
 * - Normalização automática (aceita string, id, objeto ou IMAGE_TYPES)
 * - Validação de tipo contra tabela global IMAGE_TYPES
 */
export class ImageEstateType {
  #id
  #description

  /**
   * Aceita como entrada:
   * - IMAGE_TYPES.COVER | GALLERY | FLOOR_PLAN
   * - descrição ("Capa")
   * - id (1, 2, 3)
   * - objeto com { id, description }
   */
  constructor(typeInput) {
    const normalized = this.#normalizeType(typeInput)

    if (!normalized) {
      throw new Error(`Tipo de imagem inválido: ${JSON.stringify(typeInput)}`)
    }

    this.#id = normalized.id
    this.#description = normalized.description
  }

  // ===============================================
  // =              NORMALIZAÇÃO                   =
  // ===============================================
  #normalizeType(typeInput) {
    if (!typeInput) return null

    // 1. Se for instância da própria classe
    if (typeInput instanceof ImageEstateType) {
      return { id: typeInput.id, description: typeInput.description }
    }

    // 2. Se for string ("Capa", "Galeria", "Planta")
    if (typeof typeInput === 'string') {
      return IMAGE_TYPE_BY_DESCRIPTION[typeInput] || null
    }

    // 3. Se for número (1, 2, 3)
    if (typeof typeInput === 'number') {
      return IMAGE_TYPE_BY_ID[typeInput] || null
    }

    // 4. Se for um objeto com id/description
    if (typeof typeInput === 'object' && typeInput.id && typeInput.description) {
      return IMAGE_TYPES[typeInput.description?.toUpperCase()] || typeInput
    }

    return null
  }

  // ===============================================
  // =                    GETTERS                   =
  // ===============================================
  get id() {
    return this.#id
  }

  get description() {
    return this.#description
  }

  // ===============================================
  // =                   VALIDATIONS                =
  // ===============================================
  isValidType() {
    return Object.values(IMAGE_TYPES).some(
      t => t.id === this.#id && t.description === this.#description
    )
  }

  // ===============================================
  // =               TYPE CHECKERS                  =
  // ===============================================
  isCoverType() {
    return this.#id === IMAGE_TYPE_IDS.COVER
  }

  isGalleryType() {
    return this.#id === IMAGE_TYPE_IDS.GALLERY
  }

  isFloorPlanType() {
    return this.#id === IMAGE_TYPE_IDS.FLOOR_PLAN
  }

  // ===============================================
  // =              FACTORY METHODS                 =
  // ===============================================
  static createCoverType() {
    return new ImageEstateType(IMAGE_TYPES.COVER)
  }

  static createGalleryType() {
    return new ImageEstateType(IMAGE_TYPES.GALLERY)
  }

  static createFloorPlanType() {
    return new ImageEstateType(IMAGE_TYPES.FLOOR_PLAN)
  }
}
