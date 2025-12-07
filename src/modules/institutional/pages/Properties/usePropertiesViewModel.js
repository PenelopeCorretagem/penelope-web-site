import { useState, useEffect, useCallback, useMemo } from 'react'
import { listAllAdvertisements  } from '@app/services/api/realEstateAdvertisementAPI'
import { PropertiesModel } from './PropertiesModel'
import { ESTATE_TYPES } from '@constant/estateTypes'

/**
 * Hook para gerenciar a lógica da página Properties
 * Busca imóveis por categoria e gerencia filtros
 */
export const usePropertiesViewModel = ({ onError }) => {
  const [model] = useState(() => new PropertiesModel())
  const [currentFilters, setCurrentFilters] = useState(null)
  const [dataVersion, setDataVersion] = useState(0)

  // Busca propriedades por categoria
  const fetchProperties = useCallback(async () => {
    model.setLoading(true)
    model.setError(null)

    try {
      // Busca cada categoria em paralelo
      const [lancamentosData, disponiveisData, emObrasData] = await Promise.all([
        listAllAdvertisements ({
          type: ESTATE_TYPES['LANCAMENTO'].key,
          active: true
        }),
        listAllAdvertisements ({
          type: ESTATE_TYPES['DISPONIVEL'].key,
          active: true
        }),
        listAllAdvertisements ({
          type: ESTATE_TYPES['EM_OBRAS'].key,
          active: true
        })
      ])

      model.setLancamentos(lancamentosData)
      model.setDisponiveis(disponiveisData)
      model.setEmObras(emObrasData)

      setDataVersion(prev => prev + 1)

    } catch (error) {
      console.error('❌ Failed to load properties:', error)
      model.setError(error.message || 'Erro ao carregar propriedades')
      onError?.(error)
    } finally {
      model.setLoading(false)
    }
  }, [model, onError])

  // Handler quando filtros mudam
  const handleFiltersChange = useCallback((filterModel) => {
    console.log('Filters changed:', {
      search: filterModel.searchTerm,
      region: filterModel.getFilter('regionFilter'),
      city: filterModel.getFilter('cityFilter'),
      type: filterModel.getFilter('typeFilter'),
      sort: filterModel.sortOrder
    })
    setCurrentFilters(filterModel)
  }, [])

  // Carrega propriedades na montagem
  useEffect(() => {
    fetchProperties()
  }, []) // Empty dependency array - only run once on mount

  // Obtém propriedades filtradas (simplificado para evitar dependências problemáticas)
  const filteredProperties = useMemo(() => {
    if (!model) return { lancamentos: [], disponiveis: [], emObras: [] }
    return model.getFilteredPropertiesByType(currentFilters)
  }, [model, currentFilters, dataVersion])

  // Obtém cidades disponíveis (simplificado)
  const availableCities = useMemo(() => {
    if (!model) return []
    return model.getUniqueCities()
  }, [model, dataVersion])

  // Configuração dos filtros
  const filterConfigs = useMemo(() => [
    {
      key: 'regionFilter',
      defaultValue: 'TODAS',
      width: 'fit',
      variant: 'brown',
      shape: 'square',
      options: [
        { value: 'TODAS', label: 'Todas as Regiões' },
        { value: 'Norte', label: 'Norte' },
        { value: 'Sul', label: 'Sul' },
        { value: 'Leste', label: 'Leste' },
        { value: 'Oeste', label: 'Oeste' },
        { value: 'Centro', label: 'Centro' }
      ]
    },
    {
      key: 'cityFilter',
      defaultValue: 'TODAS',
      width: 'fit',
      variant: 'brown',
      shape: 'square',
      options: [
        { value: 'TODAS', label: 'Todas as Cidades' },
        ...availableCities.map(city => ({
          value: city,
          label: city
        }))
      ]
    },
    {
      key: 'typeFilter',
      defaultValue: 'TODOS',
      width: 'fit',
      variant: 'brown',
      shape: 'square',
      options: [
        { value: 'TODOS', label: 'Todos os Tipos' },
        { value: 'LANCAMENTOS', label: 'Lançamentos' },
        { value: 'DISPONIVEIS', label: 'Disponíveis' },
        { value: 'EM_OBRAS', label: 'Em Obras' }
      ]
    }
  ], [availableCities])

  const defaultFilters = {
    regionFilter: 'TODAS',
    cityFilter: 'TODAS',
    typeFilter: 'TODOS'
  }

  const totalResults = useMemo(() => {
    if (!model) return 0
    return model.getTotalFilteredResults(currentFilters)
  }, [model, currentFilters, dataVersion])

  return {
    // Estado
    isLoading: model.isLoading,
    error: model.error,

    // Propriedades filtradas - FIXED: usar dados filtrados
    lancamentos: filteredProperties.lancamentos,
    disponiveis: filteredProperties.disponiveis,
    emObras: filteredProperties.emObras,
    totalResults,

    // Configuração de filtros
    filterConfigs,
    defaultFilters,
    handleFiltersChange,

    // Ações
    refresh: fetchProperties
  }
}
