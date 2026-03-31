import { getAddressByCEP } from '@api-viacep/viaCepApi'
import { ViaCepMapper } from '@mappers/ViaCepMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Busca endereço formatado para o domínio da aplicação
 * @param {string} cleanedCEP - CEP limpo (apenas números)
 * @returns {Promise<Address>} Entidade Address com dados normalizados
 * @throws {Error} Se a busca falhar
 */
export async function fetchAddressByCEP(cleanedCEP) {
  try {
    // 1. Chamar API para obter dados brutos (DTO)
    const viaCepDto = await getAddressByCEP(cleanedCEP)

    // 2. Mapear DTO para entidade de domínio
    const address = ViaCepMapper.toAddress(viaCepDto)

    return address
  } catch (error) {
    throw new Error(error.message || 'Erro ao buscar endereço pelo CEP')
  }
}
