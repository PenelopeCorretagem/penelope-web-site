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
 * @param {string} filters.description
 * @param {string|Date} filters.createdAt
 * @param {string|Date} filters.createdAtMin
 * @param {string|Date} filters.createdAtMax
 * @param {string|Date} filters.endDate
 * @param {string|Date} filters.endDateMin
 * @param {string|Date} filters.endDateMax
 */
export const listAllActiveAdvertisements = async (filters = {}) => {
  const params = {
    city: filters.city,
    region: filters.region,
    type: filters.type,
    numberOfRooms: filters.numberOfRooms,
    active: filters.active,
    area: filters.area,
    title: filters.title,
    description: filters.description,

    // === CreatedAt filters ===
    createdAt: filters.createdAt,
    createdAtMin: filters.createdAtMin,
    createdAtMax: filters.createdAtMax,

    // === EndDate filters ===
    endDate: filters.endDate,
    endDateMin: filters.endDateMin,
    endDateMax: filters.endDateMax
  }

  const response = await axiosInstance.get('/anuncios', { params })
  console.log(response)

  return RealEstateAdvertisementMapper.toEntityList(response.data)
}

/**
 * Busca o anúncio mais recente.
 * @returns {Promise<Advertisement>} Entidade Advertisement.
 */
export const getLatestAdvertisement = async () => {
  const response = await axiosInstance.get('/anuncios/latest')
  console.log(response)
  return RealEstateAdvertisementMapper.toEntity(response.data)
}

/**
 * Busca um anúncio específico por ID.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<Advertisement>} Entidade Advertisement.
 */
export const getAdvertisementById = async (id) => {
  const response = await axiosInstance.get(`/anuncios/${id}`)
  console.log(response)
  return RealEstateAdvertisementMapper.toEntity(response.data)
}

/**
 * Cria um novo anúncio com dados completos (incluindo URLs de imagens pré-uploadadas).
 * @param {object} advertisementRequest - Dados completos para criação do anúncio
 * @returns {Promise<any>}
 */
export const createAdvertisement = async (advertisementRequest) => {
  try {
    const response = await axiosInstance.post('/anuncios', advertisementRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Backend pode retornar diferentes formatos dependendo do sucesso
    if (response.status === 201) {
      return {
        success: true,
        message: 'Advertisement created successfully',
        data: response.data || null,
        created: true
      }
    }

    console.log(response)
    return response.data
  } catch (error) {
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Dados inválidos fornecidos'
      throw new Error(`Erro de validação: ${message}`)
    } else if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor. Tente novamente mais tarde.')
    }

    throw error
  }
}

/**
 * Atualiza um anúncio existente.
 * @param {number} id - O ID do anúncio.
 * @param {object} advertisementRequest - Dados para atualização do anúncio
 * @returns {Promise<Advertisement>} Entidade Advertisement atualizada.
 */
export const updateAdvertisement = async (id, advertisementRequest) => {
  try {
    const response = await axiosInstance.put(`/anuncios/${id}`, advertisementRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Handle different response formats from backend
    if (response.status === 204) {
      // No Content response - update was successful
      return {
        success: true,
        message: 'Advertisement updated successfully',
        data: null,
        updated: true
      }
    }

    return RealEstateAdvertisementMapper.toEntity(response.data) || {
      success: true,
      message: 'Advertisement updated successfully',
      updated: true
    }
  } catch (error) {
    // Better error handling for specific cases
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Dados inválidos fornecidos'
      throw new Error(`Erro de validação: ${message}`)
    } else if (error.response?.status === 404) {
      throw new Error('Propriedade não encontrada')
    } else if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor. Tente novamente mais tarde.')
    }

    throw error
  }
}

/**
 * Desativa um anúncio.
 * @param {number} id - O ID do anúncio.
 * @param {boolean} value - Valor a ser enviado no corpo (true/false)
 * @returns {Promise<void>}
 */
export const softDeleteAdvertisement = async (id, value) => {
  // Envia o booleano diretamente no corpo conforme solicitado (true ou false)
  await axiosInstance.patch(`/anuncios/${id}`, value)
}

/**
 * Cria um anúncio completo: upload de imagens + criação (DEPRECATED - usar createAdvertisement diretamente)
 * @deprecated Use uploadImages + createAdvertisement separadamente para melhor controle
 */
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
