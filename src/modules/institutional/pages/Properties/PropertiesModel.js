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
export class PropertiesModel {
  #launchProperties = []
  #availableProperties = []
  #underConstructionProperties = []
  #isLoading = false
  #error = null

  // Cache para evitar recriação desnecessária de objetos
  #cachedUniqueCities = null
  #citiesVersion = 0
  #cachedFilteredResults = new Map()

  // Getters
  get lancamentos() {
    return this.#launchProperties
  }

  get disponiveis() {
    return this.#availableProperties
  }

  get emObras() {
    return this.#underConstructionProperties
  }

  get isLoading() {
    return this.#isLoading
  }

  get error() {
    return this.#error
  }

  // Setters
  setLancamentos(properties) {
    const newProperties = Array.isArray(properties) ? properties : []
    if (JSON.stringify(this.#launchProperties) !== JSON.stringify(newProperties)) {
      this.#launchProperties = newProperties
      this.#invalidateCache()
    }
  }

  setDisponiveis(properties) {
    const newProperties = Array.isArray(properties) ? properties : []
    if (JSON.stringify(this.#availableProperties) !== JSON.stringify(newProperties)) {
      this.#availableProperties = newProperties
      this.#invalidateCache()
    }
  }

  setEmObras(properties) {
    const newProperties = Array.isArray(properties) ? properties : []
    if (JSON.stringify(this.#underConstructionProperties) !== JSON.stringify(newProperties)) {
      this.#underConstructionProperties = newProperties
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
  getAllProperties() {
    return [
      ...this.#launchProperties,
      ...this.#availableProperties,
      ...this.#underConstructionProperties
    ]
  }

  // Extrai cidades únicas de todas as propriedades (com cache)
  getUniqueCities() {
    if (this.#cachedUniqueCities === null) {
      const allProps = this.getAllProperties()
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
  filterProperties(properties, filterModel) {
    if (!filterModel) return properties

    let filtered = [...properties]

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
        || property.estate.features.some(diff => diff.description.toLowerCase().includes(searchLower))
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
  getFilteredPropertiesByType(filterModel) {
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
        lancamentos: this.#launchProperties,
        disponiveis: this.#availableProperties,
        emObras: this.#underConstructionProperties
      }
    } else {
      const typeFilter = filterModel.getFilter('typeFilter')

      // Se não houver filtro de tipo ou for TODOS, aplica filtros em todas as categorias - FIXED
      if (!typeFilter || typeFilter === 'TODOS' || typeFilter === 'ALL') {
        result = {
          lancamentos: this.filterProperties(this.#launchProperties, filterModel),
          disponiveis: this.filterProperties(this.#availableProperties, filterModel),
          emObras: this.filterProperties(this.#underConstructionProperties, filterModel)
        }
      } else {
        // Filtra por tipo específico
        result = {
          lancamentos: typeFilter === 'LANCAMENTOS'
            ? this.filterProperties(this.#launchProperties, filterModel)
            : [],
          disponiveis: typeFilter === 'DISPONIVEIS'
            ? this.filterProperties(this.#availableProperties, filterModel)
            : [],
          emObras: typeFilter === 'EM_OBRAS'
            ? this.filterProperties(this.#underConstructionProperties, filterModel)
            : []
        }
      }
    }

    this.#cachedFilteredResults.set(cacheKey, result)
    return result
  }

  // Conta total de resultados filtrados
  getTotalFilteredResults(filterModel) {
    const filtered = this.getFilteredPropertiesByType(filterModel)
    return filtered.lancamentos.length +
           filtered.disponiveis.length +
           filtered.emObras.length
  }
}
