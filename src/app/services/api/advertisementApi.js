import axiosInstance from './axiosInstance'
import { advertisementMapper } from '../mapper/advertisementMapper'

/**
 * Lista todos os anúncios ativos com filtros opcionais.
 * @param {object} filters - Filtros de busca (cidade, regiao, tipo, quartos, ativo)
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

/**
 * Cria um novo anúncio.
 * @param {object} estateCreateRequest - Dados para criação do anúncio
 * @returns {Promise<any>} Resposta da criação
 */
export const createAdvertisement = async (estateCreateRequest) => {
  const response = await axiosInstance.post('/anuncios', estateCreateRequest)
  return response.data
}

/**
 * Faz upload de imagens para anúncios.
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<string[]>} Lista de URLs das imagens enviadas
 */
export const uploadImages = async (files) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })

  const response = await axiosInstance.post('/anuncios/fotos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Atualiza um anúncio existente.
 * @param {number} id - O ID do anúncio.
 * @param {object} estateUpdateRequest - Dados para atualização do anúncio
 * @returns {Promise<Advertisement>} Entidade Advertisement atualizada.
 */
export const updateAdvertisement = async (id, estateUpdateRequest) => {
  const response = await axiosInstance.put(`/anuncios/${id}`, estateUpdateRequest)
  return advertisementMapper.toEntity(response.data)
}

/**
 * Exclui um anúncio.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<void>}
 */
export const deleteAdvertisement = async (id) => {
  await axiosInstance.delete(`/anuncios/${id}`)
}
