import { useState, useEffect, useCallback } from 'react'
import { getAnuncios, getAnuncioLatest } from '@app/services/apiService'

/**
 * Hook para gerenciar a lista de anúncios na Home
 * - busca em /api/v1/anuncios
 * - mapeia o formato retornado para o shape esperado pelo carousel/card
 */
export function useHomeViewModel() {
  const [properties, setProperties] = useState([])
  const [featuredProperty, setFeaturedProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mapAnuncioToCard = useCallback((anuncio) => {
    const p = anuncio.property || {}

    // imagem: tenta encontrar Capa, senão a primeira imagem, senão ''
    const imageLink = (p.images && p.images.length > 0)
      ? (p.images.find(img => String(img.type).toLowerCase() === 'capa')?.url || p.images[0].url)
      : ''

    const differences = (p.amenities && p.amenities.length > 0)
      ? p.amenities.map(a => a.description)
      : []

    return {
      id: anuncio.id ?? p.id,
      category: p.type ?? '',
      title: p.title ?? `${p.address?.city ?? ''}`,
      subtitle: p.address?.neighborhood ?? p.address?.city ?? '',
      description: p.description ?? '',
      differences,
      imageLink,
      raw: anuncio,
      emphasis: anuncio.emphasis ?? false,
    }
  }, [])

  const fetchAnuncios = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getAnuncios()
      const data = response.data || []

      // Filtra apenas anúncios do tipo LANCAMENTO (case-insensitive)
      const lancamentoAnuncios = data.filter(a => {
        const t = String(a?.property?.type ?? '').toLowerCase()
        return t === 'lancamento'
      })

      const mapped = lancamentoAnuncios.map(mapAnuncioToCard)

      setProperties(mapped)

      // Tenta obter o último anúncio via endpoint dedicado; se falhar, usa fallback
      try {
        const latestResp = await getAnuncioLatest()
        const latestData = latestResp.data
        if (latestData) {
          const latestMapped = mapAnuncioToCard(latestData)
          setFeaturedProperty(latestMapped)
        } else {
          const featured = mapped.find(m => m.emphasis) || mapped[0] || null
          setFeaturedProperty(featured)
        }
      } catch (innerErr) {
        // Se o endpoint /latest falhar, mantém a lógica anterior
        console.warn('Não foi possível obter o anúncio mais recente, usando fallback:', innerErr)
        const featured = mapped.find(m => m.emphasis) || mapped[0] || null
        setFeaturedProperty(featured)
      }
    } catch (err) {
      console.error('Erro ao buscar anúncios:', err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [mapAnuncioToCard])

  useEffect(() => {
    fetchAnuncios()
  }, [fetchAnuncios])

  return {
    properties,
    featuredProperty,
    isLoading,
    error,
    refresh: fetchAnuncios,
  }
}
