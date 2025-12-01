import zonaSul from '@institutional/assets/regions/zona-sul.jpg'
import zonaNorte from '@institutional/assets/regions/zona-norte.jpg'
import zonaLeste from '@institutional/assets/regions/zona-leste.jpg'
import zonaOeste from '@institutional/assets/regions/zona-oeste.jpg'
import  zonaCentro from '@institutional/assets/regions/zona-central.jpg'

const REGIONS_LIST = ['sul', 'leste', 'norte', 'oeste', 'centro']

const REGION_TEXTS = {
  sul: 'A região Sul é referência em qualidade de vida e áreas verdes, com bairros como Moema, Santo Amaro e Campo Belo. Oferece fácil acesso a shoppings, escolas renomadas e parques, sendo ideal para famílias. O Sul também possui uma diversidade de empreendimentos, desde apartamentos compactos até residenciais de alto padrão. Morar aqui significa conforto, segurança e proximidade com importantes vias e centros comerciais.',
  leste: 'A região Leste de São Paulo é ideal para quem busca conveniência e diversidade. Com bairros como Tatuapé, Penha e São Mateus, a área oferece boa infraestrutura, comércios variados e transporte público eficiente. É perfeita para famílias que valorizam escolas, hospitais e áreas de lazer próximas. A Leste combina tranquilidade residencial com fácil acesso ao centro da cidade, tornando-se uma escolha estratégica para morar ou investir em imóveis.',
  norte: 'A região Norte de São Paulo oferece um equilíbrio entre áreas residenciais e comércio local, com bairros como Santana, Casa Verde e Tucuruvi. É perfeita para quem busca tranquilidade sem abrir mão de serviços essenciais, como escolas, hospitais e mercados. O Norte se destaca pela boa oferta de transporte público, incluindo metrô e terminais de ônibus, facilitando o acesso a outras regiões. É uma escolha prática e estratégica para morar ou investir.',
  oeste: 'A região Oeste é conhecida por seu alto padrão e modernidade, abrigando bairros como Pinheiros, Vila Madalena e Butantã. Aqui, os moradores desfrutam de opções culturais, bares, restaurantes e shoppings de primeira linha. É uma área valorizada para quem busca qualidade de vida e mobilidade, próxima a importantes avenidas e centros empresariais. Imóveis no Oeste atraem aqueles que desejam vivência urbana sofisticada, aliando conforto e conveniência.',
  centro: 'A região Centro é o coração pulsante da cidade, reunindo história, cultura e comércio. Com bairros como Sé, República e Bela Vista, oferece fácil acesso a transporte público, teatros, museus e uma variedade de restaurantes. O Centro é ideal para quem valoriza a vida urbana dinâmica, com opções de lazer e trabalho próximas. Morar aqui significa estar no epicentro das atividades culturais e econômicas da cidade.'
}

const REGION_PHOTOS = {
  sul: zonaSul,
  leste: zonaLeste,
  norte: zonaNorte,
  oeste: zonaOeste,
  centro: zonaCentro
}

export class RealStateDetailsModel {
  #realEstateAdvertisement
  #relatedRealEstateAdvertisements
  #region
  #isLoading = false
  #error = null

  constructor(realStateAdvertisement, relatedRealEstateAdvertisements) {
    this.#realEstateAdvertisement = realStateAdvertisement
    this.relatedRealEstateAdvertisements = relatedRealEstateAdvertisements
    this.#region = this.#fetchRegion()
  }

  get relatedRealEstateAdvertisements() {
    return this.#relatedRealEstateAdvertisements
  }

  get realEstateAdvertisement() {
    return this.#realEstateAdvertisement
  }

  get region() {
    return this.#region
  }

  get isLoading() {
    return this.#isLoading
  }

  get error() {
    return this.#error
  }

  set relatedRealEstateAdvertisements(value) {
    this.#relatedRealEstateAdvertisements = value
  }

  set realEstateAdvertisement(value) {
    this.#realEstateAdvertisement = value
  }

  set region(value) {
    this.#region = value
  }

  set isLoading(value) {
    this.#isLoading = value
  }

  set error(value) {
    this.#error = value
  }

  #fetchRegion() {
    const city = this.#realEstateAdvertisement?.estate?.address?.region?.toLowerCase() || ''
    for (const region of REGIONS_LIST) {
      if (city.includes(region)) {
        return {
          key: region,
          description: REGION_TEXTS[region] || '',
          imageUrl: REGION_PHOTOS[region] || ''
        }
      }
    }
    return {
      key: '',
      description: '',
      imageUrl: ''
    }
  }

}
