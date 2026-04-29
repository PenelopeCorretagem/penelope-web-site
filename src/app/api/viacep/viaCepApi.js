import axiosInstance from '@api/axiosInstance'
import { cleanCEP } from '@shared/utils/CEP/formatCEPUtil'
import { ViaCepAddressDTO } from '@dtos/ViaCepAddressDTO'

const VIACEP_BASE_URL = import.meta.env.VIACEP_URL
/**
 * Camada de API - Responsável apenas por requisições HTTP ao ViaCEP
 * Retorna dados brutos (DTO) sem transformação de negócio
 */

/**
 * Busca endereço por CEP na API ViaCEP
 * @param {string} cep - CEP para busca (com ou sem formatação)
 * @returns {Promise<ViaCepAddressDTO>} Dados brutos da API
 * @throws {Error} Se a requisição falhar
 */
export async function getAddressByCEP(cep) {
  try {
    const cleanedCEP = cleanCEP(cep)

    if (!cleanedCEP || cleanedCEP.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos')
    }

    const fullUrl = `${VIACEP_BASE_URL}/${cleanedCEP}/json/`

    const response = await axiosInstance.get(fullUrl, {
      timeout: 10000,
    })

    const data = response.data

    // Verificar se CEP foi encontrado
    if (data.erro) {
      throw new Error('CEP não encontrado')
    }

    // Retornar dados brutos como DTO (sem transformação de negócio)
    return new ViaCepAddressDTO(data)
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('CEP não encontrado')
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Tempo limite esgotado. Verifique sua conexão.')
    }

    throw new Error(error.message || 'Erro ao consultar CEP. Tente novamente.')
  }
}
