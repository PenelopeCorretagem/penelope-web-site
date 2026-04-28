import axiosInstance from '@api/axiosInstance'
import { AmenityMapper } from '@mappers/amenityMapper'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

const API_URL = '/amenities'

/**
 * Busca todas as amenities com paginação
 * @param {number} page - Número da página (começando em 1 para a API)
 * @param {number} pageSize - Tamanho da página
 * @returns {Promise<Object>} Objeto com content e pageable
 */
export const getAllAmenities = async (page = 1, pageSize = 10, name = '', sort = '', initial = '') => {
  try {
    const response = await axiosInstance.get(API_URL, {
      params: { page, pageSize, name, sort, initial }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar amenities:', error)
    throw error
  }
}

/**
 * Busca uma amenity pelo ID
 * @param {number} id - ID da amenity
 * @returns {Promise<Amenity>}
 */
export const getAmenityById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
  return AmenityMapper.toEntity(response.data)
}

/**
 * Cria uma nova amenity
 * @param {Amenity} amenity - Entidade de amenity
 * @returns {Promise<void>}
 */
export const createAmenity = async (amenity) => {
  const payload = AmenityMapper.toRequest(amenity)
  await axiosInstance.post(API_URL, payload, { baseURL: PENELOPEC_API_BASE_URL })
}

/**
 * Atualiza uma amenity existente
 * @param {number} id - ID da amenity
 * @param {Amenity} amenity - Entidade de amenity com dados atualizados
 * @returns {Promise<Amenity>}
 */
export const updateAmenity = async (id, amenity) => {
  const payload = AmenityMapper.toRequest(amenity)
  const response = await axiosInstance.patch(`${API_URL}/${id}`, payload, { baseURL: PENELOPEC_API_BASE_URL })
  return AmenityMapper.toEntity(response.data)
}

/**
 * Deleta uma amenity
 * @param {number} id - ID da amenity
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
}
