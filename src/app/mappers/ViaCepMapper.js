import { mapStateToRegion } from '@shared/constants/viaCepConstants'
import Address from '@dtos/Address'

/**
 * Mapper para converter dados ViaCEP em entidades de domínio
 * Responsável por transformar DTO da API em Address (entidade de domínio)
 */
export class ViaCepMapper {
  /**
   * Converte DTO do ViaCEP para entidade Address de domínio
   * Mapeia apenas os campos suportados pela entidade Address
   *
   * @param {ViaCepAddressDTO} viaCepDTO - Dados brutos da API
   * @returns {Address} Entidade Address normalizada
   */
  static toAddress(viaCepDTO) {
    if (!viaCepDTO) {
      return null
    }

    return new Address({
      zipCode: this.normalizeCEP(viaCepDTO.cep),
      street: viaCepDTO.logradouro || '',
      neighborhood: viaCepDTO.bairro || '',
      city: viaCepDTO.localidade || '',
      uf: viaCepDTO.uf || '',
      region: mapStateToRegion(viaCepDTO.uf || ''),
      // Campos não fornecidos pelo ViaCEP:
      // - id: deixado como null
      // - number: deixado como ''
    })
  }

  /**
   * Normaliza CEP removendo formatação
   * @param {string} cep - CEP com ou sem formatação
   * @returns {string} CEP apenas com números
   */
  static normalizeCEP(cep) {
    if (!cep) return ''
    return cep.replace(/\D/g, '')
  }
}
