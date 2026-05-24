import * as amenitiesApi from '@api-penelopec/amenitiesApi'
import { AmenityMapper } from '@mappers/AmenityMapper'
import { Amenity } from '@dtos/Amenity'
import { handleAmenitiesError } from '@responses/penelopec/AmenitiesResponse'

export const getAllAmenities = async (page = 1, pageSize = 10, search = '', sort = '', initial = '') => {
  try {
    const response = await amenitiesApi.getAllAmenities(page, pageSize, search, sort, initial)
    return AmenityMapper.toPaginatedEntityList(response)
  } catch (error) {
    throw handleAmenitiesError(error, 'Listagem')
  }
}

export const getAmenityById = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para buscar um diferencial')

  try {
    const response = await amenitiesApi.getAmenityById(id)
    return AmenityMapper.toEntity(response)
  } catch (error) {
    throw handleAmenitiesError(error, 'Busca')
  }
}

export const createAmenity = async (amenityData) => {
  if (!amenityData)
    throw new Error('Os dados do diferencial são obrigatórios')
  if (!amenityData.description)
    throw new Error('A descrição do diferencial é obrigatória')

  try {
    const payload = amenityData instanceof Amenity
      ? amenityData.toRequestPayload()
      : amenityData

    const response = await amenitiesApi.createAmenity(payload)
    return AmenityMapper.toEntity(response)
  } catch (error) {
    throw handleAmenitiesError(error, 'Criação')
  }
}

export const updateAmenity = async (id, amenityData) => {
  if (!id)
    throw new Error('O ID é obrigatório para atualizar um diferencial')
  if (!amenityData)
    throw new Error('Os dados de atualização são obrigatórios')

  try {
    const payload = amenityData instanceof Amenity
      ? amenityData.toRequestPayload()
      : amenityData

    const response = await amenitiesApi.updateAmenity(id, payload)
    return AmenityMapper.toEntity(response)
  } catch (error) {
    throw handleAmenitiesError(error, 'Atualização')
  }
}

export const deleteAmenity = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para excluir um diferencial')

  try {
    await amenitiesApi.deleteAmenity(id)
  } catch (error) {
    throw handleAmenitiesError(error, 'Exclusão')
  }
}
