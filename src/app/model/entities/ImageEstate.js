import {
  IMAGE_TYPE_BY_DESCRIPTION,
  IMAGE_TYPE_BY_ID,
  IMAGE_TYPES,
} from '@constant/imageTypes'
import { ImageEstateType } from './ImageEstateType'

/**
 * Representa uma imagem de um imóvel.
 *
 * Os atributos são privados e expostos apenas via getters e setters.
 *
 * Funcionalidades:
 * - Normaliza o tipo automaticamente (aceita string, id ou ImageEstateType)
 * - Retorna tipo por ID ou descrição
 * - Determina se a imagem é capa, galeria ou planta
 * - Validação automática de tipo
 */
export class ImageEstate {
  #id
  #url
  #type // sempre será uma instância válida de ImageEstateType

  constructor({ id, url, type }) {
    this.#id = id
    this.#url = url
    this.type = type // usa setter para normalizar
  }

  // ================================
  // Getters e Setters
  // ================================
  get id() {
    return this.#id
  }

  set id(value) {
    this.#id = value
  }

  get url() {
    return this.#url
  }

  set url(value) {
    this.#url = value
  }

  get type() {
    return this.#type
  }

  /**
   * Aceita:
   * - ImageEstateType
   * - descrição ("Capa", "Galeria", "Planta")
   * - id (1, 2, 3)
   */
  set type(value) {
    if (value instanceof ImageEstateType) {
      this.#type = value
      return
    }

    // Caso venha string (ex: "Capa")
    if (typeof value === 'string') {
      const mapped = IMAGE_TYPE_BY_DESCRIPTION[value]
      if (!mapped) throw new Error(`Tipo de imagem inválido: ${value}`)
      this.#type = new ImageEstateType(mapped)
      return
    }

    // Caso venha ID (ex: 1, 2, 3)
    if (typeof value === 'number') {
      const mapped = IMAGE_TYPE_BY_ID[value]
      if (!mapped) throw new Error(`ID de tipo de imagem inválido: ${value}`)
      this.#type = new ImageEstateType(mapped)
      return
    }

    throw new Error(`Tipo de imagem inválido: ${value}`)
  }

  // ================================
  // Helpers de tipo
  // ================================
  getTypeDescription() {
    return this.#type?.description || ''
  }

  getTypeId() {
    return this.#type?.id || null
  }

  hasValidType() {
    return this.#type?.isValidType() || false
  }

  // ================================
  // Convenience Methods
  // ================================
  isCover() {
    return this.getTypeId() === IMAGE_TYPES.COVER.id
  }

  isGallery() {
    return this.getTypeId() === IMAGE_TYPES.GALLERY.id
  }

  isFloorPlan() {
    return this.getTypeId() === IMAGE_TYPES.FLOOR_PLAN.id
  }
}
