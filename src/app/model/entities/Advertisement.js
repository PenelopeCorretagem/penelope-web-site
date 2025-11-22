export class Advertisement {
  constructor({
    id,
    active,
    emphasis,
    createdAt,
    endDate,
    creator,
    responsible,
    property,
    imageUrls = [], // Adicionar suporte para URLs simples
  }) {
    this.id = id
    this.active = active
    this.emphasis = emphasis
    this.createdAt = createdAt
    this.endDate = endDate
    this.creator = creator
    this.responsible = responsible
    this.property = property
    this.imageUrls = imageUrls || [] // Para compatibilidade com fluxo de URLs
  }

  /**
   * Retorna a imagem de capa do imóvel
   */
  getCoverImage() {
    // Primeiro tenta da property
    const propertyImage = this.property?.getCoverImage()
    if (propertyImage) {
      return propertyImage
    }

    // Se não encontrar e há URLs simples, usa a primeira
    if (this.imageUrls.length > 0) {
      return { url: this.imageUrls[0] }
    }
    return null
  }

  /**
   * Retorna a URL da imagem de capa ou null se não houver
   */
  getCoverImageUrl() {
    const coverImage = this.getCoverImage()
    const url = coverImage?.url || this.property?.getCoverImageUrl()
    return url || null
  }

  /**
   * Retorna todas as URLs de imagem disponíveis
   */
  getAllImageUrls() {
    const propertyUrls = this.property?.getAllImageUrls() || []
    return [...propertyUrls, ...this.imageUrls].filter(Boolean)
  }

  /**
   * Retorna o endereço formatado
   */
  getFormattedAddress() {
    if (!this.property?.address) return { city: '', neighborhood: '' }
    const { city, neighborhood } = this.property.address
    return { city, neighborhood }
  }

  /**
   * Retorna as características do imóvel
   */
  getFeatures() {
    if (!this.property) return []

    const features = []

    if (this.property.numberOfRooms) {
      features.push(`${this.property.numberOfRooms} dormitórios`)
    }

    if (this.property.amenities?.length > 0) {
      features.push(this.property.amenities[0].description)
    }

    if (this.property.area) {
      features.push(`${this.property.area}m²`)
    }

    return features
  }
}
