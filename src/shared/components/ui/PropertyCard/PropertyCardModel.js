import { REAL_STATE_CARD_CATEGORIES } from '@constant/realStateCardCategories'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { RealEstateAdvertisement } from '@entity/RealEstateAdvertisement'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { RouterModel } from '@app/routes/RouterModel'
import { softDeleteAdvertisement } from '@api/realEstateAdvertisementAPI'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ROUTES } from '@constant/routes'

const generateRoute = (routeName, param) => RouterModel.getInstance().generateRoute(routeName, param)

const defaultButton = (realEstateAdvertisementId) => new ButtonModel(
  'Saiba Mais',
  'pink',
  'link',
  generateRoute(ROUTES['PROPERTY_DETAIL'].key, { id: realEstateAdvertisementId }),
  'rectangle',
  'Saiba Mais'
)

const editButton = (realEstateAdvertisementId) => new ButtonModel(
  'Editar Imóvel',
  'pink',
  'link',
  generateRoute(ROUTES['ADMIN_PROPERTIES_CONFIG'].key, { id: realEstateAdvertisementId }),
  'square',
  'Editar Imóvel'
)

const deleteButton = (realEstateAdvertisementId) => new ButtonModel(
  'Excluir Imóvel',
  'soft-brown',
  'button',
  'square',
  'Excluir Imóvel',
  () => onDelete(realEstateAdvertisementId)
)

const onDelete = async (realEstateAdvertisementId) => {
  try {
    if (!window.confirm('Tem certeza que deseja desabilitar este imóvel? Ele não aparecerá mais no site.')) return
    await softDeleteAdvertisement(realEstateAdvertisementId)
    alert('Propriedade desabilitada com sucesso!')
  } catch (err) {
    alert(`Erro ao desabilitar propriedade: ${err.message}`)
  }
}

const scheduleButton = () => new ButtonModel(
  'Agendar Visita',
  'brown',
  'button',
  'rectangle',
  'Agendar Visita',
)

const whatsAppButton = () => new ButtonModel(
  'Conversar pelo WhatsApp',
  'pink',
  'button',
  'square',
  'Conversar pelo WhatsApp',
)

const galleryButton = () => new ButtonModel(
  'Galeria',
  'white',
  'button',
  'rectangle',
  'Galeria',
)

const floorplanButton = () => new ButtonModel(
  'Planta',
  'white',
  'button',
  'rectangle',
  'Planta',
)

const videoButton = () => new ButtonModel(
  'Vídeo',
  'white',
  'button',
  'rectangle',
  'Vídeo',
)

/** Valida se o modo do card é válido */
const validateRealStateCardMode = (mode) => {
  if (!Object.values(REAL_STATE_CARD_MODES).includes(mode)) {
    throw new Error(`O modo ${mode} não é válido para PropertyCardModel`)
  }
}

/** Valida se o objeto é uma instância de RealEstateAdvertisement */
const validateRealEstateAdvertisementInstance = (realEstateAdvertisement) => {
  if (!(realEstateAdvertisement instanceof RealEstateAdvertisement)) {
    throw new Error(`O realEstateAdvertisement: ${realEstateAdvertisement} não é uma instância válida`)
  }
}

/**
 * PropertyCardModel
 * -----------------
 * Representa o card de imóvel no frontend, com modo de exibição
 * e callbacks de edição/deleção.
 */
export class PropertyCardModel {
  #realEstateAdvertisement
  #realStateCardMode
  #realStateCardCategory
  #realStateCardButtons = []
  #realStateCardDifferences = []
  #realStateCardCoverImageUrl
  #realStateCardTitle
  #realStateCardSubtitle
  #realStateCardDescription
  #shouldRenderRealStateCardCategoryLabel
  #shouldRenderRealStateCardCoverImage
  #shouldRenderRealStateCardDifferences

  constructor({ realEstateAdvertisement, realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT }) {
    validateRealEstateAdvertisementInstance(realEstateAdvertisement)
    validateRealStateCardMode(realStateCardMode)

    this.#realEstateAdvertisement = realEstateAdvertisement
    this.#realStateCardMode = realStateCardMode
    this.#realStateCardCategory = REAL_STATE_CARD_CATEGORIES[realEstateAdvertisement.estate?.type]
    this.#realStateCardTitle = realEstateAdvertisement.estate.title
    this.#realStateCardSubtitle = realEstateAdvertisement.estate.address.city
    this.#realStateCardDescription = `${realEstateAdvertisement.estate.area} m² - ${realEstateAdvertisement.estate.numberOfRooms} dormitórios`
    this.#realStateCardDifferences = realEstateAdvertisement.estate.differences?.map(d => new LabelModel(d.description, 'gray', 'small')) || []
    this.#shouldRenderRealStateCardCoverImage = this.hasRenderRealStateCardCoverImageSituation()
    this.#realStateCardCoverImageUrl = this.#shouldRenderRealStateCardCoverImage
      ? realEstateAdvertisement.getCoverImageUrl
      : null
    this.#realStateCardButtons = this.selectRealStateCardButtons()
    this.#shouldRenderRealStateCardCategoryLabel = this.hasRenderRealStateCardCategoryLabelSituation()
    this.#shouldRenderRealStateCardDifferences = this.hasRenderRealStateCardDifferencesSituation()
  }

  // ===== GETTERS =====
  get realEstateAdvertisement() { return this.#realEstateAdvertisement }
  get realStateCardMode() { return this.#realStateCardMode }
  get realStateCardCategory() { return this.#realStateCardCategory }
  get realStateCardButtons() { return this.#realStateCardButtons }
  get realStateCardDifferences() { return this.#realStateCardDifferences }
  get realStateCardCoverImageUrl() { return this.#realStateCardCoverImageUrl }
  get realStateCardTitle() { return this.#realStateCardTitle }
  get realStateCardSubtitle() { return this.#realStateCardSubtitle }
  get realStateCardDescription() { return this.#realStateCardDescription }
  get shouldRenderRealStateCardCategoryLabel() { return this.#shouldRenderRealStateCardCategoryLabel }
  get shouldRenderRealStateCardCoverImage() { return this.#shouldRenderRealStateCardCoverImage }
  get shouldRenderRealStateCardDifferences() { return this.#shouldRenderRealStateCardDifferences }

  // ===== SETTERS =====
  set realEstateAdvertisement(value) {
    validateRealEstateAdvertisementInstance(value)
    this.#realEstateAdvertisement = value
    this.#realStateCardCategory = REAL_STATE_CARD_CATEGORIES[value.estate?.type]
    this.#realStateCardTitle = value.estate.title
    this.#realStateCardSubtitle = value.estate.address.city
    this.#realStateCardDescription = `${value.estate.area} m² - ${value.estate.numberOfRooms} dormitórios`
    this.#realStateCardDifferences = value.estate.differences?.map(d => new LabelModel(d.description, 'gray', 'small')) || []
    this.#shouldRenderRealStateCardCoverImage = this.hasRenderRealStateCardCoverImageSituation()
    this.#realStateCardCoverImageUrl = this.#shouldRenderRealStateCardCoverImage
      ? value.getCoverImageUrl
      : null
    this.#realStateCardButtons = this.selectRealStateCardButtons()
    this.#shouldRenderRealStateCardCategoryLabel = this.hasRenderRealStateCardCategoryLabelSituation()
    this.#shouldRenderRealStateCardDifferences = this.hasRenderRealStateCardDifferencesSituation()
  }

  set realStateCardMode(value) {
    validateRealStateCardMode(value)
    this.#realStateCardMode = value
    this.#realStateCardButtons = this.selectRealStateCardButtons()
  }

  set realStateCardTitle(value) { this.#realStateCardTitle = value }
  set realStateCardSubtitle(value) { this.#realStateCardSubtitle = value }
  set realStateCardDescription(value) { this.#realStateCardDescription = value }
  set realStateCardDifferences(value) { this.#realStateCardDifferences = value }
  set realStateCardCoverImageUrl(value) { this.#realStateCardCoverImageUrl = value }

  // ===== PRIVATE METHODS =====
  selectRealStateCardButtons() {
    const buttons = []
    if (this.#realStateCardMode === REAL_STATE_CARD_MODES.CONFIG) {
      buttons.push(editButton(this.#realEstateAdvertisement.id))
      buttons.push(deleteButton(this.#realEstateAdvertisement.id))
    } else if (this.#realStateCardMode === REAL_STATE_CARD_MODES.REDIRECTION) {
      buttons.push(whatsAppButton())
      buttons.push(scheduleButton())
    } else if (this.#realStateCardMode === REAL_STATE_CARD_MODES.MORE_DETAILS) {
      buttons.push(galleryButton())
      buttons.push(floorplanButton())
      buttons.push(videoButton())
    } else {
      buttons.push(defaultButton(this.#realEstateAdvertisement.id))
    }
    return buttons
  }

  hasRenderRealStateCardCategoryLabelSituation() {
    return this.#realStateCardMode === REAL_STATE_CARD_MODES.REDIRECTION
  }

  hasRenderRealStateCardCoverImageSituation() {
    return this.#realStateCardCategory !== REAL_STATE_CARD_CATEGORIES.MORE_DETAILS
  }

  hasRenderRealStateCardDifferencesSituation() {
    return this.#realStateCardMode !== REAL_STATE_CARD_MODES.MORE_DETAILS
      && this.#realStateCardMode !== REAL_STATE_CARD_MODES.REDIRECTION
  }
}
