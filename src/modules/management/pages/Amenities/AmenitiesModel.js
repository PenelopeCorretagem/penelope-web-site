import { Amenity } from '../../../../app/model/entities/Amenity'
import * as amenitiesAPI from '@services/api/amenitiesAPI'

/**
 * AmenitiesModel - Lógica de negócio de amenities
 *
 * RESPONSABILIDADES:
 * - Gerenciar lista de amenities
 * - Executar operações CRUD
 * - Manter estado consistente
 */
export class AmenitiesModel {
  #amenities = []
  #selectedAmenity = null
  #isLoading = false
  #error = null

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

  /**
   * Carrega todas as amenities
   * @returns {Promise<void>}
   */
  async loadAmenities() {
    this.#isLoading = true
    this.#error = null

    try {
      this.#amenities = await amenitiesAPI.listAllAmenities()
    } catch (error) {
      this.#error = error.response?.data?.message || 'Erro ao carregar amenities'
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
      await amenitiesAPI.createAmenity(amenity)
      await this.loadAmenities()
    } catch (error) {
      this.#error = error.response?.data?.message || 'Erro ao criar amenity'
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
      await amenitiesAPI.updateAmenity(id, amenity)
      await this.loadAmenities()
    } catch (error) {
      this.#error = error.response?.data?.message || 'Erro ao atualizar amenity'
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
      await amenitiesAPI.deleteAmenity(id)
      await this.loadAmenities()
    } catch (error) {
      this.#error = error.response?.data?.message || 'Erro ao deletar amenity'
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
