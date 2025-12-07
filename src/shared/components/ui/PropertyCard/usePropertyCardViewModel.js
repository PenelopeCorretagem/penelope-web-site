import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyCardModel } from './PropertyCardModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'

export function usePropertyCardViewModel(
  realEstateAdvertisement,
  realStateCardMode,
  onWhatsAppClick = null
) {
  const navigate = useNavigate()

  const onScheduleClick = useMemo(() => {
    if (realStateCardMode !== REAL_STATE_CARD_MODES.REDIRECTION) return null

    return () => {
      const propertyTitle = realEstateAdvertisement?.estate?.title
      if (propertyTitle) {
        navigate('/agenda', {
          state: { propertyTitle }
        })
      } else {
        navigate('/agenda')
      }
    }
  }, [realEstateAdvertisement, realStateCardMode, navigate])

  const propertyCardModel = useMemo(
    () => new PropertyCardModel({
      realEstateAdvertisement,
      realStateCardMode,
      onWhatsAppClick
    }),
    [realEstateAdvertisement, realStateCardMode, onWhatsAppClick]
  )

  return {
    // Dados do card
    realStateCardCategory: propertyCardModel.realStateCardCategory,
    realStateCardMode: propertyCardModel.realStateCardMode,
    realStateCardButtons: propertyCardModel.realStateCardButtons,
    realStateCardFeatures: propertyCardModel.realStateCardFeatures,
    realStateCardCoverImageUrl: propertyCardModel.realStateCardCoverImageUrl,
    realStateCardTitle: propertyCardModel.realStateCardTitle,
    realStateCardSubtitle: propertyCardModel.realStateCardSubtitle,
    realStateCardDescription: propertyCardModel.realStateCardDescription,

    // Flags de renderização
    renderRealStateCardCategoryLabel: propertyCardModel.renderRealStateCardCategoryLabel,
    renderRealStateCardCoverImage: propertyCardModel.renderRealStateCardCoverImage,
    renderRealStateCardFeatures: propertyCardModel.renderRealStateCardFeatures,

    // Flags de modo
    isConfigMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.CONFIG,
    isMoreDetailsMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.MORE_DETAILS,
    isRedirectionMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.REDIRECTION,
    isMinimalistMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.MINIMALIST,
    isDetailsMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.DETAILS,
    isDistacMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.DISTAC,
    isDefaultMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.DEFAULT,

    isActiveAdvertisement: realEstateAdvertisement?.active || false,

  }
}
