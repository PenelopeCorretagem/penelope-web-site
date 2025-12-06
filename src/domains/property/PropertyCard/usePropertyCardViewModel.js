import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PropertyCardModel,
  PROPERTY_CARD_CATEGORY_CONFIG,
  BUTTON_STATE_CONFIG,
  BUTTON_STATES
} from './PropertyCardModel'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { RouterModel } from '@app/routes/RouterModel'
import { getAnuncioById } from '@app/services/apiService'

/**
 * PropertyCardViewModel - Gerencia a lógica e apresentação do PropertyCard
 * Centraliza a lógica de negócio e comportamento
 */
class PropertyCardViewModel {
  constructor(model, navigate) {
    this.model = model
    this._categoryLabel = null
    this._buttons = null
    this._differenceLabels = null
    this._images = null
    this.router = RouterModel.getInstance()
    this.navigate = navigate
  }

  /**
   * Define as imagens processadas da API
   * Separa imagens por tipo: galeria, planta, vídeo, capa
   */
  setImages(rawImages) {
    if (!rawImages || rawImages.length === 0) {
      this._images = {
        gallery: [],
        floorplan: [],
        video: [],
        cover: '',
        first: '',
        main: '',
        all: [],
        hasImages: false
      }
      return
    }

    const findImagesByType = (type) => {
      return rawImages
        .filter(img => String(img.type).toLowerCase() === type.toLowerCase())
        .map(img => img.url)
    }

    const findImageByType = (type) => {
      return rawImages.find(img =>
        String(img.type).toLowerCase() === type.toLowerCase()
      )?.url || ''
    }

    const getFirstImage = () => {
      return rawImages.length > 0 ? rawImages[0].url : ''
    }

    this._images = {
      gallery: findImagesByType('galeria'),
      floorplan: findImagesByType('planta'),
      video: findImagesByType('video'),
      cover: findImageByType('capa'),
      first: getFirstImage(),
      main: findImagesByType('galeria')[0] ||
            findImagesByType('planta')[0] ||
            findImageByType('capa') ||
            getFirstImage(),
      all: rawImages.map(img => ({
        url: img.url,
        type: img.type
      })),
      hasImages: rawImages.length > 0
    }

    console.log('[PropertyCardViewModel] Images processed:', this._images)
  }

  get images() {
    return this._images || {
      gallery: [],
      floorplan: [],
      video: [],
      cover: '',
      first: '',
      main: '',
      all: [],
      hasImages: false
    }
  }

  get mainImage() {
    return this.images.main
  }

  get galleryImages() {
    return this.images.gallery
  }

  get floorplanImages() {
    return this.images.floorplan
  }

  get videoImages() {
    return this.images.video
  }

  get hasGalleryImages() {
    return this.images.gallery.length > 0
  }

  get hasFloorplanImages() {
    return this.images.floorplan.length > 0
  }

  get hasVideoImages() {
    return this.images.video.length > 0
  }

  get categoryLabel() {
    if (!this._categoryLabel) {
      const config = PROPERTY_CARD_CATEGORY_CONFIG[this.model.category]
      this._categoryLabel = new LabelModel(config.label, config.variant, 'medium')
    }
    return this._categoryLabel
  }

  get buttons() {
    if (!this._buttons) {
      const config = BUTTON_STATE_CONFIG[this.model.buttonState]
      const categoryConfig = PROPERTY_CARD_CATEGORY_CONFIG[this.model.category]

      this._buttons = config.buttons.map(buttonConfig => {
        const variant = buttonConfig.variant === 'primary'
          ? categoryConfig.variant
          : buttonConfig.variant

        return new ButtonModel(
          buttonConfig.text,
          variant,
          'button',
          null,
          buttonConfig.action,
          buttonConfig.fullWidth || false
        )
      })
    }
    return this._buttons
  }

  get formattedDifferences() {
    if (!this._differenceLabels) {
      this._differenceLabels = this.model.differences.map(diff =>
        new LabelModel(diff, 'gray', 'small')
      )
    }
    return this._differenceLabels
  }

  get hasDifferences() {
    return this.model.hasDifferences
  }

  get hasValidImage() {
    return this.model.hasValidImage || !!this.mainImage
  }

  get labelPosition() {
    return this.model.hasImage
      ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]'
      : ''
  }

  get containerClasses() {
    const baseClasses = ['flex', 'flex-col', 'max-w-sm']

    if (this.model.hasHoverEffect) {
      baseClasses.push('transition-transform', 'duration-200', 'hover:scale-105')
    }

    return baseClasses.join(' ')
  }

  get cardClasses() {
    const baseClasses = [
      'bg-default-light', 'p-card', 'md:p-card-md', 'gap-card', 'md:gap-card-md',
      'flex', 'w-full', 'flex-col', 'items-start', 'relative'
    ]

    if (this.model.hasImage) {
      baseClasses.push('rounded-b-sm')
    } else {
      baseClasses.push('rounded-sm')
    }

    if (this.model.hasShadow) {
      baseClasses.push('drop-shadow-md')
    }

    return baseClasses.join(' ')
  }

  get shouldRenderButtons() {
    return this.model.hasButton && this.buttons.length > 0
  }

  get shouldRenderImage() {
    return this.model.hasImage && this.hasValidImage
  }

  get shouldRenderLabel() {
    return this.model.hasLabel && this.categoryLabel
  }

  get shouldRenderDifferences() {
    return this.hasDifferences
  }

  getButtonLayoutForState(buttonState) {
    switch (buttonState) {
      case BUTTON_STATES.GERAL:
        return 'grid'
      case BUTTON_STATES.CONTATO:
        return 'column'
      default:
        return 'single'
    }
  }

  handleButtonClick(action, onButtonClick) {
    if (typeof onButtonClick === 'function') {
      onButtonClick({
        action,
        category: this.model.category,
        title: this.model.title,
        subtitle: this.model.subtitle,
        buttonState: this.model.buttonState
      })
    }

    this._executeDefaultAction(action)
  }

  _executeDefaultAction(action) {
    console.log('Executing action:', action)
    const actions = {
      whatsapp: () => console.log('Iniciando contato via WhatsApp'),
      visit: () => console.log('Agendando visita'),
      gallery: () => console.log('Visualizando galeria'),
      floorplan: () => console.log('Visualizando planta'),
      video: () => console.log('Assistindo vídeo'),
      default: () => {
        console.log('Navigating to property detail')
        const propertyId = this.model?.id || 1
        const route = this.router.generateRoute('PROPERTY_DETAIL', { id: propertyId })
        console.log('Generated route:', route)
        console.log('Navigate function:', this.navigate)
        if (this.navigate) {
          console.log('Using navigate')
          this.navigate(route)
        } else {
          console.log('Using window.location')
          window.location.href = route
        }
      }
    }

    const actionHandler = actions[action] || actions.default
    actionHandler()
  }
}

export function usePropertyCardViewModel(props) {
  const navigate = useNavigate()
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  // ✅ SOLUÇÃO: Criar novo objeto de imagens para forçar re-render
  const [imagesState, setImagesState] = useState({
    gallery: [],
    floorplan: [],
    video: [],
    cover: '',
    first: '',
    main: '',
    all: [],
    hasImages: false
  })

  const [viewModel] = useState(() => {
    try {
      const model = new PropertyCardModel(props)
      return new PropertyCardViewModel(model, navigate)
    } catch (error) {
      console.error('Erro ao criar PropertyCardModel:', error)
      return null
    }
  })

  // Busca as imagens da API quando o ID estiver disponível
  useEffect(() => {
    const propertyId = props.id

    if (!viewModel || !props.id) {
      console.log('[PropertyCardViewModel] Skipping image fetch - no valid ID in props')
      return
    }

    let mounted = true
    const fetchImages = async () => {
      setIsLoadingImages(true)
      try {
        console.log('[PropertyCardViewModel] Fetching images for property ID:', propertyId)
        const response = await getAnuncioById(propertyId)
        const data = response?.data

        if (!data) {
          console.warn('[PropertyCardViewModel] No data returned from API')
          if (mounted) {
            viewModel.setImages([])
            // ✅ Criar NOVO objeto para forçar re-render
            setImagesState({ ...viewModel.images })
          }
          return
        }

        const property = data.property || {}
        const rawImages = property.images || []

        console.log('[PropertyCardViewModel] Raw images from API:', rawImages)

        if (mounted) {
          viewModel.setImages(rawImages)
          // ✅ Criar NOVO objeto para forçar re-render
          setImagesState({ ...viewModel.images })
          console.log('✅ [PropertyCardViewModel] State updated with images:', viewModel.images)
        }
      } catch (error) {
        console.error('[PropertyCardViewModel] Error fetching images:', error)
        if (mounted) {
          viewModel.setImages([])
          setImagesState({ ...viewModel.images })
        }
      } finally {
        if (mounted) {
          setIsLoadingImages(false)
        }
      }
    }

    fetchImages()

    return () => {
      mounted = false
    }
  }, [props.id, viewModel])

  const handleButtonClick = useCallback((action) => {
    if (!viewModel) return
    console.log('Button clicked with action:', action)
    viewModel.handleButtonClick(action, props.onButtonClick)
  }, [viewModel, props.onButtonClick])

  if (!viewModel) {
    return {
      categoryLabel: null,
      buttons: [],
      formattedDifferences: [],
      hasDifferences: false,
      hasValidImage: false,
      labelPosition: '',
      containerClasses: 'flex flex-col max-w-sm',
      cardClasses: 'bg-default-light p-card rounded-sm',
      shouldRenderButtons: false,
      shouldRenderImage: false,
      shouldRenderLabel: false,
      shouldRenderDifferences: false,
      buttonLayout: 'single',
      handleButtonClick: () => {},
      hasError: true,
      model: null,
      images: null,
      mainImage: '',
      galleryImages: [],
      floorplanImages: [],
      videoImages: [],
      hasGalleryImages: false,
      hasFloorplanImages: false,
      hasVideoImages: false,
      isLoadingImages: false
    }
  }

  return {
    categoryLabel: viewModel.categoryLabel,
    buttons: viewModel.buttons,
    formattedDifferences: viewModel.formattedDifferences,
    hasDifferences: viewModel.hasDifferences,
    hasValidImage: viewModel.hasValidImage,
    labelPosition: viewModel.labelPosition,
    containerClasses: viewModel.containerClasses,
    cardClasses: viewModel.cardClasses,
    shouldRenderButtons: viewModel.shouldRenderButtons,
    shouldRenderImage: viewModel.shouldRenderImage,
    shouldRenderLabel: viewModel.shouldRenderLabel,
    shouldRenderDifferences: viewModel.shouldRenderDifferences,
    buttonLayout: viewModel.getButtonLayoutForState(viewModel.model.buttonState),
    handleButtonClick,
    hasError: false,
    model: viewModel.model,
    // ✅ Usar o estado ao invés dos getters diretos
    images: imagesState,
    mainImage: imagesState.main || '',
    galleryImages: imagesState.gallery || [],
    floorplanImages: imagesState.floorplan || [],
    videoImages: imagesState.video || [],
    hasGalleryImages: (imagesState.gallery || []).length > 0,
    hasFloorplanImages: (imagesState.floorplan || []).length > 0,
    hasVideoImages: (imagesState.video || []).length > 0,
    isLoadingImages,
    // 🔍 Debug
    _debug: {
      propsId: props.id,
      modelId: viewModel.model?.id,
      imagesProcessed: imagesState.hasImages,
      rawImages: imagesState,
      galleryCount: imagesState.gallery?.length || 0,
      floorplanCount: imagesState.floorplan?.length || 0
    }
  }
}

export { PropertyCardViewModel }
