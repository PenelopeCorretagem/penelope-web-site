/**
 * PropertiesModel - Modelo de dados para a página Properties
 * Contém as regras de negócio para filtragem e categorização de imóveis
 */
export class PropertiesModel {
  constructor() {
    this.lancamentos = []
    this.disponiveis = []
    this.emObras = []
    this.isLoading = false
    this.error = null
    this.appliedFilters = {}
    this.pendingFilters = {
      city: '',
      region: '',
      type: '',
      bedrooms: ''
    }
  }

  /**
   * Define as propriedades de lançamento
   */
  setLancamentos(properties) {
    this.lancamentos = properties
  }

  /**
   * Define as propriedades disponíveis
   */
  setDisponiveis(properties) {
    this.disponiveis = properties
  }

  /**
   * Define as propriedades em obras
   */
  setEmObras(properties) {
    this.emObras = properties
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
   * Define os filtros pendentes
   */
  setPendingFilters(filters) {
    this.pendingFilters = { ...filters }
  }

  /**
   * Atualiza um filtro específico pendente
   */
  updatePendingFilter(key, value) {
    this.pendingFilters[key] = value
  }

  /**
   * Aplica os filtros pendentes
   */
  applyFilters() {
    this.appliedFilters = { ...this.pendingFilters }
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
      bedrooms: property.numberOfRooms || 0,
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
   * Extrai opções únicas para os filtros
   */
  gatherFilterOptions() {
    const allProperties = [...this.lancamentos, ...this.disponiveis, ...this.emObras]

    const cities = new Set()
    const regions = new Set()
    const types = new Set(['lancamento', 'disponivel', 'em_obras'])
    const bedrooms = new Set()

    allProperties.forEach(property => {
      if (property.title) cities.add(property.title)
      if (property.subtitle) regions.add(property.subtitle)

      if (property.bedrooms) {
        const n = Number(property.bedrooms)
        const label = `${n} Dormitório${n > 1 ? 's' : ''}`
        bedrooms.add(label)
      }
    })

    return {
      cities: Array.from(cities).sort(),
      regions: Array.from(regions).sort(),
      types: [
        { value: 'lancamento', label: 'Lançamento' },
        { value: 'disponivel', label: 'Disponível' },
        { value: 'em_obras', label: 'Em Obras' }
      ],
      bedrooms: Array.from(bedrooms).sort()
    }
  }

  /**
   * Aplica filtros às propriedades
   */
  filterProperties(properties) {
    if (Object.keys(this.appliedFilters).length === 0) {
      return properties
    }

    return properties.filter(property => {
      // Filtro por cidade
      if (this.appliedFilters.city && property.title !== this.appliedFilters.city) {
        return false
      }

      // Filtro por região/bairro
      if (this.appliedFilters.region && property.subtitle !== this.appliedFilters.region) {
        return false
      }

      // Filtro por tipo
      if (this.appliedFilters.type && property.category !== this.appliedFilters.type) {
        return false
      }

      // Filtro por dormitórios
      if (this.appliedFilters.bedrooms) {
        const match = String(this.appliedFilters.bedrooms).match(/(\d+)/)
        if (match) {
          const targetBedrooms = Number(match[1])
          if (property.bedrooms !== targetBedrooms) {
            return false
          }
        }
      }

      return true
    })
  }

  /**
   * Retorna propriedades filtradas por categoria
   */
  getFilteredLancamentos() {
    return this.filterProperties(this.lancamentos)
  }

  getFilteredDisponiveis() {
    return this.filterProperties(this.disponiveis)
  }

  getFilteredEmObras() {
    return this.filterProperties(this.emObras)
  }

  /**
   * Retorna o total de resultados após filtros
   */
  getTotalFilteredResults() {
    return this.getFilteredLancamentos().length +
           this.getFilteredDisponiveis().length +
           this.getFilteredEmObras().length
  }

  /**
   * Retorna dados formatados para a View
   */
  getViewData() {
    return {
      lancamentos: this.getFilteredLancamentos(),
      disponiveis: this.getFilteredDisponiveis(),
      emObras: this.getFilteredEmObras(),
      isLoading: this.isLoading,
      error: this.error,
      appliedFilters: this.appliedFilters,
      pendingFilters: this.pendingFilters,
      totalResults: this.getTotalFilteredResults(),
      filterOptions: this.gatherFilterOptions()
    }
  }
}
