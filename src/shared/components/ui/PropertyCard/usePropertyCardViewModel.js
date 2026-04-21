import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyCardModel } from './PropertyCardModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { RouterModel } from '@app/routes/RouterModel'
import { ROUTES } from '@constant/routes'

const DEFAULT_VIDEO = 'https://www.youtube.com/embed/NA0u8QCrZfY'

export function usePropertyCardViewModel(
  realEstateAdvertisement,
  realStateCardMode,
  onWhatsAppClick = null,
  isCarouselItem = false
) {
  const navigate = useNavigate()
  const [showLightbox, setShowLightbox] = useState(false)
  const [medias, setMedias] = useState([])
  const [alertConfig, setAlertConfig] = useState(null)
  const [isActiveAdvertisement, setIsActiveAdvertisement] = useState(Boolean(realEstateAdvertisement?.active))
  const [isProcessingStatus, setIsProcessingStatus] = useState(false)

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  const handleSoftDeleteSuccess = useCallback((message) => {
    setAlertConfig({ type: 'success', message })
  }, [])

  const handleSoftDeleteError = useCallback((message) => {
    setAlertConfig({ type: 'error', message })
  }, [])

  const handleRequestSoftDeleteConfirmation = useCallback(() => {
    const nextActiveStatus = !isActiveAdvertisement
    setAlertConfig({
      type: 'warning',
      isConfirm: true,
      message: `Tem certeza que deseja ${nextActiveStatus ? 'habilitar' : 'desabilitar'} este imóvel?`,
      confirmText: nextActiveStatus ? 'Habilitar' : 'Desabilitar',
      confirmColor: nextActiveStatus ? 'brown' : 'pink',
      nextActiveStatus,
    })
  }, [isActiveAdvertisement])

  useEffect(() => {
    setIsActiveAdvertisement(Boolean(realEstateAdvertisement?.active))
  }, [realEstateAdvertisement])

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
      onVideoClick,
      onSoftDeleteSuccess: handleSoftDeleteSuccess,
      onSoftDeleteError: handleSoftDeleteError,
      onRequestSoftDeleteConfirmation: handleRequestSoftDeleteConfirmation,
    }),
    [
      realEstateAdvertisement,
      realStateCardMode,
      onWhatsAppClick,
      onFloorplanClick,
      onGalleryClick,
      onVideoClick,
      handleSoftDeleteSuccess,
      handleSoftDeleteError,
      handleRequestSoftDeleteConfirmation,
    ]
  )

  const handleConfirmSoftDelete = useCallback(async () => {
    if (isProcessingStatus || !alertConfig?.isConfirm) return

    setIsProcessingStatus(true)

    try {
      const success = await propertyCardModel.softDelete(alertConfig.nextActiveStatus)
      if (success) {
        setIsActiveAdvertisement(alertConfig.nextActiveStatus)
        window.dispatchEvent(new CustomEvent('propertySoftDeleted', {
          detail: {
            propertyId: realEstateAdvertisement?.id,
            active: alertConfig.nextActiveStatus,
          }
        }))
      }
    } finally {
      setIsProcessingStatus(false)
      setAlertConfig(null)
    }
  }, [alertConfig, isProcessingStatus, propertyCardModel, realEstateAdvertisement])

  const handleCarouselItemClick = useCallback(() => {
    if (isCarouselItem && realEstateAdvertisement) {
      const router = RouterModel.getInstance()
      const route = router.generateRoute(ROUTES['PROPERTY_DETAIL'].key, { id: realEstateAdvertisement.id })
      navigate(route)
    }
  }, [isCarouselItem, realEstateAdvertisement, navigate])

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

    isActiveAdvertisement,
    isProcessingStatus,
    medias,
    showLightbox,
    setShowLightbox,
    alertConfig,
    handleCloseAlert,
    handleConfirmSoftDelete,
    handleCarouselItemClick,
  }
}
