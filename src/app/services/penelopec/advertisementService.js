import * as advertisementApi from '@api-penelopec/advertisementApi'
import { AdvertisementMapper } from '@app/mappers/advertisementMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Lista todos os anúncios com filtros opcionais.
 * @param {object} filters - Filtros de busca
 * @returns {Promise<RealEstateAdvertisement[]>} Lista de entidades Advertisement
 */
export const getAllAdvertisements = async (filters = {}) => {
  const response = await advertisementApi.getAllAdvertisements(filters)
  return AdvertisementMapper.toEntityList(response)
}

/**
 * Busca um anúncio específico por ID.
 * @param {number} id - ID do anúncio
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement
 */
export const getAdvertisementById = async (id) => {
  const response = await advertisementApi.getAdvertisementById(id)
  return AdvertisementMapper.toEntity(response)
}

/**
 * Cria um novo anúncio.
 * @param {object} advertisementRequest - Dados do anúncio
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement criada
 */
export const createAdvertisement = async (advertisementRequest) => {
  const response = await advertisementApi.createAdvertisement(advertisementRequest)
  return AdvertisementMapper.toEntity(response)
}

/**
 * Atualiza um anúncio completamente.
 * @param {number} id - ID do anúncio
 * @param {object} advertisementData - Dados atualizados
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement atualizada
 */
export const updateAdvertisement = async (id, advertisementData) => {
  const response = await advertisementApi.updateAdvertisement(id, advertisementData)
  return AdvertisementMapper.toEntity(response)
}

/**
 * Ativa ou desativa um anúncio.
 * @param {number} id - ID do anúncio
 * @param {boolean} active - Status ativo/inativo
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement atualizada
 */
export const updateAdvertisementStatus = async (id, active) => {
  await advertisementApi.updateAdvertisementStatus(id, active)
  return { id, active }
}

/**
 * Remove um anúncio definitivamente.
 * @param {number} id - O ID do anúncio
 * @returns {Promise<void>}
 */
export const deleteAdvertisement = async (id) => {
  await advertisementApi.deleteAdvertisement(id)
}

/**
 * Alias para compatibilidade
 */
export const listAllAdvertisements = getAllAdvertisements
