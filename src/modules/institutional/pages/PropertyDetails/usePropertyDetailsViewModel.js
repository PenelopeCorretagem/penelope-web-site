import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getAdvertisementById, listAllAdvertisements  } from '@app/services/api/realEstateAdvertisementAPI'
import { RealStateDetailsModel } from './RealStateDetailsModel'

/**
 * ViewModel para a tela de detalhes de propriedade
 * - busca os dados do anúncio pelo id na rota
 * - usa RealStateDetailsModel para mapear os dados
 * - gerencia estado de loading e erro
 */
export function usePropertyDetailsViewModel() {
  const { id } = useParams()

  const [advertisement, setAdvertisement] = useState(null)
  const [relatedAdvertisements, setRelatedAdvertisements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Busca propriedades relacionadas
  const fetchRelatedProperties = useCallback(async (mainAdvertisement) => {
    try {
      console.log('🔄 [PropertyDetails] Fetching related properties...')
      const allAdvertisements = await listAllAdvertisements ()

      const mainEstate = mainAdvertisement.estate
      if (!mainEstate) return []

      const mainAddress = mainEstate.address || {}
      const mainCity = mainAddress.city?.toLowerCase() || null
      const mainRegion = (mainAddress.region || '').toLowerCase()

      const related = allAdvertisements
        .filter(item => {
          if (!item || !item.estate) return false
          // Exclude the main advertisement
          if (String(item.id) === String(mainAdvertisement.id)) return false

          const itemEstate = item.estate
          const itemAddress = itemEstate.address || {}
          const itemCity = (itemAddress.city || '').toLowerCase()
          const itemRegion = (itemAddress.region || '').toLowerCase()

          // Prioritize same city, then same region
          if (mainCity && itemCity === mainCity) return true
          if (mainRegion && itemRegion === mainRegion) return true
          return false
        })
        .slice(0, 6)

      console.log('✅ [PropertyDetails] Related properties loaded:', related.length)
      return related
    } catch (err) {
      console.warn('⚠️ [PropertyDetails] Error loading related properties:', err)
      return []
    }
  }, [])

  // Busca o anúncio principal
  const fetchAdvertisement = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 [PropertyDetails] Fetching advertisement by ID:', id)
      const advertisementData = await getAdvertisementById(id)
      console.log('✅ [PropertyDetails] Advertisement loaded:', advertisementData)

      if (!advertisementData) {
        throw new Error('Advertisement not found')
      }

      setAdvertisement(advertisementData)

      // Busca propriedades relacionadas
      const related = await fetchRelatedProperties(advertisementData)
      setRelatedAdvertisements(related)

    } catch (err) {
      console.error('❌ [PropertyDetails] Error loading advertisement:', err)
      setError(err.message || 'Erro ao carregar detalhes da propriedade')
    } finally {
      setIsLoading(false)
    }
  }, [id, fetchRelatedProperties])

  // Carrega anúncio na montagem
  useEffect(() => {
    fetchAdvertisement()
  }, [fetchAdvertisement])

  // Usa o model para mapear os dados apenas quando necessário
  const propertyDetails = new RealStateDetailsModel(advertisement, relatedAdvertisements)

  return {
    // Dados principais
    realEstateAdvertisement : propertyDetails.realEstateAdvertisement,
    relatedRealEstateAdvertisements : propertyDetails.relatedRealEstateAdvertisements,
    region: propertyDetails.region,

    // Estado
    isLoading,
    error,

    // Ações
    refresh: fetchAdvertisement
  }
}
