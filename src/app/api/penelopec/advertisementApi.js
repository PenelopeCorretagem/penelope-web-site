import axiosInstance from '@api/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Lista todos os anúncios com filtros opcionais.
 * @param {object} filters - Filtros de busca
 * @returns {Promise<object[]>} Dados brutos dos anúncios
 */
export const getAllAdvertisements = async (filters = {}) => {
  const params = {
    city: filters.city,
    region: filters.region,
    type: filters.type,
    numberOfRooms: filters.numberOfRooms,
    active: filters.active,
    area: filters.area,
    title: filters.title,
    createdAt: filters.createdAt,
    displayEndDate: filters.displayEndDate,
    featured: filters.featured,
  }

  const response = await axiosInstance.get('/advertisements', { params, baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Busca um anúncio específico por ID.
 * @param {number} id - O ID do anúncio
 * @returns {Promise<object>} Dados brutos do anúncio
 */
export const getAdvertisementById = async (id) => {
  const response = await axiosInstance.get(`/advertisements/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Cria um novo anúncio.
 * @param {object} advertisementRequest - Dados do anúncio
 * @returns {Promise<object>} Dados brutos do anúncio criado
 */
export const createAdvertisement = async (advertisementRequest) => {
  try {
    const response = await axiosInstance.post('/advertisements', advertisementRequest, {
      baseURL: PENELOPEC_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Dados inválidos fornecidos'
      throw new Error(`Erro de validação: ${message}`)
    } else if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor')
    }
    throw error
  }
}

/**
 * Atualiza um anúncio completamente.
 * @param {number} id - O ID do anúncio
 * @param {object} advertisementData - Dados atualizados
 * @returns {Promise<object>} Dados brutos do anúncio atualizado
 */
export const updateAdvertisement = async (id, advertisementData) => {
  const response = await axiosInstance.put(`/advertisements/${id}`, advertisementData, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Ativa ou desativa um anúncio.
 * @param {number} id - O ID do anúncio
 * @param {boolean} active - Status ativo/inativo
 * @returns {Promise<object>} Dados brutos do anúncio atualizado
 */
export const updateAdvertisementStatus = async (id, active) => {
  const response = await axiosInstance.patch(`/advertisements/${id}/status`, { active }, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Remove um anúncio definitivamente.
 * @param {number} id - O ID do anúncio
 * @returns {Promise<void>}
 */
export const deleteAdvertisement = async (id) => {
  await axiosInstance.delete(`/advertisements/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
}

/**
 * Alias para compatibilidade
 */
export const listAllAdvertisements = getAllAdvertisements
