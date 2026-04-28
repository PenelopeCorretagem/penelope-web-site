import { ADVERTISEMENT_CARD_CATEGORIES } from '@constant/advertisementCardCategories'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
import { Advertisement } from '@dtos/Advertisement'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { RouterModel } from '@app/routes/RouterModel'
import { deleteAdvertisement, updateAdvertisementStatus } from '@service-penelopec/advertisementService'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ROUTES } from '@constant/routes'
import { generateSlug } from '@shared/utils/sluggy/generateSlugUtil'

const DELETE_BLOCKED_BY_APPOINTMENTS_MESSAGE = 'Não é possível deletar esse imóvel pois existe um histórico de agendamentos atrelado a ele.'

const resolveApiErrorMessage = (error, fallbackMessage) => {
  const apiMessage = error?.response?.data?.message
  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}

const isDeleteBlockedByAppointments = (error) => {
  const rawMessage = [
    error?.response?.data?.message,
    error?.response?.data?.error,
    error?.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return rawMessage.includes('histórico de agendamentos')
    || rawMessage.includes('historico de agendamentos')
    || rawMessage.includes('fk_agendamento_empreendimento')
    || (rawMessage.includes('agendamento') && rawMessage.includes('empreendimento'))
}

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
  const advertisementTitle = advertisement.estate?.title || 'imóvel'
  const advertisementSlug = generateSlug(advertisementTitle)
  const scheduleUrl = `${generateRoute(ROUTES['SCHEDULE'].key)}?advertisement=${advertisementSlug}`

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
const validateAdvertisementMode = (mode) => {
  if (!Object.values(ADVERTISEMENT_CARD_MODES).includes(mode)) {
    throw new Error(`O modo ${mode} não é válido para AdvertisementCardModel`)
  }
}

/** Valida se o objeto é uma instância de Advertisement */
const validateAdvertisementInstance = (advertisement) => {
  if (!(advertisement instanceof Advertisement)) {
    throw new Error(`O Advertisement: ${advertisement} não é uma instância válida`)
  }
}

/**
 * AdvertisementCardModel
 * -----------------
 * Representa o card de imóvel no frontend, com modo de exibição
 * e callbacks de edição/deleção.
 */
export class AdvertisementCardModel {
  #advertisement
  #advertisementCardMode
  #advertisementCardCategory
  #advertisementCardButtons = []
  #advertisementCardAmenities = []
  #advertisementCardCoverImageUrl
  #advertisementCardTitle
  #advertisementCardSubtitle
  #advertisementCardDescription
  #renderAdvertisementCategoryLabel
  #renderAdvertisementCoverImage
  #renderAdvertisementAmenities
  #onWhatsAppClick
  #onVideoClick
  #onGalleryClick
  #onFloorplanClick
  #onSoftDeleteSuccess
  #onSoftDeleteError
  #onRequestSoftDeleteConfirmation
  #onHardDeleteSuccess
  #onHardDeleteError
  #onRequestHardDeleteConfirmation

  constructor({
    advertisement,
    advertisementCardMode = ADVERTISEMENT_CARD_MODES.DEFAULT,
    onWhatsAppClick = null,
    onGalleryClick = null,
    onFloorplanClick = null,
    onVideoClick = null,
    onSoftDeleteSuccess = null,
    onSoftDeleteError = null,
    onRequestSoftDeleteConfirmation = null,
    onHardDeleteSuccess = null,
    onHardDeleteError = null,
    onRequestHardDeleteConfirmation = null,
  }) {
    validateAdvertisementInstance(advertisement)
    validateAdvertisementMode(advertisementCardMode)

    this.#advertisement = advertisement
    this.#advertisementCardMode = advertisementCardMode
    this.#onWhatsAppClick = onWhatsAppClick
    this.#onGalleryClick = onGalleryClick
    this.#onFloorplanClick = onFloorplanClick
    this.#onVideoClick = onVideoClick
    this.#onSoftDeleteSuccess = onSoftDeleteSuccess
    this.#onSoftDeleteError = onSoftDeleteError
    this.#onRequestSoftDeleteConfirmation = onRequestSoftDeleteConfirmation
    this.#onHardDeleteSuccess = onHardDeleteSuccess
    this.#onHardDeleteError = onHardDeleteError
    this.#onRequestHardDeleteConfirmation = onRequestHardDeleteConfirmation
    this.#advertisementCardCategory = new LabelModel(
      ADVERTISEMENT_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['label'] || 'Imóvel',
      ADVERTISEMENT_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['variant'] || 'gray',
      'small'
    )
    this.#advertisementCardTitle = this.#advertisement.estate?.title || 'Título não disponível'
    this.#advertisementCardSubtitle = this.#advertisement.estate?.address?.city || 'Cidade não informada'
    this.#advertisementCardDescription = `${this.#advertisement.estate?.area || '?'} m² - ${this.#advertisement.estate?.numberOfRooms || '?'} dormitórios`
    this.#advertisementCardAmenities = this.#advertisement.estate?.amenities || []
    this.#renderAdvertisementCoverImage = this.shouldRenderAdvertisementCoverImage()
    this.#advertisementCardCoverImageUrl = this.#advertisement.estate?.getCoverImageUrl?.()
    this.#advertisementCardButtons = this.selectAdvertisementButtons()
    this.#renderAdvertisementCategoryLabel = this.shouldRenderAdvertisementCategoryLabel()
    this.#renderAdvertisementAmenities = this.shouldRenderAdvertisementAmenities()
  }

  // ===== GETTERS =====
  get advertisement() { return this.#advertisement }
  get advertisementCardMode() { return this.#advertisementCardMode }
  get advertisementCardCategory() { return this.#advertisementCardCategory }
  get advertisementCardButtons() { return this.#advertisementCardButtons }
  get advertisementCardAmenities() { return this.#advertisementCardAmenities }
  get advertisementCardCoverImageUrl() { return this.#advertisementCardCoverImageUrl }
  get advertisementCardTitle() { return this.#advertisementCardTitle }
  get advertisementCardSubtitle() { return this.#advertisementCardSubtitle }
  get advertisementCardDescription() { return this.#advertisementCardDescription }
  get renderAdvertisementCategoryLabel() { return this.#renderAdvertisementCategoryLabel }
  get renderAdvertisementCoverImage() { return this.#renderAdvertisementCoverImage }
  get renderAdvertisementAmenities() { return this.#renderAdvertisementAmenities }

  // ===== SETTERS =====
  set advertisement(value) {
    validateAdvertisementInstance(value)
    this.#advertisement = value
    this.#advertisementCardCategory = new LabelModel(
      ADVERTISEMENT_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['label'] || 'Imóvel',
      ADVERTISEMENT_CARD_CATEGORIES[this.#advertisement.estate?.type?.key]?.['variant'] || 'gray',
      'small'
    )
    this.#advertisementCardTitle = value.estate?.title || 'Título não disponível'
    this.#advertisementCardSubtitle = value.estate?.address?.city || 'Cidade não informada'
    this.#advertisementCardDescription = `${value.estate?.area || '?'} m² - ${value.estate?.numberOfRooms || '?'} dormitórios`
    this.#advertisementCardAmenities = value.estate?.amenities?.map(d => new LabelModel(d.description, 'gray', 'small')) || []
    this.#renderAdvertisementCoverImage = this.shouldRenderAdvertisementCoverImage()
    this.#advertisementCardCoverImageUrl = this.#renderAdvertisementCoverImage
      ? value.estate?.getCoverImageUrl?.() || null
      : null
    this.#advertisementCardButtons = this.selectAdvertisementButtons()
    this.#renderAdvertisementCategoryLabel = this.shouldRenderAdvertisementCategoryLabel()
    this.#renderAdvertisementAmenities = this.shouldRenderAdvertisementAmenities()
  }

  set advertisementCardMode(value) {
    validateAdvertisementMode(value)
    this.#advertisementCardMode = value
    this.#advertisementCardButtons = this.selectAdvertisementButtons()
  }

  set advertisementCardTitle(value) { this.#advertisementCardTitle = value }
  set advertisementCardSubtitle(value) { this.#advertisementCardSubtitle = value }
  set advertisementCardDescription(value) { this.#advertisementCardDescription = value }
  set advertisementCardAmenities(value) { this.#advertisementCardAmenities = value }
  set advertisementCardCoverImageUrl(value) { this.#advertisementCardCoverImageUrl = value }

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

  async hardDelete() {
    try {
      await deleteAdvertisement(this.#advertisement.id)

      if (typeof this.#onHardDeleteSuccess === 'function') {
        this.#onHardDeleteSuccess('Propriedade excluída definitivamente com sucesso!')
      }
      return true
    } catch (err) {
      const errorMessage = isDeleteBlockedByAppointments(err)
        ? DELETE_BLOCKED_BY_APPOINTMENTS_MESSAGE
        : resolveApiErrorMessage(err, 'Erro ao excluir propriedade definitivamente')

      if (typeof this.#onHardDeleteError === 'function') {
        this.#onHardDeleteError(errorMessage)
      }
      return false
    }
  }

  // ===== PRIVATE METHODS =====
  selectAdvertisementButtons() {
    const buttons = []
    if (this.#advertisementCardMode === ADVERTISEMENT_CARD_MODES.CONFIG) {
      buttons.push(editButton(this.#advertisement.id))
      buttons.push(new ButtonModel(
        'Desabilitar Imóvel',
        'soft-brown',
        'button',
        null,
        'square',
        'Desabilitar Imóvel',
        () => {
          if (typeof this.#onRequestSoftDeleteConfirmation === 'function') {
            this.#onRequestSoftDeleteConfirmation()
          }
        }
      ))
      buttons.push(new ButtonModel(
        'Excluir Definitivamente',
        'pink',
        'button',
        null,
        'square',
        'Excluir Definitivamente',
        () => {
          if (typeof this.#onRequestHardDeleteConfirmation === 'function') {
            this.#onRequestHardDeleteConfirmation()
          }
        }
      ))
    } else if (this.#advertisementCardMode === ADVERTISEMENT_CARD_MODES.REDIRECTION) {
      buttons.push(whatsAppButton(this.#onWhatsAppClick))
      buttons.push(scheduleButton(this.#advertisement))
    } else if (this.#advertisementCardMode === ADVERTISEMENT_CARD_MODES.DETAILS) {
      buttons.push(galleryButton(this.#onGalleryClick))
      buttons.push(floorplanButton(this.#onFloorplanClick))
      buttons.push(videoButton(this.#onVideoClick))
    } else {
      buttons.push(defaultButton(this.#advertisement.id))
    }
    return buttons
  }

  shouldRenderAdvertisementCategoryLabel() {
    return this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.REDIRECTION
  }

  shouldRenderAdvertisementCoverImage() {
    return this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.MORE_DETAILS
      && this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.DISTAC
      && this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.DETAILS
      && this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.REDIRECTION
  }

  shouldRenderAdvertisementAmenities() {
    return this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.MORE_DETAILS
      && this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.REDIRECTION
      && this.#advertisementCardMode !== ADVERTISEMENT_CARD_MODES.DETAILS
  }
}
