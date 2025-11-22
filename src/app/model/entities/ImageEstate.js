export class ImageEstate {
  constructor({
    id,
    url,
    type,
    estate,
  }) {
    this.id = id
    this.url = url
    this.type = type // ImageEstateType entity ou string direta
    this.estate = estate // Estate entity reference
  }

  /**
   * Verifica se é imagem de capa
   */
  isCover() {
    const description = this.getTypeDescription()
    return description === 'Capa'
  }

  /**
   * Verifica se é imagem de galeria
   */
  isGallery() {
    const description = this.getTypeDescription()
    return description === 'Galeria'
  }

  /**
   * Verifica se é imagem de planta
   */
  isFloorPlan() {
    const description = this.getTypeDescription()
    return description === 'Planta'
  }

  /**
   * Retorna a descrição do tipo da imagem
   */
  getTypeDescription() {
    if (typeof this.type === 'string') {
      return this.type
    }
    return this.type?.description || ''
  }

  /**
   * Retorna o ID do tipo da imagem
   */
  getTypeId() {
    if (typeof this.type === 'string') {
      const typeMap = {
        'Capa': 1,
        'Galeria': 2,
        'Planta': 3
      }
      return typeMap[this.type] || null
    }
    return this.type?.id || null
  }

  /**
   * Verifica se a imagem tem um tipo válido
   */
  hasValidType() {
    return this.type?.isValidType() || false
  }
}
