import { Amenity } from '@dtos/Amenity'
import * as amenitiesApi from '@api-penelopec/amenitiesApi'

/**
 * AmenitiesModel - Lógica de negócio de amenities
 *
 * RESPONSABILIDADES:
 * - Gerenciar lista de amenities
 * - Executar operações CRUD
 * - Gerenciar paginação
 * - Manter estado consistente
 */
export class AmenitiesModel {
  #amenities = []
  #selectedAmenity = null
  #isLoading = false
  #error = null
  #currentPage = 1
  #pageSize = 10
  #totalElements = 0
  #totalPages = 0
  #searchTerm = ''
  #sortOrder = ''
  #initialFilter = ''

  get searchTerm() { return this.#searchTerm }
  set searchTerm(value) { this.#searchTerm = value ?? '' }

  get sortOrder() { return this.#sortOrder }
  set sortOrder(value) { this.#sortOrder = value ?? '' }

  get initialFilter() { return this.#initialFilter }
  set initialFilter(value) { this.#initialFilter = value ?? '' }

  get amenities() {
    return this.#amenities
  }

  set amenities(value) {
    this.#amenities = Array.isArray(value) ? value : []
  }

  get selectedAmenity() {
    return this.#selectedAmenity
  }

  set selectedAmenity(value) {
    this.#selectedAmenity = value instanceof Amenity ? value : null
  }

  get isLoading() {
    return this.#isLoading
  }

  set isLoading(value) {
    this.#isLoading = !!value
  }

  get error() {
    return this.#error
  }

  set error(value) {
    this.#error = value ?? null
  }

  get currentPage() {
    return this.#currentPage
  }

  set currentPage(value) {
    this.#currentPage = Math.max(1, value ?? 1)
  }

  get pageSize() {
    return this.#pageSize
  }

  set pageSize(value) {
    this.#pageSize = Math.max(1, value ?? 10)
  }

  get totalElements() {
    return this.#totalElements
  }

  set totalElements(value) {
    this.#totalElements = Math.max(0, value ?? 0)
  }

  get totalPages() {
    return this.#totalPages
  }

  set totalPages(value) {
    this.#totalPages = Math.max(0, value ?? 0)
  }

  /**
   * Carrega amenities com paginação
   * @param {number} page - Número da página (começando em 1)
   * @param {number} pageSize - Tamanho da página
   * @returns {Promise<void>}
   */
  async loadAmenities(page = 1, pageSize = 10) {
    this.#isLoading = true
    this.#error = null
    this.#currentPage = page
    this.#pageSize = pageSize

    try {
      const response = await amenitiesApi.getAllAmenities(page, pageSize, this.#searchTerm, this.#sortOrder, this.#initialFilter)
      
      // Assumindo que a API retorna um objeto com content e pageable
      if (response.content) {
        this.#amenities = response.content
        this.#totalElements = response.pageable?.totalElements || 0
        this.#totalPages = response.pageable?.totalPages || 0
      } else {
        // Fallback se a API não seguir o padrão paginado
        this.#amenities = Array.isArray(response) ? response : []
        this.#totalElements = this.#amenities.length
        this.#totalPages = 1
      }
    } catch (error) {
      this.#error = error.response?.data?.message || error.message || 'Erro ao carregar diferenciais'
      throw error
    } finally {
      this.#isLoading = false
    }
  }

  /**
   * Cria uma nova amenity
   * @param {Amenity} amenity
   * @returns {Promise<void>}
   */
  async createAmenity(amenity) {
    this.#isLoading = true
    this.#error = null

    try {
      await amenitiesApi.createAmenity(amenity)
      // Volta para primeira página após criar
      await this.loadAmenities(1, this.#pageSize)
    } catch (error) {
      this.#error = error.response?.data?.message || error.message || 'Erro ao criar diferencial'
      throw error
    } finally {
      this.#isLoading = false
    }
  }

  /**
   * Atualiza uma amenity existente
   * @param {number} id
   * @param {Amenity} amenity
   * @returns {Promise<void>}
   */
  async updateAmenity(id, amenity) {
    this.#isLoading = true
    this.#error = null

    try {
      await amenitiesApi.updateAmenity(id, amenity)
      // Recarrega a página atual
      await this.loadAmenities(this.#currentPage, this.#pageSize)
    } catch (error) {
      this.#error = error.response?.data?.message || error.message || 'Erro ao atualizar diferencial'
      throw error
    } finally {
      this.#isLoading = false
    }
  }

  /**
   * Deleta uma amenity
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteAmenity(id) {
    this.#isLoading = true
    this.#error = null

    try {
      await amenitiesApi.deleteAmenity(id)
      // Se ficou vazio, volta para página anterior se houver
      if (this.#amenities.length === 1 && this.#currentPage > 1) {
        await this.loadAmenities(this.#currentPage - 1, this.#pageSize)
      } else {
        await this.loadAmenities(this.#currentPage, this.#pageSize)
      }
    } catch (error) {
      this.#error = error.response?.data?.message || error.message || 'Erro ao deletar diferencial'
      throw error
    } finally {
      this.#isLoading = false
    }
  }

  /**
   * Seleciona uma amenity para edição
   * @param {Amenity} amenity
   */
  selectAmenity(amenity) {
    this.#selectedAmenity = amenity
  }

  /**
   * Limpa seleção
   */
  clearSelection() {
    this.#selectedAmenity = null
  }

  /**
   * Retorna nova instância de Amenity
   * @returns {Amenity}
   */
  createNewAmenity() {
    return new Amenity()
  }
}
