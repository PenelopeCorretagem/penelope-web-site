import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAdvertisementById, listAllActiveAdvertisements } from '@app/services/api/advertisementApi'

/**
 * ViewModel para a tela de detalhes de propriedade
 * - gerencia comportamento de scroll (sticky card)
 * - busca os dados do anúncio pelo id na rota
 */
export function usePropertyDetailsViewModel() {
  const { id } = useParams()
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const [cardStyle, setCardStyle] = useState({ position: 'relative', width: '100%', zIndex: 50 })

  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch anuncio by id
  useEffect(() => {
    if (!id) return

    let mounted = true
    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('🔄 [PropertyDetails] Fetching advertisement by ID:', id)
        const advertisement = await getAdvertisementById(id)
        console.log('✅ [PropertyDetails] Advertisement loaded:', advertisement)

        if (!advertisement) {
          throw new Error('Advertisement not found')
        }

        const property = advertisement.property || {}
        const address = property.address || {}
        const standAddress = property.standAddress || property.addressStand || {}

        // Get cover image URL
        const imageLink = advertisement.getCoverImageUrl() || ''
        console.log('🖼️ [PropertyDetails] Cover image URL:', imageLink)

        // Map amenities to features format
        const amenitiesFeatures = (property.amenities || []).map(amenity => ({
          label: amenity.description || amenity.name || 'Amenidade'
        }))

        // Format addresses for location section
        const formatAddress = (addr) => {
          if (!addr) return ''
          const parts = [
            addr.street,
            addr.number,
            addr.neighborhood,
            addr.city,
            addr.uf || addr.state
          ].filter(Boolean)
          return parts.join(', ')
        }

        const propertyAddress = formatAddress(address)
        const standAddressFormatted = formatAddress(standAddress)

        const addresses = [propertyAddress, standAddressFormatted].filter(Boolean)
        const titles = ['Empreendimento', 'Stand de Vendas'].slice(0, addresses.length)

        // Region description logic
        const regionsList = ['sul', 'leste', 'norte', 'oeste', 'centro']
        const regionTexts = {
          sul: 'A região Sul é referência em qualidade de vida e áreas verdes, com bairros como Moema, Santo Amaro e Campo Belo. Oferece fácil acesso a shoppings, escolas renomadas e parques, sendo ideal para famílias. O Sul também possui uma diversidade de empreendimentos, desde apartamentos compactos até residenciais de alto padrão. Morar aqui significa conforto, segurança e proximidade com importantes vias e centros comerciais.',
          leste: 'A região Leste de São Paulo é ideal para quem busca conveniência e diversidade. Com bairros como Tatuapé, Penha e São Mateus, a área oferece boa infraestrutura, comércios variados e transporte público eficiente. É perfeita para famílias que valorizam escolas, hospitais e áreas de lazer próximas. A Leste combina tranquilidade residencial com fácil acesso ao centro da cidade, tornando-se uma escolha estratégica para morar ou investir em imóveis.',
          norte: 'A região Norte de São Paulo oferece um equilíbrio entre áreas residenciais e comércio local, com bairros como Santana, Casa Verde e Tucuruvi. É perfeita para quem busca tranquilidade sem abrir mão de serviços essenciais, como escolas, hospitais e mercados. O Norte se destaca pela boa oferta de transporte público, incluindo metrô e terminais de ônibus, facilitando o acesso a outras regiões. É uma escolha prática e estratégica para morar ou investir.',
          oeste: 'A região Oeste é conhecida por seu alto padrão e modernidade, abrigando bairros como Pinheiros, Vila Madalena e Butantã. Aqui, os moradores desfrutam de opções culturais, bares, restaurantes e shoppings de primeira linha. É uma área valorizada para quem busca qualidade de vida e mobilidade, próxima a importantes avenidas e centros empresariais. Imóveis no Oeste atraem aqueles que desejam vivência urbana sofisticada, aliando conforto e conveniência.',
          centro: 'A região Centro é o coração pulsante da cidade, reunindo história, cultura e comércio. Com bairros como Sé, República e Bela Vista, oferece fácil acesso a transporte público, teatros, museus e uma variedade de restaurantes. O Centro é ideal para quem valoriza a vida urbana dinâmica, com opções de lazer e trabalho próximas. Morar aqui significa estar no epicentro das atividades culturais e econômicas da cidade.'
        }

        const candidateRegion = String(address.region || '').toLowerCase()
        const matchedRegion = regionsList.find(r => candidateRegion.includes(r)) || null
        const selectedRegionText = matchedRegion
          ? regionTexts[matchedRegion]
          : (address.region || 'Região não especificada')

        // Get formatted address from advertisement
        const { city, neighborhood } = advertisement.getFormattedAddress()

        const mappedProperty = {
          id: advertisement.id,
          title: property.title || 'Título não disponível',
          subtitle: neighborhood || city || 'Localização não informada',
          description: property.description || 'Descrição não disponível',
          imageLink,
          category: property.type || 'disponivel',
          overview: property.description || 'Descrição completa não disponível',
          regionDescription: selectedRegionText,
          regionList: regionsList,
          amenitiesFeatures,
          locationAddresses: addresses,
          locationTitles: titles,
          raw: advertisement,
        }

        if (mounted) {
          setProperty(mappedProperty)
          console.log('✅ [PropertyDetails] Property state updated:', mappedProperty.title)
        }

        // Fetch related properties asynchronously
        fetchRelatedProperties(advertisement, mounted)

      } catch (err) {
        console.error('❌ [PropertyDetails] Error loading advertisement:', err)
        if (mounted) {
          setError(err.message || 'Erro ao carregar detalhes da propriedade')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    const fetchRelatedProperties = async (mainAdvertisement, mounted) => {
      try {
        console.log('🔄 [PropertyDetails] Fetching related properties...')
        const allAdvertisements = await listAllActiveAdvertisements()

        const mainProperty = mainAdvertisement.property || {}
        const mainAddress = mainProperty.address || {}
        const mainCity = mainAddress.city?.toLowerCase() || null
        const mainRegion = (mainAddress.region || mainAddress.uf || '').toLowerCase()

        const related = allAdvertisements
          .filter(item => {
            if (!item || !item.property) return false
            // Exclude the main advertisement
            if (String(item.id) === String(mainAdvertisement.id)) return false

            const itemProperty = item.property
            const itemAddress = itemProperty.address || {}
            const itemCity = (itemAddress.city || '').toLowerCase()
            const itemRegion = (itemAddress.region || itemAddress.uf || '').toLowerCase()

            // Prioritize same city, then same region
            if (mainCity && itemCity === mainCity) return true
            if (mainRegion && itemRegion === mainRegion) return true
            return false
          })
          .slice(0, 6)
          .map((ad) => {
            const adProperty = ad.property || {}
            const adAddress = adProperty.address || {}
            const adImageLink = ad.getCoverImageUrl() || ''
            const differences = ad.getFeatures() || []

            return {
              id: ad.id,
              category: adProperty.type?.toLowerCase() || 'disponivel',
              title: adAddress.city || adProperty.title || 'Propriedade',
              subtitle: adAddress.neighborhood || 'Bairro não informado',
              description: adProperty.description || 'Descrição não disponível',
              differences,
              imageLink: adImageLink,
              raw: ad,
              emphasis: ad.emphasis || false,
            }
          })

        console.log('✅ [PropertyDetails] Related properties loaded:', related.length)

        if (mounted) {
          setProperty(prev => ({
            ...prev,
            relatedProperties: related
          }))
        }
      } catch (err) {
        console.warn('⚠️ [PropertyDetails] Error loading related properties:', err)
        // Don't set error state for related properties failure
      }
    }

    fetchDetail()

    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      const wrapper = wrapperRef.current
      const card = cardRef.current
      if (!section || !wrapper || !card) return

      const sectionRect = section.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      if (sectionRect.top <= 100) {
        setCardStyle({
          position: 'fixed',
          top: 100,
          left: wrapperRect.left,
          width: wrapperRect.width,
          zIndex: 1000,
        })
      } else {
        setCardStyle({
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return {
    sectionRef,
    wrapperRef,
    cardRef,
    cardStyle,
    property,
    isLoading,
    error,
  }
}
