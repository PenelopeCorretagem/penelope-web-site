import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyCardModel } from './PropertyCardModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'

const DEFAULT_VIDEO = 'https://www.youtube.com/embed/NA0u8QCrZfY'

export function usePropertyCardViewModel(
  realEstateAdvertisement,
  realStateCardMode,
  onWhatsAppClick = null
) {
  const navigate = useNavigate()
  const [showLightbox, setShowLightbox] = useState(false)
  const [medias, setMedias] = useState([])

  const onGalleryClick = () => {
    const galleryImages = realEstateAdvertisement?.estate?.getGalleryImages?.() || []
    setMedias(Array.isArray(galleryImages) ? galleryImages : [galleryImages])
    setShowLightbox(true)
  }

  const onFloorplanClick = () => {
    const floorplanImages = realEstateAdvertisement?.estate?.getFloorPlanImages?.() || []
    setMedias(Array.isArray(floorplanImages) ? floorplanImages : [floorplanImages])
    setShowLightbox(true)
  }

  const onVideoClick = () => {
    setMedias([
      {
        type: 'video',
        url: DEFAULT_VIDEO
      }
    ])
    setShowLightbox(true)
  }

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
      onWhatsAppClick,
      onFloorplanClick,
      onGalleryClick,
      onVideoClick, // ✅ injeta o mock no model
    }),
    [
      realEstateAdvertisement,
      realStateCardMode,
      onWhatsAppClick,
      onFloorplanClick,
      onGalleryClick
    ]
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
    medias,
    showLightbox,
    setShowLightbox,
  }
}
