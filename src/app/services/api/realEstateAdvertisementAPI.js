import axiosInstance from './axiosInstance'
import { RealEstateAdvertisementMapper } from '@mapper/RealEstateAdvertisementMapper'

/**
 * Lista todos os anúncios ativos com filtros opcionais.
 * @param {object} filters - Filtros de busca (cidade, regiao, tipo, quartos, ativo)
 * @returns {Promise<Advertisement[]>} Lista de entidades Advertisement.
 */
export const listAllActiveAdvertisements = async (filters = {}) => {
  const response = await axiosInstance.get('/anuncios', { params: filters })
  console.log(response.data)
  return RealEstateAdvertisementMapper.toEntityList(response.data)
}

/**
 * Busca o anúncio mais recente.
 * @returns {Promise<Advertisement>} Entidade Advertisement.
 */
export const getLatestAdvertisement = async () => {
  const response = await axiosInstance.get('/anuncios/latest')
  return RealEstateAdvertisementMapper.toEntity(response.data)
}

/**
 * Busca um anúncio específico por ID.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<Advertisement>} Entidade Advertisement.
 */
export const getAdvertisementById = async (id) => {
  const response = await axiosInstance.get(`/anuncios/${id}`)
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
 * Exclui um anúncio.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<void>}
 */
export const deleteAdvertisement = async (id) => {
  await axiosInstance.delete(`/anuncios/${id}`)
}

/**
 * Desativa um anúncio.
 * @param {number} id - O ID do anúncio.
 * @returns {Promise<void>}
 */
export const softDeleteAdvertisement = async (id) => {
  await axiosInstance.patch(`/anuncios/${id}`)
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
