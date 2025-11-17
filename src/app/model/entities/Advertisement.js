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
  }) {
    this.id = id
    this.active = active
    this.emphasis = emphasis
    this.createdAt = createdAt
    this.endDate = endDate
    this.creator = creator
    this.responsible = responsible
    this.property = property
  }

  /**
   * Retorna a imagem de capa do imóvel
   */
  getCoverImage() {
    if (!this.property?.images) return null
    return this.property.images.find(img => img.type === 'Capa')
  }

  /**
   * Retorna a URL da imagem de capa ou uma imagem padrão
   */
  getCoverImageUrl() {
    const coverImage = this.getCoverImage()
    return coverImage?.url || 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp'
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
