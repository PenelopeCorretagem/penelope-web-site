import axiosInstance from '@api/axios/axiosInstance'
import { IMAGE_TYPE_IDS } from '@constant/imageTypes'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

export const uploadImages = async (files) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))

  const response = await axiosInstance.post('/images', formData, {
    baseURL: PENELOPEC_API_BASE_URL,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  return response.data
}

export const uploadEstateImages = async (estateId, files, typeId = IMAGE_TYPE_IDS.GALLERY) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  formData.append('typeId', typeId.toString())

  const response = await axiosInstance.post(`/empreendimentos/${estateId}/imagens`, formData, {
    baseURL: PENELOPEC_API_BASE_URL,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const uploadCoverImage = async (estateId, file) => {
  return uploadEstateImages(estateId, [file], IMAGE_TYPE_IDS.COVER)
}

export const uploadGalleryImages = async (estateId, files) => {
  return uploadEstateImages(estateId, files, IMAGE_TYPE_IDS.GALLERY)
}

export const uploadFloorPlanImages = async (estateId, files) => {
  return uploadEstateImages(estateId, files, IMAGE_TYPE_IDS.FLOOR_PLAN)
}

export const getEstateImages = async (estateId) => {
  const response = await axiosInstance.get(`/empreendimentos/${estateId}/imagens`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const getImageById = async (imageId) => {
  const response = await axiosInstance.get(`/imagens/${imageId}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const updateImage = async (imageId, payload) => {
  const response = await axiosInstance.put(`/imagens/${imageId}`, payload, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const deleteImage = async (imageId) => {
  await axiosInstance.delete(`/imagens/${imageId}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
}

export const getImageTypes = async () => {
  const response = await axiosInstance.get('/tipos-imagem', {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const getImageTypeById = async (id) => {
  const response = await axiosInstance.get(`/tipos-imagem/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const fetchImageTypeByDescription = async (description) => {
  const response = await axiosInstance.get(`/tipos-imagem/descricao/${description}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const getEstateImagesByType = async (estateId, typeId) => {
  const response = await axiosInstance.get(`/empreendimentos/${estateId}/imagens/tipo/${typeId}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
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

export const setAsCoverImage = async (estateId, imageId) => {
  const response = await axiosInstance.patch(
    `/empreendimentos/${estateId}/imagens/${imageId}/capa`,
    null,
    { baseURL: PENELOPEC_API_BASE_URL }
  )
  return response.data
}
