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
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.area = area
    this.numberOfRooms = numberOfRooms
    this.type = type
    this.address = address
    this.standAddress = standAddress
    this.images = images || []
    this.amenities = amenities || []
  }

  getCoverImage() {
    return this.images.find(img => img.type === 'Capa')
  }

  getCoverImageUrl() {
    const coverImage = this.getCoverImage()
    return coverImage?.url || 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp'
  }
}
