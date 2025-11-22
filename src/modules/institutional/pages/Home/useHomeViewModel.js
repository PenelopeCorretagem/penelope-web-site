import { useState, useEffect, useCallback } from 'react'
import { listAllActiveAdvertisements, getLatestAdvertisement } from '@app/services/api/advertisementApi'
import { HomeModel } from './HomeModel'

/**
 * Hook para gerenciar a lógica da página Home
 * Busca o último imóvel e os lançamentos usando a API real
 */
export function useHomeViewModel() {
  const [homeModel] = useState(() => new HomeModel())
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  /**
   * Busca o imóvel em destaque
   */
  const fetchFeaturedProperty = useCallback(async () => {
    try {
      // Primeiro tenta buscar o mais recente via endpoint específico
      const latestAdvertisement = await getLatestAdvertisement()

      if (latestAdvertisement) {
        const mappedProperty = homeModel.mapAdvertisementToPropertyCard(latestAdvertisement)
        homeModel.setFeaturedProperty(mappedProperty)
        console.log('✅ [HOME VM] Featured property loaded from latest endpoint:', mappedProperty?.title)
        return
      }
    } catch (error) {
      console.warn('⚠️ [HOME VM] Latest advertisement endpoint failed, using fallback:', error.message)
    }

    try {
      // Fallback: busca todos os anúncios e seleciona baseado nas regras de negócio
      const allAdvertisements = await listAllActiveAdvertisements()
      const selectedFeatured = homeModel.selectFeaturedProperty(allAdvertisements)

      if (selectedFeatured) {
        const mappedProperty = homeModel.mapAdvertisementToPropertyCard(selectedFeatured)
        homeModel.setFeaturedProperty(mappedProperty)
        console.log('✅ [HOME VM] Featured property selected from all advertisements:', mappedProperty?.title)
      }
    } catch (error) {
      console.error('❌ [HOME VM] Failed to load featured property:', error)
      throw error
    }
  }, [homeModel])

  /**
   * Busca as propriedades de lançamento
   */
  const fetchLaunchProperties = useCallback(async () => {
    try {
      // Busca apenas lançamentos
      const launchAdvertisements = await listAllActiveAdvertisements({ tipo: 'LANCAMENTO' })

      // Mapeia para o formato do PropertyCard
      const mappedProperties = launchAdvertisements.map(ad =>
        homeModel.mapAdvertisementToPropertyCard(ad)
      ).filter(Boolean)

      homeModel.setLaunchProperties(mappedProperties)
      console.log('✅ [HOME VM] Launch properties loaded:', mappedProperties.length)

    } catch (error) {
      console.error('❌ [HOME VM] Failed to load launch properties:', error)
      throw error
    }
  }, [homeModel])

  /**
   * Carrega todos os dados da Home
   */
  const fetchHomeData = useCallback(async () => {
    homeModel.setLoading(true)
    homeModel.setError(null)

    try {
      console.log('🔄 [HOME VM] Loading home data...')

      // Executa as buscas em paralelo para melhor performance
      await Promise.all([
        fetchFeaturedProperty(),
        fetchLaunchProperties()
      ])

      console.log('✅ [HOME VM] Home data loaded successfully')

    } catch (error) {
      console.error('❌ [HOME VM] Failed to load home data:', error)
      homeModel.setError(error.message || 'Erro ao carregar dados da página')
    } finally {
      homeModel.setLoading(false)
      refresh() // Atualiza a UI
    }
  }, [homeModel, fetchFeaturedProperty, fetchLaunchProperties, refresh])

  // Carrega os dados quando o componente monta
  useEffect(() => {
    fetchHomeData()
  }, [fetchHomeData])

  // Retorna os dados formatados pelo modelo
  const viewData = homeModel.getViewData()

  return {
    ...viewData,
    refresh: fetchHomeData
  }
}
