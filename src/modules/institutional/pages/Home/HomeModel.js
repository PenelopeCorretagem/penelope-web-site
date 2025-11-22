/**
 * HomeModel - Modelo de dados para a página Home
 * Contém as regras de negócio para seleção de imóveis em destaque e lançamentos
 */
export class HomeModel {
  constructor() {
    this.featuredProperty = null
    this.launchProperties = []
    this.isLoading = false
    this.error = null
  }

  /**
   * Define a propriedade em destaque
   */
  setFeaturedProperty(property) {
    this.featuredProperty = property
  }

  /**
   * Define as propriedades de lançamento
   */
  setLaunchProperties(properties) {
    this.launchProperties = properties
  }

  /**
   * Define o estado de carregamento
   */
  setLoading(loading) {
    this.isLoading = loading
  }

  /**
   * Define o erro
   */
  setError(error) {
    this.error = error
  }

  /**
   * Seleciona a propriedade em destaque baseada nas regras de negócio:
   * 1. Propriedade com emphasis = true
   * 2. Se não houver, a mais recente (maior ID)
   * 3. Se não houver lançamentos, a primeira disponível
   */
  selectFeaturedProperty(advertisements) {
    if (!Array.isArray(advertisements) || advertisements.length === 0) {
      return null
    }

    // Primeiro, tenta encontrar uma propriedade com emphasis
    const emphasizedProperty = advertisements.find(ad => ad.emphasis === true)
    if (emphasizedProperty) {
      return emphasizedProperty
    }

    // Se não encontrar, pega a mais recente (maior ID)
    const sortedByDate = [...advertisements].sort((a, b) => {
      // Primeiro por data de criação, depois por ID
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)

      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime() // Mais recente primeiro
      }

      return (b.id || 0) - (a.id || 0) // Maior ID primeiro
    })

    return sortedByDate[0] || null
  }

  /**
   * Filtra apenas propriedades de lançamento
   */
  filterLaunchProperties(advertisements) {
    if (!Array.isArray(advertisements)) {
      return []
    }

    return advertisements.filter(ad => {
      const propertyType = ad.property?.type?.toLowerCase()
      return propertyType === 'lancamento'
    })
  }

  /**
   * Converte uma entidade Advertisement para o formato esperado pelo PropertyCard
   */
  mapAdvertisementToPropertyCard(advertisement) {
    if (!advertisement) return null

    const property = advertisement.property || {}
    const address = property.address || {}

    // Busca imagem de capa ou primeira imagem disponível
    const coverImage = this._findCoverImage(property.images || [])

    // Extrai características do imóvel
    const differences = this._extractPropertyFeatures(property)

    return {
      id: advertisement.id,
      category: property.type?.toLowerCase() || 'disponivel',
      title: address.city || property.title || 'Cidade não informada',
      subtitle: address.neighborhood || 'Bairro não informado',
      description: property.description || 'Descrição não disponível',
      differences,
      imageLink: coverImage,
      hasImage: !!coverImage,
      hasLabel: true,
      hasButton: true,
      hasDifference: differences.length > 0,
      hasShadow: true,
      hasHoverEffect: true
    }
  }

  /**
   * Encontra a imagem de capa ou retorna a primeira disponível
   */
  _findCoverImage(images) {
    if (!Array.isArray(images) || images.length === 0) {
      return ''
    }

    // Procura por imagem de capa
    const coverImage = images.find(img => {
      const type = String(img.type || '').toLowerCase()
      return type === 'capa' || type === 'cover' || type === '1'
    })

    if (coverImage?.url) {
      return coverImage.url
    }

    // Se não encontrar capa, usa a primeira imagem
    return images[0]?.url || ''
  }

  /**
   * Extrai características principais do imóvel
   */
  _extractPropertyFeatures(property) {
    const features = []

    // Número de quartos
    if (property.numberOfRooms) {
      const rooms = Number(property.numberOfRooms)
      if (rooms === 1) {
        features.push('1 dormitório')
      } else if (rooms > 1) {
        features.push(`${rooms} dormitórios`)
      }
    }

    // Área
    if (property.area) {
      const area = Number(property.area)
      if (area > 0) {
        features.push(`${area}m²`)
      }
    }

    // Primeira amenidade (se existir)
    if (property.amenities && property.amenities.length > 0) {
      features.push(property.amenities[0].description)
    }

    // Limita a 3 características para não sobrecarregar o card
    return features.slice(0, 3)
  }

  /**
   * Retorna dados formatados para a View
   */
  getViewData() {
    return {
      featuredProperty: this.featuredProperty,
      launchProperties: this.launchProperties,
      isLoading: this.isLoading,
      error: this.error,
      hasFeaturedProperty: !!this.featuredProperty,
      hasLaunchProperties: this.launchProperties.length > 0
    }
  }
}
