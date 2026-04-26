import axiosInstance from '@api/axiosInstance'
import { IMAGE_TYPE_IDS } from '@constant/imageTypes'
import { imageEstateMapper } from '@mappers/imageEstateMapper'
import { imageEstateTypeMapper } from '@mappers/imageEstateTypeMapper'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Faz upload de imagens independentes (sem estateId).
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<string[]>} Lista de URLs das imagens
 */
export const uploadImages = async (files) => {
  try {
    if (!files || files.length === 0) {
      return []
    }

    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await axiosInstance.post('/images', formData, {
      baseURL: PENELOPEC_API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    })

    if (!response.data) {
      throw new Error('Resposta vazia do servidor')
    }

    const urls = Array.isArray(response.data) ? response.data : [response.data]
    const validUrls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '')

    if (validUrls.length === 0) {
      throw new Error('Nenhuma URL válida retornada pelo servidor')
    }

    if (validUrls.length !== files.length) {
      throw new Error(`Expected ${files.length} URLs, got ${validUrls.length}`)
    }

    return validUrls
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout no upload das imagens. Verifique sua conexão e tente novamente.')
    }

    if (error.response?.status === 413) {
      throw new Error('Arquivos muito grandes. Reduza o tamanho das imagens e tente novamente.')
    }

    if (error.response?.status === 400) {
      throw new Error('Formato de arquivo inválido. Use apenas imagens JPG, PNG ou WebP.')
    }

    if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor durante o upload. Tente novamente.')
    }

    throw new Error(`Falha no upload das imagens: ${error.message}`)
  }
}

/**
 * Faz upload de imagens para um empreendimento específico.
 * @param {number|null} estateId - ID do empreendimento (null para upload independente)
 * @param {File[]} files - Array de arquivos de imagem
 * @param {number} typeId - ID do tipo de imagem
 * @returns {Promise<string[]|object[]>} Lista de URLs ou dados brutos
 */
export const uploadEstateImages = async (estateId, files, typeId = IMAGE_TYPE_IDS.GALLERY) => {
  if (!estateId) {
    return uploadImages(files)
  }

  const formData = new FormData()

  files.forEach(file => {
    formData.append('files', file)
  })

  formData.append('typeId', typeId.toString())

  const response = await axiosInstance.post(`/empreendimentos/${estateId}/imagens`, formData, {
    baseURL: PENELOPEC_API_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

/**
 * Faz upload de uma imagem de capa para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<object>} Dados brutos da imagem
 */
export const uploadCoverImage = async (estateId, file) => {
  const result = await uploadEstateImages(estateId, [file], IMAGE_TYPE_IDS.COVER)
  return Array.isArray(result) ? result[0] : result
}

/**
 * Faz upload de imagens da galeria para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<object[]>} Dados brutos das imagens
 */
export const uploadGalleryImages = async (estateId, files) => {
  return uploadEstateImages(estateId, files, IMAGE_TYPE_IDS.GALLERY)
}

/**
 * Faz upload de imagens de planta para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<object[]>} Dados brutos das imagens
 */
export const uploadFloorPlanImages = async (estateId, files) => {
  return uploadEstateImages(estateId, files, IMAGE_TYPE_IDS.FLOOR_PLAN)
}

/**
 * Lista todas as imagens de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @returns {Promise<object[]>} Dados brutos das imagens
 */
export const getEstateImages = async (estateId) => {
  const response = await axiosInstance.get(`/empreendimentos/${estateId}/imagens`, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}


/**
 * Busca uma imagem específica por ID.
 * @param {number} imageId - ID da imagem
 * @returns {Promise<ImageEstate>} Entidade ImageEstate
 */
export const getImageById = async (imageId) => {
  const response = await axiosInstance.get(`/imagens/${imageId}`, { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateMapper.toEntity(response.data)
}

/**
 * Atualiza uma imagem existente.
 * @param {number} imageId - ID da imagem
 * @param {object} imageData - Dados para atualização
 * @returns {Promise<ImageEstate>} Entidade ImageEstate atualizada
 */
export const updateImage = async (imageId, imageData) => {
  const payload = imageEstateMapper.toRequestPayload(imageData)
  const response = await axiosInstance.put(`/imagens/${imageId}`, payload, { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateMapper.toEntity(response.data)
}

/**
 * Remove uma imagem.
 * @param {number} imageId - ID da imagem
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageId) => {
  await axiosInstance.delete(`/imagens/${imageId}`, { baseURL: PENELOPEC_API_BASE_URL })
}

/**
 * Lista todos os tipos de imagem disponíveis.
 * @returns {Promise<ImageEstateType[]>} Lista de entidades ImageEstateType
 */
export const getImageTypes = async () => {
  const response = await axiosInstance.get('/tipos-imagem', { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateTypeMapper.toEntityList(response.data)
}

/**
 * Busca um tipo de imagem específico por ID.
 * @param {number} id - ID do tipo de imagem (1, 2 ou 3)
 * @returns {Promise<ImageEstateType>} Entidade ImageEstateType
 */
export const getImageTypeById = async (id) => {
  const response = await axiosInstance.get(`/tipos-imagem/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateTypeMapper.toEntity(response.data)
}

/**
 * Busca um tipo de imagem por descrição via API.
 * @param {string} description - Descrição do tipo ('Capa', 'Galeria', 'Planta')
 * @returns {Promise<ImageEstateType>} Entidade ImageEstateType
 */
export const fetchImageTypeByDescription = async (description) => {
  const response = await axiosInstance.get(`/tipos-imagem/descricao/${description}`, { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateTypeMapper.toEntity(response.data)
}

/**
 * Busca imagens por tipo específico de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {number} typeId - ID do tipo de imagem
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateImagesByType = async (estateId, typeId) => {
  const response = await axiosInstance.get(`/empreendimentos/${estateId}/imagens/tipo/${typeId}`, { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateMapper.toEntityList(response.data)
}

/**
 * Busca apenas imagens de capa de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateCoverImages = async (estateId) => {
  return getEstateImagesByType(estateId, IMAGE_TYPE_IDS.COVER)
}

/**
 * Busca apenas imagens da galeria de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateGalleryImages = async (estateId) => {
  return getEstateImagesByType(estateId, IMAGE_TYPE_IDS.GALLERY)
}

/**
 * Busca apenas imagens de planta de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateFloorPlanImages = async (estateId) => {
  return getEstateImagesByType(estateId, IMAGE_TYPE_IDS.FLOOR_PLAN)
}

/**
 * Define uma imagem como capa do empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {number} imageId - ID da imagem
 * @returns {Promise<ImageEstate>} Entidade ImageEstate atualizada
 */
export const setAsCoverImage = async (estateId, imageId) => {
  const response = await axiosInstance.patch(`/empreendimentos/${estateId}/imagens/${imageId}/capa`, null, { baseURL: PENELOPEC_API_BASE_URL })
  return imageEstateMapper.toEntity(response.data)
}
