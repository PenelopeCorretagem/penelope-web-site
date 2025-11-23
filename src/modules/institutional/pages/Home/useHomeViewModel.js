import { useState, useEffect, useCallback } from 'react'
import { listAllActiveAdvertisements } from '@api/realEstateAdvertisementAPI'
import { HomeModel } from './HomeModel'
import { PropertyCardModel } from '@shared/components/ui/PropertyCard/PropertyCardModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'

export function useHomeViewModel() {

  // Model instanciado apenas 1 vez (correto)
  const [homeModel] = useState(() => new HomeModel())
  const [, forceUpdate] = useState(0)

  const refreshUI = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // ======================
  // FETCH: Lançamentos
  // ======================
  const fetchLaunchProperties = useCallback(async () => {
    try {
      const launchAds = await listAllActiveAdvertisements({
        tipo: 'LANCAMENTO'
      })

      if (Array.isArray(launchAds)) {
        homeModel.setPreLaunchRealEstateAdvertisements(launchAds)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar lançamentos:', error)
      homeModel.setError(error.message)
    }
  }, [homeModel])



  // ======================
  // FETCH GERAL
  // ======================
  const fetchHomeData = useCallback(async () => {
    homeModel.setLoading(true)
    homeModel.setError(null)
    refreshUI()

    try {
      await fetchLaunchProperties()
    }
    catch (error) {
      homeModel.setError(error.message || 'Erro ao carregar a Home')
    }
    finally {
      homeModel.setLoading(false)
      refreshUI()
    }
  }, [homeModel, fetchLaunchProperties, refreshUI])



  // ======================
  // CARREGA AO MONTAR
  // ======================
  useEffect(() => {
    fetchHomeData()
  }, [fetchHomeData])

  const mapperPropertyCardModel = useCallback((realEstateAdvertisement, realStateCardMode) => {
    return !realEstateAdvertisement
      ? null
      : new PropertyCardModel(
        {
          realEstateAdvertisement: realEstateAdvertisement,
          realStateCardMode: realStateCardMode
        }
      )
  }, [])



  // ======================
  // VIEW DATA
  // É aqui que você mapeia para o formato da View
  // ======================

  const viewData = {
    isLoading: homeModel.isLoading,
    error: homeModel.error,

    hasFeaturedProperty: !!homeModel.featuredRealEstateAdvertisement,
    hasLaunchProperties: homeModel.preLaunchRealEstateAdvertisements.length > 0,

    featureImageCoverUrl: homeModel.featuredRealEstateAdvertisement !== null ? homeModel.featuredRealEstateAdvertisement.estate.getCoverImageUrl() : null,
    featuredProperty: mapperPropertyCardModel(homeModel.featuredRealEstateAdvertisement, REAL_STATE_CARD_MODES.MINIMALIST),
    launchProperties: homeModel.preLaunchRealEstateAdvertisements.map(realEstateAdvertisement =>
      mapperPropertyCardModel(realEstateAdvertisement, REAL_STATE_CARD_MODES.DEFAULT)),

    refresh: fetchHomeData
  }
  return viewData
}
