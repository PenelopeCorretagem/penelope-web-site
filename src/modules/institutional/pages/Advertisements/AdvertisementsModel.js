/**
 * @summary
 * Modelo responsável por gerenciar os dados, filtros e regras de negócio
 * da página de Propriedades.
 *
 * Esta classe controla:
 * - Conjuntos de imóveis separados por categoria:
 *   • Lançamentos
 *   • Disponíveis
 *   • Em obras
 * - Estado de carregamento e erros.
 * - Filtros pendentes (em edição) e filtros aplicados.
 * - Métodos utilitários para gerar opções únicas para combobox/filtros.
 * - Lógica de filtragem de imóveis conforme filtros ativos.
 *
 * Em resumo:
 * Esta classe concentra toda a lógica de negócio da tela: estados,
 * transformações e filtros sobre os imóveis.
 */
export class AdvertisementsModel {
  #launchAdvertisements = []
  #availableAdvertisements = []
  #underConstructionAdvertisements = []
  #isLoading = false
  #error = null

  // Cache para evitar recriação desnecessária de objetos
  #cachedUniqueCities = null
  #citiesVersion = 0
  #cachedFilteredResults = new Map()

  // Getters
  get lancamentos() {
    return this.#launchAdvertisements
  }

  get disponiveis() {
    return this.#availableAdvertisements
  }

  get emObras() {
    return this.#underConstructionAdvertisements
  }

  get isLoading() {
    return this.#isLoading
  }

  get error() {
    return this.#error
  }

  // Setters
  setLancamentos(advertisements) {
    const newAdvertisements = Array.isArray(advertisements) ? advertisements : []
    if (JSON.stringify(this.#launchAdvertisements) !== JSON.stringify(newAdvertisements)) {
      this.#launchAdvertisements = newAdvertisements
      this.#invalidateCache()
    }
  }

  setDisponiveis(advertisements) {
    const newAdvertisements = Array.isArray(advertisements) ? advertisements : []
    if (JSON.stringify(this.#availableAdvertisements) !== JSON.stringify(newAdvertisements)) {
      this.#availableAdvertisements = newAdvertisements
      this.#invalidateCache()
    }
  }

  setEmObras(advertisements) {
    const newAdvertisements = Array.isArray(advertisements) ? advertisements : []
    if (JSON.stringify(this.#underConstructionAdvertisements) !== JSON.stringify(newAdvertisements)) {
      this.#underConstructionAdvertisements = newAdvertisements
      this.#invalidateCache()
    }
  }

  setLoading(value) {
    this.#isLoading = Boolean(value)
  }

  setError(value) {
    this.#error = value ?? null
  }

  // Invalida o cache quando os dados mudam
  #invalidateCache() {
    this.#cachedUniqueCities = null
    this.#citiesVersion++
    this.#cachedFilteredResults.clear()
  }

  // Retorna todas as propriedades combinadas
  getAllAdvertisements() {
    return [
      ...this.#launchAdvertisements,
      ...this.#availableAdvertisements,
      ...this.#underConstructionAdvertisements
    ]
  }

  // Extrai cidades únicas de todas as propriedades (com cache)
  getUniqueCities() {
    if (this.#cachedUniqueCities === null) {
      const allProps = this.getAllAdvertisements()
      const cities = new Set()

      allProps.forEach(property => {
        if (property.estate.address?.city) {
          cities.add(property.estate.address.city)
        }
      })

      this.#cachedUniqueCities = Array.from(cities).sort()
    }

    return this.#cachedUniqueCities
  }

  // Filtra propriedades com base no modelo de filtros
  filterAdvertisements(advertisements, filterModel) {
    if (!filterModel) return advertisements

    let filtered = [...advertisements]

    // Filtro de busca
    if (filterModel.searchTerm?.trim()) {
      const searchLower = filterModel.searchTerm.toLowerCase()
      filtered = filtered.filter(property =>
        property.estate.title?.toLowerCase().includes(searchLower)
        || property.estate.subtitle?.toLowerCase().includes(searchLower)
        || property.estate.description?.toLowerCase().includes(searchLower)
        || property.estate.address.city?.toLowerCase().includes(searchLower)
        || property.estate.address.region?.toLowerCase().includes(searchLower)
        || property.estate.type.friendlyName?.toLowerCase().includes(searchLower)
        || property.estate.address.uf?.toLowerCase().includes(searchLower)
        || property.estate.amenities.some(diff => diff.description.toLowerCase().includes(searchLower))
      )
    }

    // Filtro de cidade - FIXED: verificar também 'TODAS'
    const cityFilter = filterModel.getFilter('cityFilter')
    if (cityFilter && cityFilter !== 'TODAS' && cityFilter !== 'ALL') {
      filtered = filtered.filter(property => property.estate.address.city === cityFilter)
    }

    // Filtro de região (pode ser implementado se houver dados de região)
    const regionFilter = filterModel.getFilter('regionFilter')
    if (regionFilter && regionFilter !== 'TODAS' && regionFilter !== 'ALL') {
      filtered = filtered.filter(property => property.estate.address.region === regionFilter)
    }

    // Ordenação
    if (filterModel.sortOrder === 'asc') {
      filtered = filtered.sort((a, b) =>
        (a.estate.title || '').localeCompare(b.estate.title || '', 'pt-BR')
      )
    } else if (filterModel.sortOrder === 'desc') {
      filtered = filtered.sort((a, b) =>
        (b.estate.title || '').localeCompare(a.estate.title || '', 'pt-BR')
      )
    }

    return filtered
  }

  // Aplica filtros por tipo de propriedade (com cache)
  getFilteredAdvertisementsByType(filterModel) {
    const cacheKey = filterModel ? JSON.stringify({
      search: filterModel.searchTerm,
      region: filterModel.getFilter?.('regionFilter'),
      city: filterModel.getFilter?.('cityFilter'),
      type: filterModel.getFilter?.('typeFilter'),
      sort: filterModel.sortOrder,
      version: this.#citiesVersion
    }) : 'no-filter'

    if (this.#cachedFilteredResults.has(cacheKey)) {
      return this.#cachedFilteredResults.get(cacheKey)
    }

    let result

    if (!filterModel) {
      result = {
        lancamentos: this.#launchAdvertisements,
        disponiveis: this.#availableAdvertisements,
        emObras: this.#underConstructionAdvertisements
      }
    } else {
      const typeFilter = filterModel.getFilter('typeFilter')

      // Se não houver filtro de tipo ou for TODOS, aplica filtros em todas as categorias - FIXED
      if (!typeFilter || typeFilter === 'TODOS' || typeFilter === 'ALL') {
        result = {
          lancamentos: this.filterAdvertisements(this.#launchAdvertisements, filterModel),
          disponiveis: this.filterAdvertisements(this.#availableAdvertisements, filterModel),
          emObras: this.filterAdvertisements(this.#underConstructionAdvertisements, filterModel)
        }
      } else {
        // Filtra por tipo específico
        result = {
          lancamentos: typeFilter === 'LANCAMENTOS'
            ? this.filterAdvertisements(this.#launchAdvertisements, filterModel)
            : [],
          disponiveis: typeFilter === 'DISPONIVEIS'
            ? this.filterAdvertisements(this.#availableAdvertisements, filterModel)
            : [],
          emObras: typeFilter === 'EM_OBRAS'
            ? this.filterAdvertisements(this.#underConstructionAdvertisements, filterModel)
            : []
        }
      }
    }

    this.#cachedFilteredResults.set(cacheKey, result)
    return result
  }

  // Conta total de resultados filtrados
  getTotalFilteredResults(filterModel) {
    const filtered = this.getFilteredAdvertisementsByType(filterModel)
    return filtered.lancamentos.length +
           filtered.disponiveis.length +
           filtered.emObras.length
  }
}
