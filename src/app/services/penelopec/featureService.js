import * as featureApi from '@api-penelopec/featureAPI'
import { FeatureMapper } from '@mappers/FeatureMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Lista todas as amenidades/diferenciais disponíveis.
 * @returns {Promise<Feature[]>} Lista de entidades Feature
 */
export const getAllAmenities = async () => {
  const response = await featureApi.getAllAmenities()
  return FeatureMapper.toEntityList(response)
}

/**
 * Busca uma amenidade específica por ID.
 * @param {number} id - ID da amenidade
 * @returns {Promise<Feature>} Entidade Feature
 */
export const getAmenityById = async (id) => {
  const response = await featureApi.getAmenityById(id)
  return FeatureMapper.toEntity(response)
}

/**
 * Cria uma nova amenidade/diferencial.
 * @param {object} amenityData - Dados da amenidade { description, icon }
 * @returns {Promise<Feature>} Entidade Feature criada
 */
export const createAmenity = async (amenityData) => {
  const response = await featureApi.createAmenity(amenityData)
  return FeatureMapper.toEntity(response)
}

/**
 * Atualiza uma amenidade existente.
 * @param {number} id - ID da amenidade
 * @param {object} amenityData - Dados atualizados { description, icon }
 * @returns {Promise<Feature>} Entidade Feature atualizada
 */
export const updateAmenity = async (id, amenityData) => {
  const response = await featureApi.updateAmenity(id, amenityData)
  return FeatureMapper.toEntity(response)
}

/**
 * Remove uma amenidade específica por ID.
 * @param {number} id - ID da amenidade
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (id) => {
  return await featureApi.deleteAmenity(id)
}

/**
 * Alias para compatibilidade
 */
export const listAllFeatures = getAllAmenities
