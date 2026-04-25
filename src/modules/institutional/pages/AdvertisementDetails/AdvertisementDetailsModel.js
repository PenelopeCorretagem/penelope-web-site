import zonaSul from '@institutional/assets/regions/zona-sul.jpg'
import zonaNorte from '@institutional/assets/regions/zona-norte.jpg'
import zonaLeste from '@institutional/assets/regions/zona-leste.jpg'
import zonaOeste from '@institutional/assets/regions/zona-oeste.jpg'
import zonaCentro from '@institutional/assets/regions/zona-central.jpg'

const REGIONS_LIST = ['sul', 'leste', 'norte', 'oeste', 'centro']

const REGION_TEXTS = {
  sul: 'A região Sul é referência em qualidade de vida e áreas verdes...',
  leste: 'A região Leste de São Paulo é ideal para quem busca conveniência...',
  norte: 'A região Norte de São Paulo oferece um equilíbrio...',
  oeste: 'A região Oeste é conhecida por seu alto padrão...',
  centro: 'A região Centro é o coração pulsante da cidade...'
}

const REGION_PHOTOS = {
  sul: zonaSul,
  leste: zonaLeste,
  norte: zonaNorte,
  oeste: zonaOeste,
  centro: zonaCentro
}

// Critérios de negócio para imóveis relacionados
const MAX_RELATED = 6
const MAX_ROOMS_DIFF = 1

export class RealStateDetailsModel {
  #advertisement
  #relatedAdvertisements
  #region

  constructor(advertisement, allAdvertisements = []) {
    this.#advertisement = advertisement
    this.#region = this.#deriveRegion()
    this.#relatedAdvertisements = this.#filterRelatedAdvertisements(allAdvertisements)
  }

  get advertisement() {
    return this.#advertisement
  }

  get relatedAdvertisements() {
    return this.#relatedAdvertisements
  }

  get region() {
    return this.#region
  }

  /**
   * Determina a região com base no endereço do imóvel principal.
   */
  #deriveRegion() {
    const city = this.#advertisement?.estate?.address?.region?.toLowerCase() ?? ''

    for (const region of REGIONS_LIST) {
      if (city.includes(region)) {
        return {
          key: region,
          description: REGION_TEXTS[region] ?? '',
          imageUrl: REGION_PHOTOS[region] ?? ''
        }
      }
    }

    return { key: '', description: '', imageUrl: '' }
  }

  /**
   * Regra de negócio: um imóvel é relacionado se:
   * - Não é o próprio anúncio principal
   * - Está na mesma região
   * - Tem número de quartos semelhante (diferença máxima de MAX_ROOMS_DIFF), quando ambos informados
   */
  #filterRelatedAdvertisements(allAdvertisements) {
    if (!this.#advertisement?.estate) return []

    const mainRegion = (
      this.#advertisement.estate.address?.region ?? ''
    ).toLowerCase()

    const mainRooms = this.#advertisement.estate.numberOfRooms ?? null

    return allAdvertisements
      .filter(item => {
        if (!item?.estate) return false
        if (String(item.id) === String(this.#advertisement.id)) return false

        const itemRegion = (item.estate.address?.region ?? '').toLowerCase()
        if (!mainRegion || itemRegion !== mainRegion) return false

        if (mainRooms && item.estate.numberOfRooms) {
          if (Math.abs(item.estate.numberOfRooms - mainRooms) > MAX_ROOMS_DIFF) return false
        }

        return true
      })
      .slice(0, MAX_RELATED)
  }
}