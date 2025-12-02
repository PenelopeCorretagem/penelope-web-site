import { IMAGE_TYPES } from '@constant/imageTypes'

/**
 * Representa um imóvel e suas informações principais.
 *
 * Campos privados:
 * - #id
 * - #title
 * - #description
 * - #area
 * - #numberOfRooms
 * - #type
 * - #address
 * - #standAddress
 * - #images (Array<ImageEstate>)
 * - #features (Array<Feature>)
 *
 * Todos os acessos e alterações são feitos via getters e setters.
 */
export class Estate {
  #id
  #title
  #description
  #area
  #numberOfRooms
  #type
  #address
  #standAddress
  #images
  #features

  constructor({
    id,
    title,
    description,
    area,
    numberOfRooms,
    type,
    address,
    standAddress,
    images = [],
    features = [],
  }) {
    this.#id = id
    this.#title = title
    this.#description = description
    this.#area = area
    this.#numberOfRooms = numberOfRooms
    this.#type = type
    this.#address = address
    this.#standAddress = standAddress
    this.#images = images
    this.#features = features
  }

  // --------------------------
  // Getters e Setters
  // --------------------------
  get id() { return this.#id }
  set id(value) { this.#id = value }

  get title() { return this.#title }
  set title(value) { this.#title = value }

  get description() { return this.#description }
  set description(value) { this.#description = value }

  get area() { return this.#area }
  set area(value) { this.#area = value }

  get numberOfRooms() { return this.#numberOfRooms }
  set numberOfRooms(value) { this.#numberOfRooms = value }

  get type() { return this.#type }
  set type(value) { this.#type = value }

  get address() { return this.#address }
  set address(value) { this.#address = value }

  get standAddress() { return this.#standAddress }
  set standAddress(value) { this.#standAddress = value }

  get images() { return this.#images }
  set images(value) { this.#images = Array.isArray(value) ? value : [] }

  get features() { return this.#features }
  set features(value) { this.#features = Array.isArray(value) ? value : [] }

  // --------------------------
  // Métodos utilitários
  // --------------------------

  /**
   * Retorna todas as URLs de imagens das entidades ImageEstate.
   */
  getAllImageUrls() {
    return this.#images
      .map(img => img.url)
      .filter(Boolean)
  }

  /**
   * Retorna a primeira imagem que corresponda ao tipo informado.
   */
  getImageByType(typeDescription) {
    if (!typeDescription) return null

    return (
      this.#images.find(img =>
        img.type?.description?.toLowerCase() === typeDescription.toLowerCase()
      ) || null
    )
  }

  /** Retorna a imagem de capa */
  getCoverImage() {
    return this.getImageByType(IMAGE_TYPES.COVER.description)
  }

  /** Retorna a URL da imagem de capa */
  getCoverImageUrl() {
    return this.getCoverImage()?.url || null
  }

  /** Retorna imagens de galeria */
  getGalleryImages() {
    return this.getImageByType(IMAGE_TYPES.GALLERY.description)
  }

  /** Retorna imagens de planta */
  getFloorPlanImages() {
    return this.getImageByType(IMAGE_TYPES.FLOOR_PLAN.description)
  }

  isRealEstateInstance(object){
    return object instanceof Estate
  }

  hasStandAddress(){
    return(
      this.#standAddress?.id === null
      && this.#standAddress?.street !== undefined
      && this.#standAddress?.street !== null
      && this.#standAddress?.street !== ''
      && this.#standAddress?.number !== undefined
      && this.#standAddress?.number !== null
      && this.#standAddress?.neighborhood !== undefined
      && this.#standAddress?.neighborhood !== null
      && this.#standAddress?.neighborhood !== ''
      && this.#standAddress?.city !== undefined
      && this.#standAddress?.city !== null
      && this.#standAddress?.city !== ''
      && this.#standAddress?.uf !== undefined
      && this.#standAddress?.uf !== null
      && this.#standAddress?.uf !== ''
      && this.#standAddress?.region !== undefined
      && this.#standAddress?.region !== null
      && this.#standAddress?.region !== ''
      && this.#standAddress?.zipCode !== undefined
      && this.#standAddress?.zipCode !== null
      && this.#standAddress?.zipCode !== ''
    )

  }
}
