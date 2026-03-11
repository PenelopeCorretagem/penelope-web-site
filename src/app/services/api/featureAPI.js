import axiosInstance from './axiosInstance'
import { FeatureMapper } from '@mapper/FeatureMapper'
import { Feature } from '@entity/Feature'

/**
 * Lista todas as amenidades/diferenciais disponíveis.
 * @returns {Promise<Array<Feature>>} Lista de entidades Feature.
 */
export const getAllAmenities = async () => {
  try {
    const response = await axiosInstance.get('/amenities')

    if (response.status === 204) {
      return []
    }

    return FeatureMapper.toEntityList(response.data)
  } catch (error) {
    if (error.response?.status === 204) {
      return []
    }

    console.error('❌ [AMENITIES API] Erro ao listar amenidades:', error)
    throw error
  }
}

/**
 * Busca uma amenidade específica por ID.
 * @param {number} id - O ID da amenidade.
 * @returns {Promise<Feature>} Entidade Feature.
 */
export const getAmenityById = async (id) => {
  try {
    const response = await axiosInstance.get(`/amenities/${id}`)
    return FeatureMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [AMENITIES API] Erro ao buscar amenidade ${id}:`, error)
    throw error
  }
}

/**
 * Cria uma nova amenidade/diferencial.
 * @param {object} amenityData - Dados da amenidade { description, icon }
 * @returns {Promise<Feature>} Entidade Feature criada.
 */
export const createAmenity = async (amenityData) => {
  try {
    const payload = amenityData instanceof Feature ? amenityData.toRequestPayload() : amenityData
    const response = await axiosInstance.post('/amenities', payload)
    return FeatureMapper.toEntity(response.data)
  } catch (error) {
    console.error('❌ [AMENITIES API] Erro ao criar amenidade:', error)
    throw error
  }
}

/**
 * Atualiza uma amenidade existente.
 * @param {number} id - O ID da amenidade.
 * @param {object} amenityData - Dados atualizados { description, icon }
 * @returns {Promise<Feature>} Entidade Feature atualizada.
 */
export const updateAmenity = async (id, amenityData) => {
  try {
    const payload = amenityData instanceof Feature ? amenityData.toRequestPayload() : amenityData
    const response = await axiosInstance.patch(`/amenities/${id}`, payload)
    return FeatureMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [AMENITIES API] Erro ao atualizar amenidade ${id}:`, error)
    throw error
  }
}

/**
 * Remove uma amenidade específica por ID.
 * @param {number} id - O ID da amenidade.
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (id) => {
  try {
    await axiosInstance.delete(`/amenities/${id}`)
  } catch (error) {
    console.error(`❌ [AMENITIES API] Erro ao deletar amenidade ${id}:`, error)
    throw error
  }
}

// Alias para compatibilidade
export const listAllFeatures = getAllAmenities
