import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAnuncioById, getAnuncios } from '@app/services/apiService'

export function usePropertyDetailsViewModel() {
  const { id } = useParams()
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const [cardStyle, setCardStyle] = useState({ position: 'relative', width: '100%', zIndex: 50 })

  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ Previne múltiplas chamadas
  const isFetchingRef = useRef(false)

  useEffect(() => {
    if (!id || isFetchingRef.current) return

    isFetchingRef.current = true
    let mounted = true

    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const resp = await getAnuncioById(id)
        const data = resp?.data

        if (!data) {
          throw new Error('No data returned from getAnuncioById')
        }

        const p = data?.property || {}
        const imageLink = (p.images && p.images.length > 0)
          ? (p.images.find(img => String(img.type).toLowerCase() === 'capa')?.url || p.images[0].url)
          : ''

        const amenitiesFeatures = (p.amenities || []).map(a => ({
          label: a.description || ''
        }))

        const formatAddress = (addr) => {
          if (!addr) return ''
          const parts = [addr.street, addr.number, addr.neighborhood, addr.city, addr.uf]
          return parts.filter(Boolean).join(', ')
        }

        const addresses = [formatAddress(p.addressStand), formatAddress(p.address)]
        const titles = ['Stand de Vendas', 'Empreendimento']

        const regionsList = ['sul', 'leste', 'norte', 'oeste', 'centro']
        const regionTexts = {
          sul: 'A região Sul é referência em qualidade de vida e áreas verdes, com bairros como Moema, Santo Amaro e Campo Belo.',
          leste: 'A região Leste de São Paulo é ideal para quem busca conveniência e diversidade.',
          norte: 'A região Norte de São Paulo oferece um equilíbrio entre áreas residenciais e comércio local.',
          oeste: 'A região Oeste é conhecida por seu alto padrão e modernidade.',
          centro: 'A região Centro é o coração pulsante da cidade, reunindo história, cultura e comércio.',
        }

        const candidateRegion = String(p.address?.region || '').toLowerCase()
        const matchedRegion = regionsList.find(r => candidateRegion.includes(r)) || null
        const selectedRegionText = matchedRegion ? regionTexts[matchedRegion] : (p.address?.region || '')

        const mapped = {
          id: data.id,
          title: p.title,
          subtitle: p.address?.neighborhood || p.address?.city || '',
          description: p.description,
          imageLink,
          category: p.type,
          overview: p.description,
          regionDescription: selectedRegionText,
          regionList: regionsList,
          amenitiesFeatures,
          locationAddresses: addresses,
          locationTitles: titles,
          raw: data,
        }

        if (mounted) setProperty(mapped)

        // ✅ Busca relacionados em paralelo (não bloqueia)
        fetchRelated(data, p, mounted)

      } catch (err) {
        console.error('Erro ao carregar propriedade:', err)
        if (mounted) setError(err)
      } finally {
        if (mounted) {
          setIsLoading(false)
          isFetchingRef.current = false
        }
      }
    }

    const fetchRelated = async (data, p, mounted) => {
      try {
        const allResp = await getAnuncios()
        const allData = allResp?.data || []

        const city = p.address?.city?.toLowerCase() || null
        const region = (p.address?.region || p.address?.uf || '').toLowerCase()

        const related = allData
          .filter(item => {
            if (!item) return false
            if (String(item.id) === String(data.id) || String(item.property?.id) === String(data.id)) return false

            const ip = item.property || {}
            const itemCity = (ip.address?.city || '').toLowerCase()
            const itemRegion = (ip.address?.region || ip.address?.uf || '').toLowerCase()

            if (city && itemCity === city) return true
            if (region && itemRegion === region) return true
            return false
          })
          .slice(0, 6)
          .map((anuncio) => {
            const ap = anuncio.property || {}
            const imageLink = (ap.images && ap.images.length > 0)
              ? (ap.images.find(img => String(img.type).toLowerCase() === 'capa')?.url || ap.images[0].url)
              : ''

            const differences = (ap.amenities && ap.amenities.length > 0)
              ? ap.amenities.map(a => a.description)
              : []

            return {
              id: anuncio.id ?? ap.id,
              category: ap.type ?? '',
              title: ap.title ?? `${ap.address?.city ?? ''}`,
              subtitle: ap.address?.neighborhood ?? ap.address?.city ?? '',
              description: ap.description ?? '',
              differences,
              imageLink,
              raw: anuncio,
              emphasis: anuncio.emphasis ?? false,
            }
          })

        if (mounted) {
          setProperty(prev => ({ ...prev, relatedProperties: related }))
        }
      } catch (err) {
        console.warn('Erro ao buscar propriedades relacionadas:', err)
      }
    }

    fetchDetail()

    return () => {
      mounted = false
      isFetchingRef.current = false
    }
  }, [id]) // ✅ Apenas 'id' como dependência

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
