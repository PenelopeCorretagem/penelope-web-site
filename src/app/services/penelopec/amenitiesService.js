import * as amenitiesApi from '@api-penelopec/amenitiesApi'
import { AmenityMapper } from '@mappers/AmenityMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Lista todas as amenidades/diferenciais disponíveis com paginação.
 * @param {number} page - Número da página (começando em 1 para a API)
 * @param {number} pageSize - Tamanho da página
 * @returns {Promise<Object>} { content: Amenity[], pageable: {...} }
 */
export const getAllAmenities = async (page = 1, pageSize = 10) => {
  const response = await amenitiesApi.getAllAmenities(page, pageSize)
  return AmenityMapper.toPaginatedEntityList(response)
}

/**
 * Busca uma amenidade específica por ID.
 * @param {number} id - ID da amenidade
 * @returns {Promise<Amenitie>} Entidade Amenitie
 */
export const getAmenityById = async (id) => {
  const response = await amenitiesApi.getAmenityById(id)
  return AmenityMapper.toEntity(response)
}

/**
 * Cria uma nova amenidade/diferencial.
 * @param {object} amenityData - Dados da amenidade { description, icon }
 * @returns {Promise<Amenitie>} Entidade Amenitie criada
 */
export const createAmenity = async (amenityData) => {
  const response = await amenitiesApi.createAmenity(amenityData)
  return AmenityMapper.toEntity(response)
}

/**
 * Atualiza uma amenidade existente.
 * @param {number} id - ID da amenidade
 * @param {object} amenityData - Dados atualizados { description, icon }
 * @returns {Promise<Amenitie>} Entidade Amenitie atualizada
 */
export const updateAmenity = async (id, amenityData) => {
  const response = await amenitiesApi.updateAmenity(id, amenityData)
  return AmenityMapper.toEntity(response)
}

/**
 * Remove uma amenidade específica por ID.
 * @param {number} id - ID da amenidade
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (id) => {
  return await amenitiesApi.deleteAmenity(id)
}

