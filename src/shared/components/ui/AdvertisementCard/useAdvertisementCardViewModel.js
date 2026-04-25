import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdvertisementCardModel } from './AdvertisementCardModel'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
import { RouterModel } from '@app/routes/RouterModel'
import { ROUTES } from '@constant/routes'

const DEFAULT_VIDEO = 'https://www.youtube.com/embed/NA0u8QCrZfY'

export function useAdvertisementCardViewModel(
  advertisement,
  advertisementCardMode,
  onWhatsAppClick = null,
  isCarouselItem = false
) {
  const navigate = useNavigate()
  const [showLightbox, setShowLightbox] = useState(false)
  const [medias, setMedias] = useState([])
  const [alertConfig, setAlertConfig] = useState(null)
  const [isActiveAdvertisement, setIsActiveAdvertisement] = useState(Boolean(advertisement?.active))
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

  const handleHardDeleteSuccess = useCallback((message) => {
    setAlertConfig({ type: 'success', message })
  }, [])

  const handleHardDeleteError = useCallback((message) => {
    setAlertConfig({ type: 'error', message })
  }, [])

  const handleRequestSoftDeleteConfirmation = useCallback(() => {
    const nextActiveStatus = !isActiveAdvertisement
    setAlertConfig({
      type: 'warning',
      isConfirm: true,
      confirmAction: 'soft-delete',
      message: `Tem certeza que deseja ${nextActiveStatus ? 'habilitar' : 'desabilitar'} este imóvel?`,
      confirmText: nextActiveStatus ? 'Habilitar' : 'Desabilitar',
      confirmColor: nextActiveStatus ? 'brown' : 'pink',
      nextActiveStatus,
    })
  }, [isActiveAdvertisement])

  const handleRequestHardDeleteConfirmation = useCallback(() => {
    setAlertConfig({
      type: 'warning',
      isConfirm: true,
      confirmAction: 'hard-delete',
      message: 'Tem certeza que deseja excluir definitivamente este imóvel? Esta ação não poderá ser desfeita.',
      confirmText: 'Excluir Definitivamente',
      confirmColor: 'pink',
    })
  }, [])

  useEffect(() => {
    setIsActiveAdvertisement(Boolean(advertisement?.active))
  }, [advertisement])

  const onGalleryClick = () => {
    const galleryImages = advertisement?.estate?.getGalleryImages?.() || []
    setMedias(Array.isArray(galleryImages) ? galleryImages : [galleryImages])
    setShowLightbox(true)
  }

  const onFloorplanClick = () => {
    const floorplanImages = advertisement?.estate?.getFloorPlanImages?.() || []
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
    if (advertisementCardMode !== ADVERTISEMENT_CARD_MODES.REDIRECTION) return null

    return () => {
      const advertisementTitle = advertisement?.estate?.title
      if (advertisementTitle) {
        navigate('/agenda', {
          state: { advertisementTitle }
        })
      } else {
        navigate('/agenda')
      }
    }
  }, [advertisement, advertisementCardMode, navigate])

  const advertisementCardModel = useMemo(
    () => new AdvertisementCardModel({
      advertisement,
      advertisementCardMode,
      onWhatsAppClick,
      onFloorplanClick,
      onGalleryClick,
      onVideoClick,
      onSoftDeleteSuccess: handleSoftDeleteSuccess,
      onSoftDeleteError: handleSoftDeleteError,
      onRequestSoftDeleteConfirmation: handleRequestSoftDeleteConfirmation,
      onHardDeleteSuccess: handleHardDeleteSuccess,
      onHardDeleteError: handleHardDeleteError,
      onRequestHardDeleteConfirmation: handleRequestHardDeleteConfirmation,
    }),
    [
      advertisement,
      advertisementCardMode,
      onWhatsAppClick,
      onFloorplanClick,
      onGalleryClick,
      onVideoClick,
      handleSoftDeleteSuccess,
      handleSoftDeleteError,
      handleRequestSoftDeleteConfirmation,
      handleHardDeleteSuccess,
      handleHardDeleteError,
      handleRequestHardDeleteConfirmation,
    ]
  )

  const handleConfirmAction = useCallback(async () => {
    if (isProcessingStatus || !alertConfig?.isConfirm) return

    setIsProcessingStatus(true)

    try {
      if (alertConfig.confirmAction === 'hard-delete') {
        const success = await advertisementCardModel.hardDelete()
        if (success) {
          window.dispatchEvent(new CustomEvent('propertySoftDeleted', {
            detail: {
              advertisementId: advertisement?.id,
              deleted: true,
            }
          }))
        }
      } else {
        const success = await advertisementCardModel.softDelete(alertConfig.nextActiveStatus)
        if (success) {
          setIsActiveAdvertisement(alertConfig.nextActiveStatus)
          window.dispatchEvent(new CustomEvent('propertySoftDeleted', {
            detail: {
              advertisementId: advertisement?.id,
              active: alertConfig.nextActiveStatus,
            }
          }))
        }
      }
    } finally {
      setIsProcessingStatus(false)
      setAlertConfig(null)
    }
  }, [alertConfig, isProcessingStatus, advertisementCardModel, advertisement])

  const handleCarouselItemClick = useCallback(() => {
    if (isCarouselItem && advertisement) {
      const router = RouterModel.getInstance()
      const route = router.generateRoute(ROUTES['PROPERTY_DETAIL'].key, { id: advertisement.id })
      navigate(route)
    }
  }, [isCarouselItem, advertisement, navigate])

  return {
    // Dados do card
    advertisementCardCategory: advertisementCardModel.advertisementCardCategory,
    advertisementCardMode: advertisementCardModel.advertisementCardMode,
    advertisementCardButtons: advertisementCardModel.advertisementCardButtons,
    advertisementCardAmenities: advertisementCardModel.advertisementCardAmenities,
    advertisementCardCoverImageUrl: advertisementCardModel.advertisementCardCoverImageUrl,
    advertisementCardTitle: advertisementCardModel.advertisementCardTitle,
    advertisementCardSubtitle: advertisementCardModel.advertisementCardSubtitle,
    advertisementCardDescription: advertisementCardModel.advertisementCardDescription,

    // Flags de renderização
    renderAdvertisementCategoryLabel: advertisementCardModel.renderAdvertisementCategoryLabel,
    renderAdvertisementCoverImage: advertisementCardModel.renderAdvertisementCoverImage,
    renderAdvertisementAmenities: advertisementCardModel.renderAdvertisementAmenities,

    // Flags de modo
    isConfigMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.CONFIG,
    isMoreDetailsMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.MORE_DETAILS,
    isRedirectionMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.REDIRECTION,
    isMinimalistMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.MINIMALIST,
    isDetailsMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.DETAILS,
    isDistacMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.DISTAC,
    isDefaultMode: advertisementCardModel.advertisementCardMode === ADVERTISEMENT_CARD_MODES.DEFAULT,

    isActiveAdvertisement,
    isProcessingStatus,
    medias,
    showLightbox,
    setShowLightbox,
    alertConfig,
    handleCloseAlert,
    handleConfirmAction,
    handleCarouselItemClick,
  }
}
