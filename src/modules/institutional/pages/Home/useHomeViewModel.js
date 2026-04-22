import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllAdvertisements } from '@service-penelopec/advertisementService'
import { HomeModel } from './HomeModel'
import { AdvertisementCardModel } from '@shared/components/ui/AdvertisementCard/AdvertisementCardModel'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
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
  const fetchLaunchAdvertisements = useCallback(async () => {
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
      await fetchLaunchAdvertisements()
    }
    catch (error) {
      homeModel.setError(error.message || 'Erro ao carregar a Home')
    }
    finally {
      homeModel.setLoading(false)
      refreshUI()
    }
  }, [homeModel, fetchLaunchAdvertisements, refreshUI])



  // ======================
  // CARREGA AO MONTAR
  // ======================
  useEffect(() => {
    fetchHomeData()
  }, [fetchHomeData])

  const mapperAdvertisementCardModel = useCallback((advertisement, advertisementCardMode) => {
    return !advertisement
      ? null
      : new AdvertisementCardModel(
        {
          advertisement: advertisement,
          advertisementCardMode: advertisementCardMode
        }
      )
  }, [])

  // Memoize the mapped properties to avoid recreating arrays on every render
  const featuredAdvertisement = useMemo(() =>
    mapperAdvertisementCardModel(homeModel.featuredAdvertisement, ADVERTISEMENT_CARD_MODES.DISTAC),
  [homeModel.featuredAdvertisement, mapperAdvertisementCardModel]
  )

  // Don't map to AdvertisementCardModel here - let AdvertisementsCarouselView handle it
  const launchAdvertisements = useMemo(() =>
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

    hasFeaturedAdvertisement: !!homeModel.featuredAdvertisement,
    hasLaunchAdvertisements: homeModel.preLaunchAdvertisements.length > 0,

    featureImageCoverUrl: homeModel.featuredAdvertisement !== null ? homeModel.featuredAdvertisement.estate.getCoverImageUrl() : null,
    featuredAdvertisement,
    launchAdvertisements,

    refresh: fetchHomeData
  }
  return viewData
}
