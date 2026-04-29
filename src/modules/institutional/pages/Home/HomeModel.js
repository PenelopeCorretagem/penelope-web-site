import { ESTATE_TYPES } from '@constant/estateTypes'
import { Advertisement } from '@dtos/Advertisement'

export class HomeModel {
  // ===== PRIVATE FIELDS =====
  #preLaunchAdvertisements = []
  #featuredAdvertisement = null
  #isLoading = false
  #error = null

  constructor() {
    this.setPreLaunchAdvertisements([])
  }

  // ===== GETTERS (somente leitura) =====
  get preLaunchAdvertisements() {
    return this.#preLaunchAdvertisements
  }

  get featuredAdvertisement() {
    return this.#featuredAdvertisement
  }

  get isLoading() {
    return this.#isLoading
  }

  get error() {
    return this.#error
  }

  // ===== VALIDADORES =====

  _validateAdvertisementInstance(advertisement) {
    if (!(advertisement instanceof Advertisement)) {
      throw new Error(`O item deve ser uma instância válida de Advertisement`)
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
   * 1. featured = true
   * 2. mais nova (createdAt)
   * 3. fallback: primeira do array
   */
  _filterFeaturedAdvertisement(advertisements) {
    this._validateAdvertisementsArray(advertisements)

    const featured = advertisements.find(ad => ad.featured === true)
    if (featured) return featured

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

  setPreLaunchAdvertisements(preLaunchAdvertisements) {
    this.#preLaunchAdvertisements = preLaunchAdvertisements
    if (!Array.isArray(this.#preLaunchAdvertisements)) {
      throw new Error(`a propriedade "preLaunchAdvertisements" precisa ser um array`)
    }

    if(this.#preLaunchAdvertisements.length > 0){
      this._validateAdvertisementsArray(this.#preLaunchAdvertisements)
      this.#featuredAdvertisement =
        this._filterFeaturedAdvertisement(this.#preLaunchAdvertisements)
    }
  }

  setFeaturedAdvertisement(advertisement) {
    try{
      this._validateAdvertisementInstance(advertisement)
      this.#featuredAdvertisement = advertisement
    }catch(error){
      throw new Error(`setFeaturedAdvertisement: ${error.message}`)
    }
  }

  setLoading(loading) {
    this.#isLoading = Boolean(loading)
  }

  setError(error) {
    this.#error = error
  }
}
