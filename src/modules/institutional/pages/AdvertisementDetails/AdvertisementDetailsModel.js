import zonaSul from '@institutional/assets/regions/zona-sul.jpg'
import zonaNorte from '@institutional/assets/regions/zona-norte.jpg'
import zonaLeste from '@institutional/assets/regions/zona-leste.jpg'
import zonaOeste from '@institutional/assets/regions/zona-oeste.jpg'
import zonaCentro from '@institutional/assets/regions/zona-central.jpg'

const REGIONS_LIST = ['sul', 'leste', 'norte', 'oeste', 'centro']

const REGION_TEXTS = {
  sul: 'A região Sul de São Paulo é reconhecida pela excelente qualidade de vida, com ruas arborizadas, ampla presença de parques e uma atmosfera mais tranquila. É uma ótima escolha para quem busca conforto, segurança e proximidade com a natureza, sem abrir mão de boas opções de comércio e serviços.',
  leste: 'A região Leste de São Paulo se destaca pela praticidade e pelo custo-benefício. Com uma grande variedade de comércios, transporte público acessível e bairros em constante desenvolvimento, é ideal para quem valoriza conveniência no dia a dia e fácil acesso a diferentes pontos da cidade.',
  norte: 'A região Norte oferece um equilíbrio interessante entre urbanização e áreas verdes. Próxima à Serra da Cantareira, proporciona um clima mais ameno e contato com a natureza, além de contar com infraestrutura crescente, sendo uma boa opção para quem busca tranquilidade com mobilidade.',
  oeste: 'A região Oeste é conhecida pelo seu alto padrão e infraestrutura completa. Com bairros valorizados, excelente oferta gastronômica, vida cultural ativa e fácil acesso a importantes vias da cidade, é perfeita para quem busca sofisticação, comodidade e qualidade de vida.',
  centro: 'A região Central é o verdadeiro coração de São Paulo, reunindo diversidade cultural, histórica e urbana. Com acesso facilitado a praticamente toda a cidade, grande oferta de transporte, comércio, serviços e entretenimento, é ideal para quem valoriza praticidade e uma vida dinâmica.'
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