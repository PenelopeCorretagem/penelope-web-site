import axiosInstance from './axiosInstance'
import { advertisementMapper } from '../mapper/advertisementMapper'

/**
 * Lista todos os anúncios ativos com filtros opcionais.
 * @param {object} filters - Filtros de busca (opcional)
 * @returns {Promise<Advertisement[]>} Lista de entidades Advertisement.
 */
export const listAllActiveAdvertisements = async (filters = {}) => {
  const response = await axiosInstance.get('/anuncios', { params: filters })
  return advertisementMapper.toEntityList(response.data)
}

/**
 * Busca o anúncio mais recente.
 * @returns {Promise<Advertisement>} Entidade Advertisement.
 */
export const getLatestAdvertisement = async () => {
  const response = await axiosInstance.get('/anuncios/latest')
  return advertisementMapper.toEntity(response.data)
}

/**
 * Busca um anúncio específico por ID.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<Advertisement>} Entidade Advertisement.
 */
export const getAdvertisementById = async (id) => {
  const response = await axiosInstance.get(`/anuncios/${id}`)
  return advertisementMapper.toEntity(response.data)
}
