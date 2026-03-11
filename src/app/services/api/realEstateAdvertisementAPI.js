import axiosInstance from './axiosInstance'
import { RealEstateAdvertisementMapper } from '@mapper/RealEstateAdvertisementMapper'

/**
 * Lista todos os anúncios com filtros opcionais.
 * @param {object} filters - Filtros de busca
 * @param {string} filters.city
 * @param {string} filters.region
 * @param {string} filters.type
 * @param {number} filters.numberOfRooms
 * @param {boolean} filters.active
 * @param {number} filters.area
 * @param {string} filters.title
 * @param {string} filters.createdAt
 * @param {string} filters.displayEndDate
 * @param {boolean} filters.featured
 * @returns {Promise<RealEstateAdvertisement[]>} Lista de entidades Advertisement.
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

  const response = await axiosInstance.get('/advertisements', { params })
  return RealEstateAdvertisementMapper.toEntityList(response.data)
}

/**
 * Busca um anúncio específico por ID.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement.
 */
export const getAdvertisementById = async (id) => {
  const response = await axiosInstance.get(`/advertisements/${id}`)
  return RealEstateAdvertisementMapper.toEntity(response.data)
}

/**
 * Cria um novo anúncio com dados completos.
 * @param {object} advertisementRequest - Dados completos para criação do anúncio
 * @returns {Promise<RealEstateAdvertisement>}
 */
export const createAdvertisement = async (advertisementRequest) => {
  try {
    const response = await axiosInstance.post('/advertisements', advertisementRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return RealEstateAdvertisementMapper.toEntity(response.data)
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
 * @param {number} id - O ID do anúncio.
 * @param {object} advertisementData - Dados atualizados do anúncio.
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement atualizada.
 */
export const updateAdvertisement = async (id, advertisementData) => {
  try {
    const response = await axiosInstance.put(`/advertisements/${id}`, advertisementData)
    return RealEstateAdvertisementMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [ADVERTISEMENTS API] Erro ao atualizar anúncio ${id}:`, error)
    throw error
  }
}

/**
 * Ativa ou desativa um anúncio.
 * @param {number} id - O ID do anúncio.
 * @param {boolean} active - Status ativo/inativo.
 * @returns {Promise<RealEstateAdvertisement>} Entidade Advertisement atualizada.
 */
export const updateAdvertisementStatus = async (id, active) => {
  try {
    const response = await axiosInstance.patch(`/advertisements/${id}`, { active })
    return RealEstateAdvertisementMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [ADVERTISEMENTS API] Erro ao atualizar status do anúncio ${id}:`, error)
    throw error
  }
}

// Alias para compatibilidade
export const listAllAdvertisements = getAllAdvertisements
export const createAdvertisementWithImages = async (advertisementData, imageFiles = []) => {
  try {
    let imageUrls = []
    let imageTypes = []

    // 1. Upload das imagens primeiro (se houver)
    if (imageFiles.length > 0) {
      const { uploadImages } = await import('./imageApi')
      imageUrls = await uploadImages(imageFiles)
      imageTypes = imageUrls.map(() => 2) // Tipo galeria por padrão
    }

    // 2. Criar o anúncio com as URLs das imagens
    const requestWithImages = {
      ...advertisementData,
      images: imageUrls,
      imageType: imageTypes
    }

    const result = await createAdvertisement(requestWithImages)

    return {
      ...result,
      uploadedImages: imageUrls,
      imageCount: imageUrls.length
    }

  } catch (error) {
    console.error('❌ [ADVERTISEMENT API] Complete creation failed:', error)
    throw error
  }
}
