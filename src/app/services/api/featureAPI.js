import axiosInstance from './axiosInstance'
import { FeatureMapper } from '@mapper/FeatureMapper'

/**
 * Lista todas as amenities (features) disponíveis.
 * @returns {Promise<Array<Feature>>} Lista de entidades Feature.
 */
export const listAllFeatures = async () => {
  try {
    const response = await axiosInstance.get('/amenities')
    console.log(response)

    if (response.status === 204) {
      return []
    }

    return FeatureMapper.toEntityList(response.data)
  } catch (error) {
    if (error.response?.status === 204) {
      return []
    }

    console.error('❌ [FEATURE API] Failed to list features:', error)
    throw error
  }
}
