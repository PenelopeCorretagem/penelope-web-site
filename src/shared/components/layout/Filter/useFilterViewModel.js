import { useState, useCallback } from 'react'
import { FilterModel } from './FilterModel'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

// ============================================
// VIEWMODEL - useFilterViewModel.js
// ============================================
export const useFilterViewModel = ({
  defaultFilters = {},
  onFiltersChange
}) => {
  const [filterModel, setFilterModel] = useState(
    new FilterModel({ filters: defaultFilters })
  )

  // Search handler
  const handleSearchChange = useCallback((e) => {
    const value = e?.target?.value ?? e ?? ''
    const newModel = filterModel.with({ searchTerm: value })
    setFilterModel(newModel)
    onFiltersChange?.(newModel)
  }, [filterModel, onFiltersChange])

  //  filter handler
  const handleFilterChange = useCallback((filterKey, value) => {
    const newModel = filterModel.withFilter(filterKey, value)
    setFilterModel(newModel)
    onFiltersChange?.(newModel)
  }, [filterModel, onFiltersChange])

  // Sort order handler
  const handleSortOrderChange = useCallback(() => {
    let newSortOrder = 'none'
    if (filterModel.sortOrder === 'none') newSortOrder = 'asc'
    else if (filterModel.sortOrder === 'asc') newSortOrder = 'desc'
    else newSortOrder = 'none'

    const newModel = filterModel.with({ sortOrder: newSortOrder })
    setFilterModel(newModel)
    onFiltersChange?.(newModel)
  }, [filterModel, onFiltersChange])

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    const newModel = filterModel.reset(defaultFilters)
    setFilterModel(newModel)
    onFiltersChange?.(newModel)
  }, [filterModel, defaultFilters, onFiltersChange])

  // Get sort icon based on current state
  const getSortIcon = () => {
    if (filterModel.sortOrder === 'asc') return ArrowUp
    if (filterModel.sortOrder === 'desc') return ArrowDown
    return ArrowUpDown
  }

  // Get sort button title
  const getSortTitle = () => {
    if (filterModel.sortOrder === 'asc') return 'Ordenação crescente (A → Z)'
    if (filterModel.sortOrder === 'desc') return 'Ordenação decrescente (Z → A)'
    return 'Sem ordenação'
  }

  return {
    // State
    filterModel,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleSortOrderChange,
    handleResetFilters,

    // UI Helpers
    getSortIcon,
    getSortTitle
  }
}
