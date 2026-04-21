import { useState, useCallback, useEffect, useMemo } from 'react'
import { getAllLucideIcons } from '@management/utils/lucideIconsUtil'

/**
 * useIconPickerViewModel - Hook para gerenciar estado do IconPicker
 *
 * RESPONSABILIDADES:
 * - Gerenciar filtros (busca, ordenação, inicial)
 * - Filtrar e ordenar ícones
 * - Limpar filtros quando modal abre/fecha
 */
export function useIconPickerViewModel(isOpen) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    sortOrder: 'ascending', // 'ascending' ou 'descending'
    initialLetter: '', // vazio = sem filtro
  })

  // Limpar filtros quando modal abre
  useEffect(() => {
    if (isOpen) {
      setFilters({
        searchTerm: '',
        sortOrder: 'ascending',
        initialLetter: '',
      })
    }
  }, [isOpen])

  // Lista de todas as iniciais disponíveis
  const availableInitials = useMemo(() => {
    const icons = getAllLucideIcons()
    const initials = new Set(icons.map(icon => icon.charAt(0).toUpperCase()))
    return Array.from(initials).sort()
  }, [])

  // Ícones filtrados e ordenados
  const filteredAndSortedIcons = useMemo(() => {
    let icons = getAllLucideIcons()

    // Filtro por termo de busca
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase()
      icons = icons.filter(icon => icon.toLowerCase().includes(term))
    }

    // Filtro por inicial
    if (filters.initialLetter) {
      icons = icons.filter(icon => icon.charAt(0).toUpperCase() === filters.initialLetter)
    }

    // Ordenação
    const sorted = [...icons].sort((a, b) => {
      if (filters.sortOrder === 'descending') {
        return b.localeCompare(a)
      }
      return a.localeCompare(b)
    })

    return sorted
  }, [filters])

  // Manipulador de mudanças de filtros (compatível com FilterView)
  const handleFiltersChange = useCallback((filterKey, filterValue) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterValue,
    }))
  }, [])

  // Resetar todos os filtros
  const handleResetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      sortOrder: 'ascending',
      initialLetter: '',
    })
  }, [])

  return {
    filters,
    filteredIcons: filteredAndSortedIcons,
    availableInitials,
    handleFiltersChange,
    handleResetFilters,
  }
}
