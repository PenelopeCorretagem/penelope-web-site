import { useState, useEffect, useCallback } from 'react'
import { listAllActiveAdvertisements } from '@app/services/api/realEstateAdvertisementAPI'
import { PropertiesModel } from './PropertiesModel'

/**
 * Hook para gerenciar a lógica da página Properties
 * Busca imóveis por categoria e gerencia filtros
 */
export function usePropertiesViewModel() {
  const [propertiesModel] = useState(() => new PropertiesModel())
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  /**
   * Busca as propriedades por categoria
   */
  const fetchPropertiesByCategory = useCallback(async () => {
    propertiesModel.setLoading(true)
    propertiesModel.setError(null)

    try {
      console.log('🔄 [PROPERTIES VM] Loading properties by category...')

      // Busca cada categoria em paralelo
      const [lancamentosData, disponiveisData, emObrasData] = await Promise.all([
        listAllActiveAdvertisements({ tipo: 'LANCAMENTO' }),
        listAllActiveAdvertisements({ tipo: 'DISPONIVEL' }),
        listAllActiveAdvertisements({ tipo: 'EM_OBRAS' })
      ])

      // Mapeia para o formato do PropertyCard
      const mappedLancamentos = lancamentosData.map(ad =>
        propertiesModel.mapAdvertisementToPropertyCard(ad)
      ).filter(Boolean)

      const mappedDisponiveis = disponiveisData.map(ad =>
        propertiesModel.mapAdvertisementToPropertyCard(ad)
      ).filter(Boolean)

      const mappedEmObras = emObrasData.map(ad =>
        propertiesModel.mapAdvertisementToPropertyCard(ad)
      ).filter(Boolean)

      propertiesModel.setLancamentos(mappedLancamentos)
      propertiesModel.setDisponiveis(mappedDisponiveis)
      propertiesModel.setEmObras(mappedEmObras)

      console.log('✅ [PROPERTIES VM] Properties loaded:', {
        lancamentos: mappedLancamentos.length,
        disponiveis: mappedDisponiveis.length,
        emObras: mappedEmObras.length
      })

    } catch (error) {
      console.error('❌ [PROPERTIES VM] Failed to load properties:', error)
      propertiesModel.setError(error.message || 'Erro ao carregar propriedades')
    } finally {
      propertiesModel.setLoading(false)
      refresh()
    }
  }, [propertiesModel, refresh])

  /**
   * Atualiza um filtro pendente
   */
  const updatePendingFilter = useCallback((key, value) => {
    propertiesModel.updatePendingFilter(key, value)
    refresh()
  }, [propertiesModel, refresh])

  /**
   * Aplica os filtros pendentes
   */
  const applyFilters = useCallback(() => {
    propertiesModel.applyFilters()
    refresh()
  }, [propertiesModel, refresh])

  /**
   * Limpa todos os filtros
   */
  const clearFilters = useCallback(() => {
    propertiesModel.setPendingFilters({
      city: '',
      region: '',
      type: '',
      bedrooms: ''
    })
    propertiesModel.applyFilters()
    refresh()
  }, [propertiesModel, refresh])

  // Carrega os dados quando o componente monta
  useEffect(() => {
    fetchPropertiesByCategory()
  }, [fetchPropertiesByCategory])

  // Retorna os dados formatados pelo modelo
  const viewData = propertiesModel.getViewData()

  return {
    ...viewData,
    updatePendingFilter,
    applyFilters,
    clearFilters,
    refresh: fetchPropertiesByCategory
  }
}
