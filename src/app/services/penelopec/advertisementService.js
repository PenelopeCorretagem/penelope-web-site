/**
 * advertisementService.js
 * Orquestra chamadas à API, aplica regras de negócio e retorna entidades mapeadas.
 */
import * as advertisementApi from '@api-penelopec/advertisementApi'
import { AdvertisementMapper } from '@mappers/AdvertisementMapper'
import { Advertisement } from '@dtos/Advertisement'
import { handleAdvertisementError } from '@responses/penelopec/AdvertisementResponse'

export const getAllAdvertisements = async (filters = {}) => {
  try {
    const response = await advertisementApi.getAllAdvertisements(filters)
    const rawList = response?.content || response || []
    return AdvertisementMapper.toEntityList(rawList)
  } catch (error) {
    throw handleAdvertisementError(error, 'Listagem')
  }
}

export const getAdvertisementById = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para buscar um anúncio')

  try {
    const response = await advertisementApi.getAdvertisementById(id)
    return AdvertisementMapper.toEntity(response)
  } catch (error) {
    throw handleAdvertisementError(error, 'Busca')
  }
}

export const getAdvertisementsByEstate = async (estateId) => {
  if (!estateId)
    throw new Error('O ID do empreendimento é obrigatório para buscar anúncios')

  try {
    const response = await advertisementApi.getAdvertisementsByEstate(estateId)
    const rawList = response?.content || response || []
    return AdvertisementMapper.toEntityList(rawList)
  } catch (error) {
    throw handleAdvertisementError(error, 'Listagem por Empreendimento')
  }
}

export const createAdvertisement = async (advertisementData) => {
  if (!advertisementData)
    throw new Error('Os dados do anúncio são obrigatórios')

  try {
    const payload = advertisementData instanceof Advertisement
      ? AdvertisementMapper.toApiData(advertisementData)
      : advertisementData

    const response = await advertisementApi.createAdvertisement(payload)
    return AdvertisementMapper.toEntity(response)
  } catch (error) {
    throw handleAdvertisementError(error, 'Criação')
  }
}

export const updateAdvertisement = async (id, advertisementData) => {
  if (!id)
    throw new Error('O ID é obrigatório para atualizar um anúncio')
  if (!advertisementData)
    throw new Error('Os dados de atualização são obrigatórios')

  try {
    const payload = advertisementData instanceof Advertisement
      ? AdvertisementMapper.toApiData(advertisementData)
      : advertisementData

    const response = await advertisementApi.updateAdvertisement(id, payload)
    return AdvertisementMapper.toEntity(response)
  } catch (error) {
    throw handleAdvertisementError(error, 'Atualização')
  }
}

export const updateAdvertisementStatus = async (id, active) => {
  if (!id)
    throw new Error('O ID é obrigatório para atualizar o status do anúncio')
  if (active === undefined || active === null)
    throw new Error('O status é obrigatório')

  try {
    const response = await advertisementApi.updateAdvertisementStatus(id, active)
    return AdvertisementMapper.toEntity(response)
  } catch (error) {
    throw handleAdvertisementError(error, 'Atualização de Status')
  }
}

export const deleteAdvertisement = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para excluir um anúncio')

  try {
    await advertisementApi.deleteAdvertisement(id)
  } catch (error) {
    throw handleAdvertisementError(error, 'Exclusão')
  }
}
