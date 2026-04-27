import { useState, useCallback, useMemo } from 'react'
import { DEFAULT_FILTERS, STATUS_LABELS, ScheduleModel } from '../ScheduleModel'
import { ESTATE_TYPES } from '@constant/estateTypes'

/**
 * useScheduleFilters.js
 * Hook para gerenciar lógica de filtros
 */

export function useScheduleFilters(appointments = []) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(DEFAULT_FILTERS.statusFilter)
  const [selectedEstateFilter, setSelectedEstateFilter] = useState(DEFAULT_FILTERS.estateFilter)
  const [selectedEstateTypeFilter, setSelectedEstateTypeFilter] = useState(DEFAULT_FILTERS.estateTypeFilter)

  const filteredAppointments = useMemo(() => {
    return ScheduleModel.getFilteredAppointments(appointments, {
      statusFilter: selectedStatusFilter,
      estateFilter: selectedEstateFilter,
      estateTypeFilter: selectedEstateTypeFilter,
    })
  }, [appointments, selectedStatusFilter, selectedEstateFilter, selectedEstateTypeFilter])

  const statusOptions = useMemo(() => {
    return ScheduleModel.getStatusOptions()
  }, [])

  const estateOptions = useMemo(() => {
    return ScheduleModel.getEstateOptions(appointments, [])
  }, [appointments])

  const estateTypeOptions = useMemo(() => {
    return ScheduleModel.getEstateTypeOptions(ESTATE_TYPES)
  }, [])

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
          label: status === 'TODOS' ? 'Todos' : (STATUS_LABELS[status] || status),
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
          label: estate === 'TODOS' ? 'Todos os imoveis' : estate,
        })),
      },
      {
        key: 'estateTypeFilter',
        defaultValue: 'TODOS',
        width: 'fit',
        variant: 'brown',
        shape: 'square',
        options: estateTypeOptions.map(typeOption => ({
          value: typeOption.key,
          label: typeOption.friendlyName,
        })),
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
