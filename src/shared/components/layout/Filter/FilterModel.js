
// ============================================
// MODEL - FilterModel.js
// ============================================
export class FilterModel {
  constructor({
    searchTerm = '',
    filters = {}, // Objeto genérico para múltiplos filtros
    sortOrder = 'none'
  } = {}) {
    this.searchTerm = searchTerm
    this.filters = filters
    this.sortOrder = sortOrder
  }

  // Clone with updates
  with(updates) {
    return new FilterModel({
      searchTerm: this.searchTerm,
      filters: { ...this.filters },
      sortOrder: this.sortOrder,
      ...updates
    })
  }

  // Update a specific filter
  withFilter(filterKey, value) {
    return new FilterModel({
      searchTerm: this.searchTerm,
      filters: { ...this.filters, [filterKey]: value },
      sortOrder: this.sortOrder
    })
  }

  // Reset filters
  reset(defaultFilters = {}) {
    return new FilterModel({
      searchTerm: '',
      filters: { ...defaultFilters },
      sortOrder: 'none'
    })
  }

  // Check if filters are active
  hasActiveFilters(defaultFilters = {}) {
    const hasSearchTerm = this.searchTerm !== ''
    const hasChangedFilters = Object.keys(this.filters).some(
      key => this.filters[key] !== defaultFilters[key]
    )
    const hasSortOrder = this.sortOrder !== 'none'

    return hasSearchTerm || hasChangedFilters || hasSortOrder
  }

  // Get a specific filter value
  getFilter(key, defaultValue = null) {
    return this.filters[key] ?? defaultValue
  }
}
