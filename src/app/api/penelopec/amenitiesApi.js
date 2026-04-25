import axiosInstance from '@api/axiosInstance'
import { AmenityMapper } from '@mappers/amenityMapper'

const API_URL = '/amenities'

/**
 * Busca todas as amenities com paginação
 * @param {number} page - Número da página (começando em 1 para a API)
 * @param {number} pageSize - Tamanho da página
 * @returns {Promise<Object>} Objeto com content e pageable
 */
export const getAllAmenities = async (page = 1, pageSize = 10, search = '', sort = '', initial = '') => {
  try {
    const response = await axiosInstance.get(API_URL, {
      params: { page, pageSize, search, sort, initial }
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
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`)
    return AmenityMapper.toEntity(response.data)
  } catch (error) {
    console.error(`Erro ao buscar amenity ${id}:`, error)
    throw error
  }
}

/**
 * Cria uma nova amenity
 * @param {Amenity} amenity - Entidade de amenity
 * @returns {Promise<void>}
 */
export const createAmenity = async (amenity) => {
  try {
    const payload = AmenityMapper.toRequest(amenity)
    await axiosInstance.post(API_URL, payload)
  } catch (error) {
    console.error('Erro ao criar amenity:', error)
    throw error
  }
}

/**
 * Atualiza uma amenity existente
 * @param {number} id - ID da amenity
 * @param {Amenity} amenity - Entidade de amenity com dados atualizados
 * @returns {Promise<Amenity>}
 */
export const updateAmenity = async (id, amenity) => {
  try {
    const payload = AmenityMapper.toRequest(amenity)
    const response = await axiosInstance.patch(`${API_URL}/${id}`, payload)
    return AmenityMapper.toEntity(response.data)
  } catch (error) {
    console.error(`Erro ao atualizar amenity ${id}:`, error)
    throw error
  }
}

/**
 * Deleta uma amenity
 * @param {number} id - ID da amenity
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`)
  } catch (error) {
    console.error(`Erro ao deletar amenity ${id}:`, error)
    throw error
  }
}
