import { Advertisement } from '@dtos/Advertisement'
/**
 * Modelo de dados para configuração de propriedades
 */
export class AdvertisementsConfigModel {
  #launchAdvertisements = []
  #availableAdvertisements = []
  #underConstructionAdvertisements = []
  #isLoading = false
  #error = null

  constructor(launchAdvertisements = [], availableAdvertisements = [], underConstructionAdvertisements = []) {
    this.launchAdvertisements = launchAdvertisements
    this.availableAdvertisements = availableAdvertisements
    this.underConstructionAdvertisements = underConstructionAdvertisements
  }

  // Getters
  get launchAdvertisements() {
    return this.#launchAdvertisements
  }

  get availableAdvertisements() {
    return this.#availableAdvertisements
  }

  get underConstructionAdvertisements() {
    return this.#underConstructionAdvertisements
  }

  // Alias getters using Portuguese naming so other modules can use lancamentos/disponiveis/emObras
  get lancamentos() {
    return this.#launchAdvertisements
  }

  get disponiveis() {
    return this.#availableAdvertisements
  }

  get emObras() {
    return this.#underConstructionAdvertisements
  }

  get isLoading() {
    return this.#isLoading
  }
  get error() {
    return this.#error
  }

  // Setters
  set launchAdvertisements(advertisements) {
    this.#launchAdvertisements = advertisements
    advertisements.forEach(prop => {
      Advertisement.prototype.isAdvertisement(prop)
    })
  }

  set availableAdvertisements(advertisements) {
    advertisements.forEach(prop => {
      Advertisement.prototype.isAdvertisement(prop)
    })

    this.#availableAdvertisements = advertisements
  }
  set underConstructionAdvertisements(advertisements) {
    advertisements.forEach(prop => {
      Advertisement.prototype.isAdvertisement(prop)
    })
    this.#underConstructionAdvertisements = advertisements
  }
  set isLoading(value) {
    this.#isLoading = value
  }
  set error(value) {
    this.#error = value
  }

  /**
   * Retorna todas as propriedades
   */
  getAllAdvertisements() {
    return {
      lancamentos: this.lancamentos,
      disponiveis: this.disponiveis,
      emObras: this.emObras
    }
  }

  /**
   * Retorna o total de propriedades
   */
  getTotalCount() {
    return this.lancamentos.length + this.disponiveis.length + this.emObras.length
  }
}
