import * as imageApi from '@api-penelopec/imageApi'
import { imageEstateMapper } from '@mappers/imageEstateMapper'
import { imageEstateTypeMapper } from '@mappers/imageEstateTypeMapper'
import { handleImageError } from '@responses/penelopec/ImageResponse'

// Helper interno: a API de upload pode retornar URLs (string[]) ou objetos
// dependendo se o estateId foi fornecido ou não
const mapUploadResponse = (response) => {
  if (!Array.isArray(response)) return imageEstateMapper.toEntity(response)
  if (typeof response[0] === 'string') return response
  return imageEstateMapper.toEntityList(response)
}

// ===== UPLOAD =====

export const uploadImages = async (files) => {
  if (!files?.length)
    throw new Error('Nenhum arquivo fornecido para upload')

  try {
    const urls = await imageApi.uploadImages(files)

    const validUrls = (Array.isArray(urls) ? urls : [urls])
      .filter(url => url && typeof url === 'string' && url.trim() !== '')

    if (validUrls.length === 0)
      throw new Error('Nenhuma URL válida retornada pelo servidor')
    if (validUrls.length !== files.length)
      throw new Error(`Esperado ${files.length} URLs, recebido ${validUrls.length}`)

    return validUrls
  } catch (error) {
    throw handleImageError(error, 'Upload')
  }
}

export const uploadEstateImages = async (estateId, files, typeId) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')
  if (!files?.length)
    throw new Error('Nenhum arquivo fornecido para upload')

  try {
    const response = await imageApi.uploadEstateImages(estateId, files, typeId)
    return mapUploadResponse(response)
  } catch (error) {
    throw handleImageError(error, 'Upload de Imagens do Empreendimento')
  }
}

export const uploadCoverImage = async (estateId, file) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')
  if (!file)
    throw new Error('O arquivo é obrigatório')

  try {
    const response = await imageApi.uploadCoverImage(estateId, file)
    return mapUploadResponse(Array.isArray(response) ? response[0] : response)
  } catch (error) {
    throw handleImageError(error, 'Upload de Capa')
  }
}

export const uploadGalleryImages = async (estateId, files) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')
  if (!files?.length)
    throw new Error('Nenhum arquivo fornecido para upload')

  try {
    const response = await imageApi.uploadGalleryImages(estateId, files)
    return mapUploadResponse(response)
  } catch (error) {
    throw handleImageError(error, 'Upload de Galeria')
  }
}

export const uploadFloorPlanImages = async (estateId, files) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')
  if (!files?.length)
    throw new Error('Nenhum arquivo fornecido para upload')

  try {
    const response = await imageApi.uploadFloorPlanImages(estateId, files)
    return mapUploadResponse(response)
  } catch (error) {
    throw handleImageError(error, 'Upload de Plantas')
  }
}

// ===== LEITURA =====

export const getEstateImages = async (estateId) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')

  try {
    const response = await imageApi.getEstateImages(estateId)
    return imageEstateMapper.toEntityList(response)
  } catch (error) {
    throw handleImageError(error, 'Listagem de Imagens')
  }
}

export const getImageById = async (imageId) => {
  if (!imageId)
    throw new Error('O ID da imagem é obrigatório')

  try {
    const response = await imageApi.getImageById(imageId)
    return imageEstateMapper.toEntity(response)
  } catch (error) {
    throw handleImageError(error, 'Busca de Imagem')
  }
}

export const getEstateImagesByType = async (estateId, typeId) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')
  if (!typeId)
    throw new Error('O tipo de imagem é obrigatório')

  try {
    const response = await imageApi.getEstateImagesByType(estateId, typeId)
    return imageEstateMapper.toEntityList(response)
  } catch (error) {
    throw handleImageError(error, 'Busca por Tipo')
  }
}

export const getEstateCoverImages = async (estateId) => {
  return getEstateImagesByType(estateId, IMAGE_TYPE_IDS.COVER)
}

export const getEstateGalleryImages = async (estateId) => {
  return getEstateImagesByType(estateId, IMAGE_TYPE_IDS.GALLERY)
}

export const getEstateFloorPlanImages = async (estateId) => {
  return getEstateImagesByType(estateId, IMAGE_TYPE_IDS.FLOOR_PLAN)
}

// ===== ATUALIZAÇÃO =====

export const updateImage = async (imageId, imageData) => {
  if (!imageId)
    throw new Error('O ID da imagem é obrigatório')
  if (!imageData)
    throw new Error('Os dados de atualização são obrigatórios')

  try {
    const payload = imageEstateMapper.toRequestPayload(imageData)
    const response = await imageApi.updateImage(imageId, payload)
    return imageEstateMapper.toEntity(response)
  } catch (error) {
    throw handleImageError(error, 'Atualização de Imagem')
  }
}

export const setAsCoverImage = async (estateId, imageId) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório')
  if (!imageId)
    throw new Error('O ID da imagem é obrigatório')

  try {
    const response = await imageApi.setAsCoverImage(estateId, imageId)
    return imageEstateMapper.toEntity(response)
  } catch (error) {
    throw handleImageError(error, 'Definir Capa')
  }
}

// ===== EXCLUSÃO =====

export const deleteImage = async (imageId) => {
  if (!imageId)
    throw new Error('O ID da imagem é obrigatório')

  try {
    await imageApi.deleteImage(imageId)
  } catch (error) {
    throw handleImageError(error, 'Exclusão de Imagem')
  }
}

// ===== TIPOS DE IMAGEM =====

export const getImageTypes = async () => {
  try {
    const response = await imageApi.getImageTypes()
    return imageEstateTypeMapper.toEntityList(response)
  } catch (error) {
    throw handleImageError(error, 'Listagem de Tipos')
  }
}

export const getImageTypeById = async (id) => {
  if (!id)
    throw new Error('O ID do tipo de imagem é obrigatório')

  try {
    const response = await imageApi.getImageTypeById(id)
    return imageEstateTypeMapper.toEntity(response)
  } catch (error) {
    throw handleImageError(error, 'Busca de Tipo')
  }
}

export const fetchImageTypeByDescription = async (description) => {
  if (!description)
    throw new Error('A descrição do tipo de imagem é obrigatória')

  try {
    const response = await imageApi.fetchImageTypeByDescription(description)
    return imageEstateTypeMapper.toEntity(response)
  } catch (error) {
    throw handleImageError(error, 'Busca de Tipo por Descrição')
  }
}
