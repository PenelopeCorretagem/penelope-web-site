import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getAdvertisementById, listAllAdvertisements } from '@service-penelopec/advertisementService'
import { RealStateDetailsModel } from './AdvertisementDetailsModel'

export function useAdvertisementDetailsViewModel() {
  const { id } = useParams()

  const [advertisement, setAdvertisement] = useState(null)
  const [allAdvertisements, setAllAdvertisements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAdvertisement = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const [advertisementData, allAds] = await Promise.all([
        getAdvertisementById(id),
        listAllAdvertisements()
      ])

      console.log('Advertisement Data:', advertisementData) // Log para depuração

      if (!advertisementData || !advertisementData.active) {
        throw new Error('Este anúncio não está disponível ou foi encerrado.')
      }

      setAdvertisement(advertisementData)
      setAllAdvertisements(allAds)

    } catch (err) {
      if (err.response?.status === 404) {
        setError('Anúncio não encontrado. Verifique o link ou volte para a listagem.')
      } else if (err.response?.status === 500) {
        setError('Erro interno no servidor. Por favor, tente novamente em instantes.')
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Não foi possível carregar os detalhes da propriedade. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAdvertisement()
  }, [fetchAdvertisement])

  // Model recebe a lista completa — ela decide quem é "relacionado"
  const propertyDetails = useMemo(
    () => new RealStateDetailsModel(advertisement, allAdvertisements),
    [advertisement, allAdvertisements]
  )

  return {
    advertisement: propertyDetails.advertisement,
    relatedAdvertisements: propertyDetails.relatedAdvertisements,
    region: propertyDetails.region,
    isLoading,
    error,
    refresh: fetchAdvertisement
  }
}