import { IMAGE_TYPE_DESCRIPTIONS } from '../../constants/imageTypes'

export class Estate {
  constructor({
    id,
    title,
    description,
    area,
    numberOfRooms,
    type,
    address,
    standAddress,
    images,
    amenities,
    imageUrls = [], // Adicionar suporte para URLs simples
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.area = area
    this.numberOfRooms = numberOfRooms
    this.type = type
    this.address = address
    this.standAddress = standAddress
    this.images = images || [] // Array of ImageEstate entities
    this.imageUrls = imageUrls || [] // Array of URL strings (para compatibilidade)
    this.amenities = amenities || []
  }

  /**
   * Retorna URLs de imagem de qualquer fonte (entities ou URLs simples)
   */
  getAllImageUrls() {
    const entityUrls = this.images.map(img => img.url).filter(Boolean)
    return [...entityUrls, ...this.imageUrls].filter(Boolean)
  }

  getCoverImage() {
    // Primeiro tenta encontrar nas entities - usando comparação com string
    const entityCover = this.images.find(img => {
      const imgType = img.type || ''
      // Check for various cover type variations
      return imgType.toLowerCase() === 'capa' ||
             imgType.toLowerCase() === 'cover' ||
             imgType === '1' // Type ID for cover
    })

    console.log('🔍 [ESTATE] Looking for cover image in:', this.images.map(img => ({ id: img.id, type: img.type, url: img.url })))
    console.log('🔍 [ESTATE] Found cover image:', entityCover)

    if (entityCover) {
      return entityCover
    }

    // Se não encontrar capa específica mas há imagens, usa a primeira
    if (this.images.length > 0) {
      console.log('🔍 [ESTATE] Using first image as cover:', this.images[0])
      return this.images[0]
    }

    // Se não encontrar e há URLs simples, usa a primeira
    if (this.imageUrls.length > 0) {
      return { url: this.imageUrls[0], type: 'Capa' }
    }

    console.log('🔍 [ESTATE] No cover image found')
    return null
  }

  getCoverImageUrl() {
    const coverImage = this.getCoverImage()
    const url = coverImage?.url
    return url || null
  }

  /**
   * Retorna todas as imagens de um tipo específico
   */
  getImagesByType(typeDescription) {
    return this.images.filter(img => {
      const imgType = img.type || ''
      return imgType.toLowerCase() === typeDescription.toLowerCase() ||
             imgType === typeDescription
    })
  }

  /**
   * Retorna imagens da galeria
   */
  getGalleryImages() {
    const entityGallery = this.images.filter(img => {
      const imgType = img.type || ''
      return imgType.toLowerCase() === 'galeria' ||
             imgType.toLowerCase() === 'gallery' ||
             imgType === '2' // Type ID for gallery
    })

    console.log('🔍 [ESTATE] Gallery images found:', entityGallery.length)

    // Se não há entities de galeria mas há URLs simples, criar objetos temporários
    if (entityGallery.length === 0 && this.imageUrls.length > 0) {
      return this.imageUrls.map((url, index) => ({
        id: `temp-${index}`,
        url,
        type: 'Galeria'
      }))
    }

    return entityGallery
  }

  /**
   * Retorna imagens de planta
   */
  getFloorPlanImages() {
    return this.getImagesByType(IMAGE_TYPE_DESCRIPTIONS.FLOOR_PLAN)
  }
}
