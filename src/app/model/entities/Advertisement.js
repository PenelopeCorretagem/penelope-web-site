export class Advertisement {
  constructor({
    id,
    title,
    description,
    advertisementType,
    status,
    property,
    createdAt,
    updatedAt,
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.advertisementType = advertisementType
    this.status = status
    this.property = property
    this.createdAt = createdAt
    this.updatedAt = updatedAt
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
    if (!this.property?.address) return ''
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
