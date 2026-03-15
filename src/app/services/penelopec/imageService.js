import * as imageApi from '@api-penelopec/imageApi'
import { imageEstateMapper } from '@mappers/imageEstateMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Faz upload de imagens independentes (sem estateId).
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<string[]>} Lista de URLs das imagens
 */
export const uploadImages = async (files) => {
  return await imageApi.uploadImages(files)
}

/**
 * Faz upload de imagens para um empreendimento específico.
 * @param {number|null} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @param {number} typeId - ID do tipo de imagem
 * @returns {Promise<ImageEstate[]|string[]>} Lista de entidades ou URLs
 */
export const uploadEstateImages = async (estateId, files, typeId) => {
  const response = await imageApi.uploadEstateImages(estateId, files, typeId)

  // Se for array de strings, retornar como é
  if (Array.isArray(response) && typeof response[0] === 'string') {
    return response
  }

  // Caso contrário, mapear para entidades
  return imageEstateMapper.toEntityList(response)
}

/**
 * Faz upload de uma imagem de capa para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<ImageEstate>} Entidade ImageEstate criada
 */
export const uploadCoverImage = async (estateId, file) => {
  const response = await imageApi.uploadCoverImage(estateId, file)
  return Array.isArray(response) ? imageEstateMapper.toEntity(response[0]) : imageEstateMapper.toEntity(response)
}

/**
 * Faz upload de imagens da galeria para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate criadas
 */
export const uploadGalleryImages = async (estateId, files) => {
  const response = await imageApi.uploadGalleryImages(estateId, files)
  return Array.isArray(response) && typeof response[0] === 'string' ?
    response :
    imageEstateMapper.toEntityList(response)
}

/**
 * Faz upload de imagens de planta para um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @param {File[]} files - Array de arquivos de imagem
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate criadas
 */
export const uploadFloorPlanImages = async (estateId, files) => {
  const response = await imageApi.uploadFloorPlanImages(estateId, files)
  return Array.isArray(response) && typeof response[0] === 'string' ?
    response :
    imageEstateMapper.toEntityList(response)
}

/**
 * Lista todas as imagens de um empreendimento.
 * @param {number} estateId - ID do empreendimento
 * @returns {Promise<ImageEstate[]>} Lista de entidades ImageEstate
 */
export const getEstateImages = async (estateId) => {
  const response = await imageApi.getEstateImages(estateId)
  return imageEstateMapper.toEntityList(response)
}
