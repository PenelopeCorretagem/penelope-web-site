import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllAdvertisements } from '@service-penelopec/advertisementService'
import { HomeModel } from './HomeModel'
import { PropertyCardModel } from '@shared/components/ui/PropertyCard/PropertyCardModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { ESTATE_TYPES } from '@constant/estateTypes'

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
      const launchAds = await getAllAdvertisements({
        type: ESTATE_TYPES['LANCAMENTO'].key,
        active: true
      })

      if (Array.isArray(launchAds)) {
        homeModel.setPreLaunchAdvertisements(launchAds)
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

  const mapperPropertyCardModel = useCallback((advertisement, realStateCardMode) => {
    return !advertisement
      ? null
      : new PropertyCardModel(
        {
          advertisement: advertisement,
          realStateCardMode: realStateCardMode
        }
      )
  }, [])

  // Memoize the mapped properties to avoid recreating arrays on every render
  const featuredProperty = useMemo(() =>
    mapperPropertyCardModel(homeModel.featuredAdvertisement, REAL_STATE_CARD_MODES.DISTAC),
  [homeModel.featuredAdvertisement, mapperPropertyCardModel]
  )

  // Don't map to PropertyCardModel here - let PropertiesCarouselView handle it
  const launchProperties = useMemo(() =>
    homeModel.preLaunchAdvertisements,
  [homeModel.preLaunchAdvertisements]
  )


  // ======================
  // VIEW DATA
  // É aqui que você mapeia para o formato da View
  // ======================

  const viewData = {
    isLoading: homeModel.isLoading,
    error: homeModel.error,

    hasFeaturedProperty: !!homeModel.featuredAdvertisement,
    hasLaunchProperties: homeModel.preLaunchAdvertisements.length > 0,

    featureImageCoverUrl: homeModel.featuredAdvertisement !== null ? homeModel.featuredAdvertisement.estate.getCoverImageUrl() : null,
    featuredProperty,
    launchProperties,

    refresh: fetchHomeData
  }
  return viewData
}
