import { RealEstateAdvertisement } from '@entity/RealEstateAdvertisement'
/**
 * Modelo de dados para configuração de propriedades
 */
export class PropertiesConfigModel {
  #launchProperties = []
  #availableProperties = []
  #underConstructionProperties = []
  #isLoading = false
  #error = null

  constructor(launchProperties = [], availableProperties = [], underConstructionProperties = []) {
    this.launchProperties = launchProperties
    this.availableProperties = availableProperties
    this.underConstructionProperties = underConstructionProperties
  }

  // Getters
  get launchProperties() {
    return this.#launchProperties
  }

  get availableProperties() {
    return this.#availableProperties
  }

  get underConstructionProperties() {
    return this.#underConstructionProperties
  }

  // Alias getters using Portuguese naming so other modules can use lancamentos/disponiveis/emObras
  get lancamentos() {
    return this.#launchProperties
  }

  get disponiveis() {
    return this.#availableProperties
  }

  get emObras() {
    return this.#underConstructionProperties
  }

  get isLoading() {
    return this.#isLoading
  }
  get error() {
    return this.#error
  }

  // Setters
  set launchProperties(properties) {
    this.#launchProperties = properties
    properties.forEach(prop => {
      RealEstateAdvertisement.prototype.isRealEstateAdvertisement(prop)
    })
  }

  set availableProperties(properties) {
    properties.forEach(prop => {
      RealEstateAdvertisement.prototype.isRealEstateAdvertisement(prop)
    })

    this.#availableProperties = properties
  }
  set underConstructionProperties(properties) {
    properties.forEach(prop => {
      RealEstateAdvertisement.prototype.isRealEstateAdvertisement(prop)
    })
    this.#underConstructionProperties = properties
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
  getAllProperties() {
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
