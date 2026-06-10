import { useState, useCallback, useMemo } from 'react'
import { CalendarModel, DEFAULT_FILTERS, STATUS_LABELS } from '@management/models/CalendarModel'
import { ESTATE_TYPES } from '@constant/estateTypes'

/**
 * useFilters.js
 * Hook para gerenciar lógica de filtros de agendamento.
 */

export function useFilters(appointments = []) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(DEFAULT_FILTERS.statusFilter)
  const [selectedEstateFilter, setSelectedEstateFilter] = useState(DEFAULT_FILTERS.estateFilter)
  const [selectedEstateTypeFilter, setSelectedEstateTypeFilter] = useState(DEFAULT_FILTERS.estateTypeFilter)

  const filteredAppointments = useMemo(() => {
    return CalendarModel.getFilteredAppointments(appointments, {
      statusFilter: selectedStatusFilter,
      estateFilter: selectedEstateFilter,
      estateTypeFilter: selectedEstateTypeFilter,
    })
  }, [appointments, selectedStatusFilter, selectedEstateFilter, selectedEstateTypeFilter])

  const statusOptions = useMemo(() => {
    return CalendarModel.getStatusOptions()
  }, [])

  const estateOptions = useMemo(() => {
    return CalendarModel.getEstateOptions(appointments, [])
  }, [appointments])

  const estateTypeOptions = useMemo(() => {
    return CalendarModel.getEstateTypeOptions(appointments, ESTATE_TYPES)
  }, [appointments])

  const filterConfigs = useMemo(() => {
    return [
      {
        key: 'statusFilter',
        defaultValue: 'TODOS',
        width: 'fit',
        variant: 'brown',
        shape: 'square',
        options: statusOptions.map(status => ({
          value: status,
          label: status === 'TODOS' ? 'Todos os status' : STATUS_LABELS[status] || status,
        })),
      },
      {
        key: 'estateFilter',
        defaultValue: 'TODOS',
        width: 'fit',
        variant: 'brown',
        shape: 'square',
        options: estateOptions.map(estate => ({
          value: estate,
          label: estate === 'TODOS' ? 'Todos os imóveis' : estate,
        })),
      },
      {
        key: 'estateTypeFilter',
        defaultValue: 'TODOS',
        width: 'fit',
        variant: 'brown',
        shape: 'square',
        options: estateTypeOptions,
      },
    ]
  }, [estateOptions, estateTypeOptions, statusOptions])

  const handleFiltersChange = useCallback((filterKey, filterValue) => {
    if (filterKey === 'statusFilter') {
      setSelectedStatusFilter(filterValue)
      return
    }

    if (filterKey === 'estateFilter') {
      setSelectedEstateFilter(filterValue)
      return
    }

    if (filterKey === 'estateTypeFilter') {
      setSelectedEstateTypeFilter(filterValue)
    }
  }, [])

  const resetFilters = useCallback(() => {
    setSelectedStatusFilter(DEFAULT_FILTERS.statusFilter)
    setSelectedEstateFilter(DEFAULT_FILTERS.estateFilter)
    setSelectedEstateTypeFilter(DEFAULT_FILTERS.estateTypeFilter)
  }, [])

  return {
    selectedStatusFilter,
    selectedEstateFilter,
    selectedEstateTypeFilter,
    filteredAppointments,
    statusOptions,
    estateOptions,
    estateTypeOptions,
    filterConfigs,
    defaultFilters: DEFAULT_FILTERS,
    handleFiltersChange,
    resetFilters,
  }
}
