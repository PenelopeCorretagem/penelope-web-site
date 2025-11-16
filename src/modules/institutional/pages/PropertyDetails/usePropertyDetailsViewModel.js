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
        console.log('[PropertyDetails] fetching anuncio by id', id)
        const advertisement = await getAdvertisementById(id)
        console.log('[PropertyDetails] advertisement entity', advertisement)

        if (!advertisement) {
          throw new Error('No data returned from getAdvertisementById')
        }

        const p = advertisement.property || {}
        const imageLink = advertisement.getCoverImageUrl()

        // Map amenities to features expected by PropertyFeatures
        const amenitiesFeatures = (p.amenities || []).map(a => ({
          label: a.description || ''
        }))

        // Locations: stand then empreendimento
        const formatAddress = (addr) => {
          if (!addr) return ''
          const parts = [addr.street, addr.number, addr.neighborhood, addr.city, addr.uf]
          return parts.filter(Boolean).join(', ')
        }

        const addresses = [formatAddress(p.addressStand), formatAddress(p.address)]
        const titles = ['Stand de Vendas', 'Empreendimento']

        // Regions list and selected region text
        const regionsList = ['sul', 'leste', 'norte', 'oeste', 'centro']
        const regionTexts = {
          sul: 'A região Sul é referência em qualidade de vida e áreas verdes, com bairros como Moema, Santo Amaro e Campo Belo. Oferece fácil acesso a shoppings, escolas renomadas e parques, sendo ideal para famílias. O Sul também possui uma diversidade de empreendimentos, desde apartamentos compactos até residenciais de alto padrão. Morar aqui significa conforto, segurança e proximidade com importantes vias e centros comerciais.',
          leste: 'A região Leste de São Paulo é ideal para quem busca conveniência e diversidade. Com bairros como Tatuapé, Penha e São Mateus, a área oferece boa infraestrutura, comércios variados e transporte público eficiente. É perfeita para famílias que valorizam escolas, hospitais e áreas de lazer próximas. A Leste combina tranquilidade residencial com fácil acesso ao centro da cidade, tornando-se uma escolha estratégica para morar ou investir em imóveis.',
          norte: 'A região Norte de São Paulo oferece um equilíbrio entre áreas residenciais e comércio local, com bairros como Santana, Casa Verde e Tucuruvi. É perfeita para quem busca tranquilidade sem abrir mão de serviços essenciais, como escolas, hospitais e mercados. O Norte se destaca pela boa oferta de transporte público, incluindo metrô e terminais de ônibus, facilitando o acesso a outras regiões. É uma escolha prática e estratégica para morar ou investir.',
          oeste: 'A região Oeste é conhecida por seu alto padrão e modernidade, abrigando bairros como Pinheiros, Vila Madalena e Butantã. Aqui, os moradores desfrutam de opções culturais, bares, restaurantes e shoppings de primeira linha. É uma área valorizada para quem busca qualidade de vida e mobilidade, próxima a importantes avenidas e centros empresariais. Imóveis no Oeste atraem aqueles que desejam vivência urbana sofisticada, aliando conforto e conveniência.',
          centro: 'A região Centro é o coração pulsante da cidade, reunindo história, cultura e comércio. Com bairros como Sé, República e Bela Vista, oferece fácil acesso a transporte público, teatros, museus e uma variedade de restaurantes. O Centro é ideal para quem valoriza a vida urbana dinâmica, com opções de lazer e trabalho próximas. Morar aqui significa estar no epicentro das atividades culturais e econômicas da cidade.',
        }

        const { city, neighborhood } = advertisement.getFormattedAddress()
        const candidateRegion = String(p.address?.region || '').toLowerCase()
        const matchedRegion = regionsList.find(r => candidateRegion.includes(r)) || null
        const selectedRegionText = matchedRegion ? regionTexts[matchedRegion] : (p.address?.region || '')

        const mapped = {
          id: advertisement.id,
          title: p.title,
          subtitle: neighborhood || city || '',
          description: p.description,
          imageLink,
          category: p.type,
          overview: p.description,
          regionDescription: selectedRegionText,
          regionList: regionsList,
          amenitiesFeatures,
          locationAddresses: addresses,
          locationTitles: titles,
          raw: advertisement,
        }

        if (mounted) setProperty(mapped)

        const fetchRelated = async () => {
          try {
            const allAdvertisements = await listAllActiveAdvertisements()

            const city = p.address?.city?.toLowerCase() || null
            const region = (p.address?.region || p.address?.uf || '').toLowerCase()

            const related = allAdvertisements
              .filter(item => {
                if (!item) return false
                // excluir o próprio anúncio
                if (String(item.id) === String(advertisement.id)) return false

                const ip = item.property || {}
                const itemCity = (ip.address?.city || '').toLowerCase()
                const itemRegion = (ip.address?.region || ip.address?.uf || '').toLowerCase()

                // Prioriza mesma cidade, senão mesma região
                if (city && itemCity === city) return true
                if (region && itemRegion === region) return true
                return false
              })
              .slice(0, 6)
              .map((ad) => {
                const ap = ad.property || {}
                const adImageLink = ad.getCoverImageUrl()
                const differences = ad.getFeatures()

                return {
                  id: ad.id,
                  category: ap.type ?? '',
                  title: ap.title ?? `${ap.address?.city ?? ''}`,
                  subtitle: ap.address?.neighborhood ?? ap.address?.city ?? '',
                  description: ap.description ?? '',
                  differences,
                  imageLink: adImageLink,
                  raw: ad,
                  emphasis: ad.emphasis ?? false,
                }
              })

            if (mounted) setProperty(prev => ({ ...prev, relatedProperties: related }))
          } catch (err) {
            console.warn('[PropertyDetails] erro ao buscar propriedades relacionadas:', err)
          }
        }

        fetchRelated()
      } catch (err) {
        console.error('[PropertyDetails] Erro ao carregar detalhe do anúncio:', err)

        // Fallback: tenta carregar todos os anúncios e encontrar pelo id
        try {
          console.log('[PropertyDetails] tentando fallback listAllActiveAdvertisements()')
          const allAdvertisements = await listAllActiveAdvertisements()
          const found = allAdvertisements.find(item => String(item?.id) === String(id))
          console.log('[PropertyDetails] fallback search result', found)

          if (found) {
            const p = found.property || {}
            const imageLink = found.getCoverImageUrl()

            const amenitiesFeatures = (p.amenities || []).map(a => ({ label: a.description || '' }))
            const formatAddress = (addr) => {
              if (!addr) return ''
              const parts = [addr.street, addr.number, addr.neighborhood, addr.city, addr.uf]
              return parts.filter(Boolean).join(', ')
            }
            const addresses = [formatAddress(p.addressStand), formatAddress(p.address)]
            const titles = ['Stand de Vendas', 'Empreendimento']
            const regionsList = ['sul', 'leste', 'norte', 'oeste', 'centro']
            const candidateRegion = String(p.address?.region || '').toLowerCase()
            const matchedRegion = regionsList.find(r => candidateRegion.includes(r)) || null
            const regionTexts = {
              sul: 'Texto pronto para região Sul: descrição, pontos de interesse e diferenciais locais.',
              leste: 'Texto pronto para região Leste: descrição, pontos de interesse e diferenciais locais.',
              norte: 'Texto pronto para região Norte: descrição, pontos de interesse e diferenciais locais.',
              oeste: 'Texto pronto para região Oeste: descrição, pontos de interesse e diferenciais locais.',
              centro: 'Texto pronto para região Centro: descrição, pontos de interesse e diferenciais locais.',
            }
            const selectedRegionText = matchedRegion ? regionTexts[matchedRegion] : (p.address?.region || '')
            const { city, neighborhood } = found.getFormattedAddress()

            const mapped = {
              id: found.id,
              title: p.title,
              subtitle: neighborhood || city || '',
              description: p.description,
              imageLink,
              category: p.type,
              overview: p.description,
              regionDescription: selectedRegionText,
              regionList: regionsList,
              amenitiesFeatures,
              locationAddresses: addresses,
              locationTitles: titles,
              raw: found,
            }

            if (mounted) setProperty(mapped)
          } else {
            if (mounted) setError(err)
          }
        } catch (fallbackErr) {
          console.error('[PropertyDetails] Fallback listAllActiveAdvertisements failed:', fallbackErr)
          if (mounted) setError(fallbackErr)
        }
      } finally {
        if (mounted) setIsLoading(false)
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
