import { IMAGE_TYPE_IDS, IMAGE_TYPE_DESCRIPTIONS, getImageTypeById } from '../../constants/imageTypes'

export class ImageEstateType {
  constructor({
    id,
    description,
    images,
  }) {
    this.id = id
    this.description = description
    this.images = images || [] // Array of ImageEstate
  }

  /**
   * Verifica se é tipo de capa
   */
  isCoverType() {
    return this.id === IMAGE_TYPE_IDS.COVER || this.description === IMAGE_TYPE_DESCRIPTIONS.COVER
  }

  /**
   * Verifica se é tipo de galeria
   */
  isGalleryType() {
    return this.id === IMAGE_TYPE_IDS.GALLERY || this.description === IMAGE_TYPE_DESCRIPTIONS.GALLERY
  }

  /**
   * Verifica se é tipo de planta
   */
  isFloorPlanType() {
    return this.id === IMAGE_TYPE_IDS.FLOOR_PLAN || this.description === IMAGE_TYPE_DESCRIPTIONS.FLOOR_PLAN
  }

  /**
   * Verifica se o tipo é válido
   */
  isValidType() {
    const typeInfo = getImageTypeById(this.id)
    return typeInfo !== null && typeInfo.description === this.description
  }

  /**
   * Retorna as informações completas do tipo
   */
  getTypeInfo() {
    return getImageTypeById(this.id)
  }

  /**
   * Métodos estáticos para criar tipos pré-definidos
   */
  static createCoverType() {
    return new ImageEstateType({
      id: IMAGE_TYPE_IDS.COVER,
      description: IMAGE_TYPE_DESCRIPTIONS.COVER,
    })
  }

  static createGalleryType() {
    return new ImageEstateType({
      id: IMAGE_TYPE_IDS.GALLERY,
      description: IMAGE_TYPE_DESCRIPTIONS.GALLERY,
    })
  }

  static createFloorPlanType() {
    return new ImageEstateType({
      id: IMAGE_TYPE_IDS.FLOOR_PLAN,
      description: IMAGE_TYPE_DESCRIPTIONS.FLOOR_PLAN,
    })
  }
}
