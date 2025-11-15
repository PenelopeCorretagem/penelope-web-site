/**
 * Modelo de dados para configuração de propriedade
 */
export class PropertyConfigModel {
  constructor(propertyData = null) {
    console.log('PropertyConfigModel constructor - input:', propertyData)

    this.id = propertyData?.id || null
    this.propertyTitle = propertyData?.property?.title || propertyData?.property?.address?.city || ''
    this.displayEndDate = propertyData?.endDate ? this._formatDate(propertyData.endDate) : ''
    this.cardDescription = propertyData?.property?.address?.neighborhood || ''
    this.propertyDescription = propertyData?.property?.description || ''

    this.differentials = propertyData?.property?.amenities?.map(a =>
      this._normalizeDifferential(a.description)
    ) || []

    // Endereço do imóvel
    this.address = {
      cep: propertyData?.property?.address?.cep || '',
      number: propertyData?.property?.address?.number || '',
      region: propertyData?.property?.address?.region || '',
      street: propertyData?.property?.address?.street || '',
      neighborhood: propertyData?.property?.address?.neighborhood || '',
      city: propertyData?.property?.address?.city || '',
      state: propertyData?.property?.address?.uf || ''
    }

    // Endereço do stand
    this.standAddress = {
      cep: propertyData?.property?.addressStand?.cep || '',
      number: propertyData?.property?.addressStand?.number || '',
      region: propertyData?.property?.addressStand?.region || '',
      street: propertyData?.property?.addressStand?.street || '',
      neighborhood: propertyData?.property?.addressStand?.neighborhood || '',
      city: propertyData?.property?.addressStand?.city || '',
      state: propertyData?.property?.addressStand?.uf || ''
    }

    this.enableStandAddress = propertyData?.property?.addressStand ? ['enabled'] : []

    // Extrai as imagens da API organizadas por ID
    const images = propertyData?.property?.images || []
    this.images = {
      video: this._createFilePreview(this._extractImageUrl(images, 'Video'), 'Video'),
      cover: this._createFilePreview(this._extractImageUrl(images, 'Capa'), 'Capa'),
      gallery: this._extractAndCreatePreviews(images, 'Galeria'),
      floorPlans: this._extractAndCreatePreviews(images, 'Planta')
    }
  }

  /**
   * Cria um PropertyConfigModel a partir de uma entidade Advertisement
   */
  static fromAdvertisementEntity(advertisementEntity) {
    if (!advertisementEntity) {
      return new PropertyConfigModel()
    }

    // Converte a entidade Advertisement para o formato esperado
    const propertyData = {
      id: advertisementEntity.id,
      endDate: advertisementEntity.createdAt,
      property: advertisementEntity.property
    }

    return new PropertyConfigModel(propertyData)
  }

  /**
   * Extrai URL de uma única imagem por tipo
   */
  _extractImageUrl(images, type) {
    const image = images.find(img => img.type === type)
    return image?.url || ''
  }

  /**
   * Extrai imagens de um tipo e cria previews numeradas
   */
  _extractAndCreatePreviews(images, type) {
    return images
      .filter(img => img.type === type)
      .sort((a, b) => a.id - b.id) // Ordena por ID
      .map((img, index) => this._createFilePreview(img.url, type, index + 1))
      .filter(Boolean)
  }

  /**
   * Cria um objeto File-like para preview de URL
   */
  _createFilePreview(url, type, index = null) {
    if (!url) return null

    // Cria nome descritivo baseado no tipo e índice
    const fileName = this._generateFileName(type, index)

    return {
      preview: url,
      name: fileName,
      type: type === 'Video' ? 'video/mp4' : 'image/jpeg',
      isExisting: true,
      url: url
    }
  }

  /**
   * Gera nome do arquivo baseado no tipo e índice
   */
  _generateFileName(type, index = null) {
    const typeNames = {
      'Video': 'Vídeo',
      'Capa': 'Capa',
      'Galeria': 'Galeria',
      'Planta': 'Planta'
    }

    const baseName = typeNames[type] || type

    if (index !== null) {
      return `${baseName} ${index}`
    }

    return baseName
  }

  /**
   * Normaliza o nome do diferencial para corresponder aos valores do checkbox
   */
  _normalizeDifferential(name) {
    const map = {
      'Piscina': 'piscina',
      'Academia': 'academia',
      'Churrasqueira': 'churrasqueira',
      'Playground': 'playground',
      'Salão de Festas': 'salao_festas',
      'Salao de Festas': 'salao_festas',
      'Garagem': 'garagem',
      'Espaço Gourmet': 'espaco_gourmet',
      'Espaco Gourmet': 'espaco_gourmet',
      'Pet Place': 'pet_place'
    }
    return map[name] || name.toLowerCase().replace(/\s+/g, '_')
  }

  /**
   * Formata data para o formato do input date (YYYY-MM-DD)
   */
  _formatDate(dateString) {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (e) {
      console.error('Erro ao formatar data:', e)
      return ''
    }
  }

  /**
   * Converte o modelo para formato de formulário
   */
  toFormData() {
    return {
      propertyTitle: this.propertyTitle,
      displayEndDate: this.displayEndDate,
      cardDescription: this.cardDescription,
      propertyDescription: this.propertyDescription,
      differentials: this.differentials,
      cep: this.address.cep,
      number: this.address.number,
      region: this.address.region,
      street: this.address.street,
      neighborhood: this.address.neighborhood,
      city: this.address.city,
      state: this.address.state,
      standCep: this.standAddress.cep,
      standNumber: this.standAddress.number,
      standRegion: this.standAddress.region,
      standStreet: this.standAddress.street,
      standNeighborhood: this.standAddress.neighborhood,
      standCity: this.standAddress.city,
      standState: this.standAddress.state,
      enableStandAddress: this.enableStandAddress,
      video: this.images.video,
      cover: this.images.cover,
      gallery: this.images.gallery,
      floorPlans: this.images.floorPlans
    }
  }

  /**
   * Verifica se é um novo registro
   */
  isNew() {
    return this.id === null
  }
}
