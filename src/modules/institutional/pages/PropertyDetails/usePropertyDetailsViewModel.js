import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAnuncioById, getAnuncios } from '@app/services/apiService'

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
        const resp = await getAnuncioById(id)
        console.log('[PropertyDetails] response from getAnuncioById', resp)
        const data = resp?.data

        if (!data) {
          throw new Error('No data returned from getAnuncioById')
        }

        // Map to shape used by PropertyDetailsView
        const p = data?.property || {}
        const imageLink = (p.images && p.images.length > 0)
          ? (p.images.find(img => String(img.type).toLowerCase() === 'capa')?.url || p.images[0].url)
          : ''

        // Map amenities to features expected by PropertyFeatures
        const amenitiesFeatures = (p.amenities || []).map(a => ({
          icon: 'BRINDE', // default icon
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
          sul: 'Texto pronto para região Sul: descrição, pontos de interesse e diferenciais locais.',
          leste: 'Texto pronto para região Leste: descrição, pontos de interesse e diferenciais locais.',
          norte: 'Texto pronto para região Norte: descrição, pontos de interesse e diferenciais locais.',
          oeste: 'Texto pronto para região Oeste: descrição, pontos de interesse e diferenciais locais.',
          centro: 'Texto pronto para região Centro: descrição, pontos de interesse e diferenciais locais.',
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

        const fetchRelated = async () => {
          try {
            const allResp = await getAnuncios()
            const allData = allResp?.data || []

            const city = p.address?.city?.toLowerCase() || null
            const region = (p.address?.region || p.address?.uf || '').toLowerCase()

            const related = allData
              .filter(item => {
                if (!item) return false
                // excluir o próprio anúncio
                if (String(item.id) === String(data.id) || String(item.property?.id) === String(data.id)) return false

                const ip = item.property || {}
                const itemCity = (ip.address?.city || '').toLowerCase()
                const itemRegion = (ip.address?.region || ip.address?.uf || '').toLowerCase()

                // Prioriza mesma cidade, senão mesma região
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

            if (mounted) setProperty(prev => ({ ...prev, relatedProperties: related }))
          } catch (err) {
            console.warn('[PropertyDetails] erro ao buscar propriedades relacionadas:', err)
          }
        }

        fetchRelated()
      } catch (err) {
        console.error('[PropertyDetails] Erro ao carregar detalhe do anúncio (getAnuncioById):', err)

        // Fallback: tenta carregar todos os anúncios e encontrar pelo id
        try {
          console.log('[PropertyDetails] tentando fallback getAnuncios()')
          const allResp = await getAnuncios()
          const allData = allResp?.data || []
          const found = allData.find(item => String(item?.id) === String(id) || String(item?.property?.id) === String(id))
          console.log('[PropertyDetails] fallback search result', found)
          if (found) {
            const p = found.property || {}
            const imageLink = (p.images && p.images.length > 0)
              ? (p.images.find(img => String(img.type).toLowerCase() === 'capa')?.url || p.images[0].url)
              : ''

              // map amenities and locations similar to primary mapping
              const amenitiesFeatures = (p.amenities || []).map(a => ({ icon: 'BRINDE', label: a.description || '' }))
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

              const mapped = {
                id: found.id,
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
                raw: found,
              }

            if (mounted) setProperty(mapped)
          } else {
            if (mounted) setError(err)
          }
        } catch (fallbackErr) {
          console.error('[PropertyDetails] Fallback getAnuncios failed:', fallbackErr)
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
