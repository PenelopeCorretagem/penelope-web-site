import * as contactUsApi from '@api-penelopec/contactUsApi'
import { contactUsMapper } from '@mappers/contactUsMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Envia uma mensagem de contato.
 * @param {object} contactData - Dados do contato { nome, email, assunto, mensagem }
 * @returns {Promise<ContactUs>} Entidade ContactUs criada ou confirmação
 */
export const sendContactMessage = async (contactData) => {
  // Transformar dados para formato de requisição se necessário
  const payload = contactUsMapper?.toRequestPayload?.(contactData) || contactData

  const response = await contactUsApi.sendContactMessage(payload)

  // Tentar mapear resposta se houver mapper disponível
  return contactUsMapper?.toEntity?.(response) || response
}
