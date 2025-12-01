import { REAL_STATE_CARD_CATEGORIES } from '@constant/realStateCardCategories'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { RealEstateAdvertisement } from '@entity/RealEstateAdvertisement'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { RouterModel } from '@app/routes/RouterModel'
import { getAdvertisementById, updateAdvertisement } from '@app/services/api/realEstateAdvertisementAPI'
import { PropertyConfigModel } from '../../../../modules/management/pages/PropertyConfig/PropertyConfigModel'
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
  #realStateCardFeatures = []
  #realStateCardCoverImageUrl
  #realStateCardTitle
  #realStateCardSubtitle
  #realStateCardDescription
  #renderRealStateCardCategoryLabel
  #renderRealStateCardCoverImage
  #renderRealStateCardFeatures

  constructor({ realEstateAdvertisement, realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT }) {
    validateRealEstateAdvertisementInstance(realEstateAdvertisement)
    validateRealStateCardMode(realStateCardMode)

    this.#realEstateAdvertisement = realEstateAdvertisement
    this.#realStateCardMode = realStateCardMode
    this.#realStateCardCategory = new LabelModel(
      REAL_STATE_CARD_CATEGORIES[this.#realEstateAdvertisement.estate?.type?.key]?.['label'] || 'Imóvel',
      REAL_STATE_CARD_CATEGORIES[this.#realEstateAdvertisement.estate?.type?.key]?.['variant'] || 'gray',
      'small'
    )
    this.#realStateCardTitle = realEstateAdvertisement.estate?.title || 'Título não disponível'
    this.#realStateCardSubtitle = realEstateAdvertisement.estate?.address?.city || 'Cidade não informada'
    this.#realStateCardDescription = `${realEstateAdvertisement.estate?.area || '?'} m² - ${realEstateAdvertisement.estate?.numberOfRooms || '?'} dormitórios`
    this.#realStateCardFeatures = realEstateAdvertisement.estate?.features || []
    this.#renderRealStateCardCoverImage = this.shouldRenderRealStateCardCoverImage()
    this.#realStateCardCoverImageUrl = this.realEstateAdvertisement.estate?.getCoverImageUrl?.()
    this.#realStateCardButtons = this.selectRealStateCardButtons()
    this.#renderRealStateCardCategoryLabel = this.shouldRenderRealStateCardCategoryLabel()
    this.#renderRealStateCardFeatures = this.shouldRenderRealStateCardFeatures()
  }

  // ===== GETTERS =====
  get realEstateAdvertisement() { return this.#realEstateAdvertisement }
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
  set realEstateAdvertisement(value) {
    validateRealEstateAdvertisementInstance(value)
    this.#realEstateAdvertisement = value
    this.#realStateCardCategory = new LabelModel(
      REAL_STATE_CARD_CATEGORIES[this.#realEstateAdvertisement.estate?.type?.key]?.['label'] || 'Imóvel',
      REAL_STATE_CARD_CATEGORIES[this.#realEstateAdvertisement.estate?.type?.key]?.['variant'] || 'gray',
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
  async softDelete() {
    try {
      console.log('🗑️ [PROPERTY CARD MODEL] Soft deleting property:', this.#realEstateAdvertisement.id)
      if (!window.confirm('Tem certeza que deseja desabilitar este imóvel? Ele não aparecerá mais no site.')) return false
      // Buscar o anúncio atual para montar o payload corretamente
      const currentAdvertisement = await getAdvertisementById(this.#realEstateAdvertisement.id)

      // Montar request usando o PropertyConfigModel como na área de administração
      const propertyConfigModel = PropertyConfigModel.fromAdvertisementEntity(currentAdvertisement)
      const currentFormData = propertyConfigModel.toFormData()
      const disableRequest = propertyConfigModel.toApiRequest({
        ...currentFormData,
        active: false
      })

      // Atualiza o anúncio
      await updateAdvertisement(this.#realEstateAdvertisement.id, disableRequest)

      // Emite evento global para que listeners (ex.: views de listagem) recarreguem dados
      try {
        window.dispatchEvent(new CustomEvent('propertySoftDeleted', { detail: { id: this.#realEstateAdvertisement.id } }))
      } catch (err) {
        // Se CustomEvent não estiver disponível, ignorar
      }

      alert('Propriedade desabilitada com sucesso!')
      return true
    } catch (err) {
      alert(`Erro ao desabilitar propriedade: ${err.message}`)
      return false
    }
  }

  // ===== PRIVATE METHODS =====
  selectRealStateCardButtons() {
    const buttons = []
    if (this.#realStateCardMode === REAL_STATE_CARD_MODES.CONFIG) {
      buttons.push(editButton(this.#realEstateAdvertisement.id))
      // cria o botão de exclusão com handler ligado à instância do modelo
      buttons.push(new ButtonModel(
        'Excluir Imóvel',
        'soft-brown',
        'button',
        null,
        'square',
        'Excluir Imóvel',
        () => { this.softDelete() }
      ))
    } else if (this.#realStateCardMode === REAL_STATE_CARD_MODES.REDIRECTION) {
      buttons.push(whatsAppButton())
      buttons.push(scheduleButton())
    } else if (this.#realStateCardMode === REAL_STATE_CARD_MODES.DETAILS) {
      buttons.push(galleryButton())
      buttons.push(floorplanButton())
      buttons.push(videoButton())
    } else {
      buttons.push(defaultButton(this.#realEstateAdvertisement.id))
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
