import axiosInstance from '@api/axiosInstance'
import { AmenityMapper } from '../mapper/AmenityMapper'

const API_URL = '/amenities'

/**
 * Busca todas as amenities
 * @returns {Promise<Array<Amenity>>}
 */
export const listAllAmenities = async () => {
  try {
    const response = await axiosInstance.get(API_URL)
    return AmenityMapper.toEntityList(response.data)
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
