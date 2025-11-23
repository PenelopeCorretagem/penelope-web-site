import axiosInstance from './axiosInstance'
import { imageEstateMapper } from '../mapper/imageEstateMapper'
import { imageEstateTypeMapper } from '../mapper/imageEstateTypeMapper'
import { IMAGE_TYPE_IDS } from '@constant/imageTypes'

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

    // Adicionar arquivos ao FormData
    files.forEach((file, _index) => {
      formData.append('files', file)
    })

    const response = await axiosInstance.post('/anuncios/fotos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 segundos para upload
    })

    // Validar resposta
    if (!response.data) {
      throw new Error('Resposta vazia do servidor')
    }

    // O backend retorna List<String> diretamente
    const urls = Array.isArray(response.data) ? response.data : [response.data]

    // Validar URLs
    const validUrls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '')

    if (validUrls.length === 0) {
      throw new Error('Nenhuma URL válida retornada pelo servidor')
    }

    if (validUrls.length !== files.length) {
      throw new Error(`[IMAGE API] Expected ${files.length} URLs, got ${validUrls.length}`)
    }

    return validUrls
  } catch (error) {
    // Tratar diferentes tipos de erro
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
 * @param {number} typeId - ID do tipo de imagem (1=Capa, 2=Galeria, 3=Planta)
 * @returns {Promise<ImageEstate[]|string[]>} Lista de entidades ImageEstate ou URLs
 */
export const uploadEstateImages = async (estateId, files, typeId = IMAGE_TYPE_IDS.GALLERY) => {
  // Se não há estateId, faz upload independente usando a nova rota
  if (!estateId) {
    return uploadImages(files, typeId)
  }

  // Lógica original para upload com estateId (mantida para compatibilidade)
  const formData = new FormData()

  files.forEach(file => {
    formData.append('files', file)
  })

  formData.append('typeId', typeId.toString())

  const response = await axiosInstance.post(`/empreendimentos/${estateId}/imagens`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  // Se a resposta for um array de strings (URLs), retornar como objetos
  if (Array.isArray(response.data) && typeof response.data[0] === 'string') {
    return response.data.map(url => ({ url }))
  }

  // Caso contrário, usar o mapper normal
  return imageEstateMapper.toEntityList(response.data)
}

/**
 * Faz upload de uma imagem de capa para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<ImageEstate>} Entidade ImageEstate criada
 */
export const uploadCoverImage = async (estateId, file) => {
  const result = await uploadEstateImages(estateId, [file], IMAGE_TYPE_IDS.COVER)
  return result[0] || null
}

/**
 * Faz upload de imagens da galeria para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate criadas
 */
export const uploadGalleryImages = async (estateId, files) => {
  return uploadEstateImages(estateId, files, IMAGE_TYPE_IDS.GALLERY)
}

/**
 * Faz upload de imagens de planta para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate criadas
 */
export const uploadFloorPlanImages = async (estateId, files) => {
  return uploadEstateImages(estateId, files, IMAGE_TYPE_IDS.FLOOR_PLAN)
}

/**
 * Lista todas as imagens de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateImages = async (estateId) => {
  const response = await axiosInstance.get(`/empreendimentos/${estateId}/imagens`)
  return imageEstateMapper.toEntityList(response.data)
}

/**
 * Busca uma imagem específica por ID.
 * @param {number} imageId - ID da imagem
 * @returns {Promise<ImageEstate>} Entidade ImageEstate
 */
export const getImageById = async (imageId) => {
  const response = await axiosInstance.get(`/imagens/${imageId}`)
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
  const response = await axiosInstance.put(`/imagens/${imageId}`, payload)
  return imageEstateMapper.toEntity(response.data)
}

/**
 * Remove uma imagem.
 * @param {number} imageId - ID da imagem
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageId) => {
  await axiosInstance.delete(`/imagens/${imageId}`)
}

/**
 * Lista todos os tipos de imagem disponíveis.
 * @returns {Promise<ImageEstateType[]>} Lista de entidades ImageEstateType
 */
export const getImageTypes = async () => {
  const response = await axiosInstance.get('/tipos-imagem')
  return imageEstateTypeMapper.toEntityList(response.data)
}

/**
 * Busca um tipo de imagem específico por ID.
 * @param {number} id - ID do tipo de imagem (1, 2 ou 3)
 * @returns {Promise<ImageEstateType>} Entidade ImageEstateType
 */
export const getImageTypeById = async (id) => {
  const response = await axiosInstance.get(`/tipos-imagem/${id}`)
  return imageEstateTypeMapper.toEntity(response.data)
}

/**
 * Busca um tipo de imagem por descrição via API.
 * @param {string} description - Descrição do tipo ('Capa', 'Galeria', 'Planta')
 * @returns {Promise<ImageEstateType>} Entidade ImageEstateType
 */
export const fetchImageTypeByDescription = async (description) => {
  const response = await axiosInstance.get(`/tipos-imagem/descricao/${description}`)
  return imageEstateTypeMapper.toEntity(response.data)
}

/**
 * Busca imagens por tipo específico de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {number} typeId - ID do tipo de imagem
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateImagesByType = async (estateId, typeId) => {
  const response = await axiosInstance.get(`/empreendimentos/${estateId}/imagens/tipo/${typeId}`)
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
  const response = await axiosInstance.patch(`/empreendimentos/${estateId}/imagens/${imageId}/capa`)
  return imageEstateMapper.toEntity(response.data)
}
