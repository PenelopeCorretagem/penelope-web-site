import axiosInstance from '@api/axiosInstance'

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Lista todas as amenidades/diferenciais disponíveis.
 * @returns {Promise<object[]>} Dados brutos das amenidades
 */
export const getAllAmenities = async () => {
  try {
    const response = await axiosInstance.get('/amenities')

    if (response.status === 204) {
      return []
    }

    return response.data
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
 * @param {number} id - O ID da amenidade
 * @returns {Promise<object>} Dados brutos da amenidade
 */
export const getAmenityById = async (id) => {
  try {
    const response = await axiosInstance.get(`/amenities/${id}`)
    return response.data
  } catch (error) {
    console.error(`❌ [AMENITIES API] Erro ao buscar amenidade ${id}:`, error)
    throw error
  }
}

/**
 * Cria uma nova amenidade/diferencial.
 * @param {object} amenityData - Dados da amenidade { description, icon }
 * @returns {Promise<object>} Dados brutos da amenidade criada
 */
export const createAmenity = async (amenityData) => {
  try {
    const response = await axiosInstance.post('/amenities', amenityData)
    return response.data
  } catch (error) {
    console.error('❌ [AMENITIES API] Erro ao criar amenidade:', error)
    throw error
  }
}

/**
 * Atualiza uma amenidade existente.
 * @param {number} id - O ID da amenidade
 * @param {object} amenityData - Dados atualizados { description, icon }
 * @returns {Promise<object>} Dados brutos da amenidade atualizada
 */
export const updateAmenity = async (id, amenityData) => {
  try {
    const response = await axiosInstance.patch(`/amenities/${id}`, amenityData)
    return response.data
  } catch (error) {
    console.error(`❌ [AMENITIES API] Erro ao atualizar amenidade ${id}:`, error)
    throw error
  }
}

/**
 * Remove uma amenidade específica por ID.
 * @param {number} id - O ID da amenidade
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

/**
 * Alias para compatibilidade
 */
export const listAllFeatures = getAllAmenities
