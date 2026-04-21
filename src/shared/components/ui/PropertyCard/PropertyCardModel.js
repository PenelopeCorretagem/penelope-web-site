import { REAL_STATE_CARD_CATEGORIES } from '@constant/realStateCardCategories'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { Advertisement } from '@dtos/Advertisement'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { RouterModel } from '@app/routes/RouterModel'
import { updateAdvertisementStatus } from '@service-penelopec/AdvertisementService'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ROUTES } from '@constant/routes'
import { generateSlug } from '@shared/utils/sluggy/generateSlugUtil'

const generateRoute = (routeName, param) => RouterModel.getInstance().generateRoute(routeName, param)

const defaultButton = (advertisementId) => new ButtonModel(
  'Saiba Mais',
  'pink',
  'link',
  generateRoute(ROUTES['PROPERTY_DETAIL'].key, { id: advertisementId }),
  'rectangle',
  'Saiba Mais'
)

const editButton = (advertisementId) => new ButtonModel(
  'Editar Imóvel',
  'pink',
  'link',
  generateRoute(ROUTES['ADMIN_PROPERTIES_CONFIG'].key, { id: advertisementId }),
  'square',
  'Editar Imóvel'
)

const scheduleButton = (advertisement) => {
  const propertyTitle = advertisement.estate?.title || 'imovel'
  const propertySlug = generateSlug(propertyTitle)
  const scheduleUrl = `${generateRoute(ROUTES['SCHEDULE'].key)}?property=${propertySlug}`

  return new ButtonModel(
    'Agendar Visita',
    'brown',
    'link',
    scheduleUrl,
    'rectangle',
    'Agendar Visita'
  )
}

const whatsAppButton = (onWhatsAppClick = null) => new ButtonModel(
  'Conversar pelo WhatsApp',
  'pink',
  'button',
  null,
  'rectangle',
  'Conversar pelo WhatsApp',
  onWhatsAppClick
)

const galleryButton = (onClick = null) => new ButtonModel(
  'Galeria',
  'white',
  'button',
  null,
  'rectangle',
  'Galeria',
  onClick
)

const floorplanButton = (onClick = null) => new ButtonModel(
  'Planta',
  'white',
  'button',
  null,
  'rectangle',
  'Planta',
  onClick
)

const videoButton = (onClick = null) => new ButtonModel(
  'Vídeo',
  'white',
  'button',
  null,
  'rectangle',
  'Vídeo',
  onClick
)

/** Valida se o modo do card é válido */
const validateRealStateCardMode = (mode) => {
  if (!Object.values(REAL_STATE_CARD_MODES).includes(mode)) {
    throw new Error(`O modo ${mode} não é válido para PropertyCardModel`)
  }
}

/** Valida se o objeto é uma instância de Advertisement */
const validateAdvertisementInstance = (advertisement) => {
  if (!(advertisement instanceof Advertisement)) {
    throw new Error(`O Advertisement: ${advertisement} não é uma instância válida`)
  }
}

/**
 * PropertyCardModel
 * -----------------
 * Representa o card de imóvel no frontend, com modo de exibição
 * e callbacks de edição/deleção.
 */
export class PropertyCardModel {
  #advertisement
  #realStateCardMode
  #realStateCardCategory
  #realStateCardButtons = []
  #realStateCardFeatures = []
  #realStateCardCoverImageUrl
  #realStateCardTitle
  #realStateCardSubtitle
  #realStateCardDescription
  #renderRealStateCardCategoryLabel
  #renderRealStateCardCoverImage
  #renderRealStateCardFeatures
  #onWhatsAppClick
  #onVideoClick
  #onGalleryClick
  #onFloorplanClick
  #onSoftDeleteSuccess
  #onSoftDeleteError
  #onRequestSoftDeleteConfirmation

  constructor({
    advertisement,
    realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT,
    onWhatsAppClick = null,
    onGalleryClick = null,
    onFloorplanClick = null,
    onVideoClick = null,
    onSoftDeleteSuccess = null,
    onSoftDeleteError = null,
    onRequestSoftDeleteConfirmation = null
  }) {
    validateAdvertisementInstance(advertisement)
    validateRealStateCardMode(realStateCardMode)

    this.#advertisement = advertisement
    this.#realStateCardMode = realStateCardMode
    this.#onWhatsAppClick = onWhatsAppClick
    this.#onGalleryClick = onGalleryClick
    this.#onFloorplanClick = onFloorplanClick
    this.#onVideoClick = onVideoClick
    this.#onSoftDeleteSuccess = onSoftDeleteSuccess
    this.#onSoftDeleteError = onSoftDeleteError
    this.#onRequestSoftDeleteConfirmation = onRequestSoftDeleteConfirmation
    this.#realStateCardCategory = new LabelModel(
      REAL_STATE_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['label'] || 'Imóvel',
      REAL_STATE_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['variant'] || 'gray',
      'small'
    )
    this.#realStateCardTitle = this.#advertisement.estate?.title || 'Título não disponível'
    this.#realStateCardSubtitle = this.#advertisement.estate?.address?.city || 'Cidade não informada'
    this.#realStateCardDescription = `${this.#advertisement.estate?.area || '?'} m² - ${this.#advertisement.estate?.numberOfRooms || '?'} dormitórios`
    this.#realStateCardFeatures = this.#advertisement.estate?.features || []
    this.#renderRealStateCardCoverImage = this.shouldRenderRealStateCardCoverImage()
    this.#realStateCardCoverImageUrl = this.#advertisement.estate?.getCoverImageUrl?.()
    this.#realStateCardButtons = this.selectRealStateCardButtons()
    this.#renderRealStateCardCategoryLabel = this.shouldRenderRealStateCardCategoryLabel()
    this.#renderRealStateCardFeatures = this.shouldRenderRealStateCardFeatures()
  }

  // ===== GETTERS =====
  get advertisement() { return this.#advertisement }
  get realStateCardMode() { return this.#realStateCardMode }
  get realStateCardCategory() { return this.#realStateCardCategory }
  get realStateCardButtons() { return this.#realStateCardButtons }
  get realStateCardFeatures() { return this.#realStateCardFeatures }
  get realStateCardCoverImageUrl() { return this.#realStateCardCoverImageUrl }
  get realStateCardTitle() { return this.#realStateCardTitle }
  get realStateCardSubtitle() { return this.#realStateCardSubtitle }
  get realStateCardDescription() { return this.#realStateCardDescription }
  get renderRealStateCardCategoryLabel() { return this.#renderRealStateCardCategoryLabel }
  get renderRealStateCardCoverImage() { return this.#renderRealStateCardCoverImage }
  get renderRealStateCardFeatures() { return this.#renderRealStateCardFeatures }

  // ===== SETTERS =====
  set advertisement(value) {
    validateAdvertisementInstance(value)
    this.#advertisement = value
    this.#realStateCardCategory = new LabelModel(
      REAL_STATE_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['label'] || 'Imóvel',
      REAL_STATE_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['variant'] || 'gray',
      'small'
    )
    this.#realStateCardTitle = value.estate?.title || 'Título não disponível'
    this.#realStateCardSubtitle = value.estate?.address?.city || 'Cidade não informada'
    this.#realStateCardDescription = `${value.estate?.area || '?'} m² - ${value.estate?.numberOfRooms || '?'} dormitórios`
    this.#realStateCardFeatures = value.estate?.features?.map(d => new LabelModel(d.description, 'gray', 'small')) || []
    this.#renderRealStateCardCoverImage = this.shouldRenderRealStateCardCoverImage()
    this.#realStateCardCoverImageUrl = this.#renderRealStateCardCoverImage
      ? value.estate?.getCoverImageUrl?.() || null
      : null
    this.#realStateCardButtons = this.selectRealStateCardButtons()
    this.#renderRealStateCardCategoryLabel = this.shouldRenderRealStateCardCategoryLabel()
    this.#renderRealStateCardFeatures = this.shouldRenderRealStateCardFeatures()
  }

  set realStateCardMode(value) {
    validateRealStateCardMode(value)
    this.#realStateCardMode = value
    this.#realStateCardButtons = this.selectRealStateCardButtons()
  }

  set realStateCardTitle(value) { this.#realStateCardTitle = value }
  set realStateCardSubtitle(value) { this.#realStateCardSubtitle = value }
  set realStateCardDescription(value) { this.#realStateCardDescription = value }
  set realStateCardFeatures(value) { this.#realStateCardFeatures = value }
  set realStateCardCoverImageUrl(value) { this.#realStateCardCoverImageUrl = value }

  // Soft-delete method: faz a confirmação, chama a API e emite evento global para sincronização
  async softDelete(nextActiveStatus = !this.#advertisement.active) {
    try {
      // Chama o endpoint de atualização de status
      await updateAdvertisementStatus(this.#advertisement.id, nextActiveStatus)

      this.#advertisement.active = nextActiveStatus

      if (typeof this.#onSoftDeleteSuccess === 'function') {
        this.#onSoftDeleteSuccess(`Propriedade ${nextActiveStatus ? 'habilitada' : 'desabilitada'} com sucesso!`)
      }
      return true
    } catch (err) {
      if (typeof this.#onSoftDeleteError === 'function') {
        this.#onSoftDeleteError(`Erro ao desabilitar propriedade: ${err.message}`)
      }
      return false
    }
  }

  // ===== PRIVATE METHODS =====
  selectRealStateCardButtons() {
    const buttons = []
    if (this.#realStateCardMode === REAL_STATE_CARD_MODES.CONFIG) {
      buttons.push(editButton(this.#advertisement.id))
      buttons.push(new ButtonModel(
        'Excluir Imóvel',
        'soft-brown',
        'button',
        null,
        'square',
        'Excluir Imóvel',
        () => {
          if (typeof this.#onRequestSoftDeleteConfirmation === 'function') {
            this.#onRequestSoftDeleteConfirmation()
          }
        }
      ))
    } else if (this.#realStateCardMode === REAL_STATE_CARD_MODES.REDIRECTION) {
      buttons.push(whatsAppButton(this.#onWhatsAppClick))
      buttons.push(scheduleButton(this.#advertisement))
    } else if (this.#realStateCardMode === REAL_STATE_CARD_MODES.DETAILS) {
      buttons.push(galleryButton(this.#onGalleryClick))
      buttons.push(floorplanButton(this.#onFloorplanClick))
      buttons.push(videoButton(this.#onVideoClick))
    } else {
      buttons.push(defaultButton(this.#advertisement.id))
    }
    return buttons
  }

  shouldRenderRealStateCardCategoryLabel() {
    return this.#realStateCardMode !== REAL_STATE_CARD_MODES.REDIRECTION
  }

  shouldRenderRealStateCardCoverImage() {
    return this.#realStateCardMode !== REAL_STATE_CARD_MODES.MORE_DETAILS
      && this.#realStateCardMode !== REAL_STATE_CARD_MODES.DISTAC
      && this.#realStateCardMode !== REAL_STATE_CARD_MODES.DETAILS
      && this.#realStateCardMode !== REAL_STATE_CARD_MODES.REDIRECTION
  }

  shouldRenderRealStateCardFeatures() {
    return this.#realStateCardMode !== REAL_STATE_CARD_MODES.MORE_DETAILS
      && this.#realStateCardMode !== REAL_STATE_CARD_MODES.REDIRECTION
      && this.#realStateCardMode !== REAL_STATE_CARD_MODES.DETAILS
  }
}
