import { ESTATE_TYPES } from '@constant/estateTypes'
import { RealEstateAdvertisement } from '@entity/RealEstateAdvertisement'

export class HomeModel {
  // ===== PRIVATE FIELDS =====
  #preLaunchRealEstateAdvertisements = []
  #featuredRealEstateAdvertisement = null
  #isLoading = false
  #error = null

  constructor() {
    this.setPreLaunchRealEstateAdvertisements([])
  }

  // ===== GETTERS (somente leitura) =====
  get preLaunchRealEstateAdvertisements() {
    return this.#preLaunchRealEstateAdvertisements
  }

  get featuredRealEstateAdvertisement() {
    return this.#featuredRealEstateAdvertisement
  }

  get isLoading() {
    return this.#isLoading
  }

  get error() {
    return this.#error
  }

  // ===== VALIDADORES =====

  _validateAdvertisementInstance(advertisement) {
    if (!(advertisement instanceof RealEstateAdvertisement)) {
      throw new Error(`O item deve ser uma instância válida de RealEstateAdvertisement`)
    }
  }

  _validateAdvertisementsArray(advertisements) {
    advertisements.forEach(advertisement => {
      this._validateAdvertisementInstance(advertisement)
      if (advertisement.estate.type !== ESTATE_TYPES.LANCAMENTO) {
        throw new Error(
          `O ${advertisement.estate.type} deve ser do tipo ${ESTATE_TYPES.LANCAMENTO}`
        )
      }
    })
  }

  // ===== LÓGICA DE NEGÓCIO =====

  /**
   * Seleciona a propriedade em destaque:
   * 1. emphasis = true
   * 2. mais nova (createdAt)
   * 3. fallback: primeira do array
   */
  _filterFeaturedRealEstateAdvertisement(advertisements) {
    this._validateAdvertisementsArray(advertisements)

    const emphasis = advertisements.find(ad => ad.emphasis === true)
    if (emphasis) return emphasis

    const sorted = [...advertisements].sort((a, b) => {
      const da = new Date(a.createdAt || 0)
      const db = new Date(b.createdAt || 0)

      if (da.getTime() !== db.getTime()) {
        return db.getTime() - da.getTime()
      }

      return (b.id || 0) - (a.id || 0)
    })

    return sorted[0]
  }

  // ===== SETTERS (métodos explícitos) =====

  setPreLaunchRealEstateAdvertisements(preLaunchRealEstateAdvertisements) {
    this.#preLaunchRealEstateAdvertisements = preLaunchRealEstateAdvertisements
    if (!Array.isArray(this.#preLaunchRealEstateAdvertisements)) {
      throw new Error(`a propriedade "preLaunchRealEstateAdvertisements" precisa ser um array`)
    }

    if(this.#preLaunchRealEstateAdvertisements.length > 0){
      this._validateAdvertisementsArray(this.#preLaunchRealEstateAdvertisements)
      this.#featuredRealEstateAdvertisement =
        this._filterFeaturedRealEstateAdvertisement(this.#preLaunchRealEstateAdvertisements)
    }
  }

  setFeaturedRealEstateAdvertisement(advertisement) {
    try{
      this._validateAdvertisementInstance(advertisement)
      this.#featuredRealEstateAdvertisement = advertisement
    }catch(error){
      throw new Error(`setFeaturedRealEstateAdvertisement: ${error.message}`)
    }
  }

  setLoading(loading) {
    this.#isLoading = Boolean(loading)
  }

  setError(error) {
    this.#error = error
  }
}
