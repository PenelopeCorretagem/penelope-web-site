import axiosInstance from './axiosInstance'
import { contactUsMapper } from '../mapper/contactUsMapper'

/**
 * Solicita o envio de uma mensagem de contato.
 * @param {object} contactData - Dados do contato { nome, email, assunto, mensagem }
 * @returns {Promise<string>} Mensagem de sucesso.
 */
export const sendContactMessage = async (contactData) => {
  const payload = contactUsMapper.toRequestPayload(contactData)
  const response = await axiosInstance.post('/contact-us', payload)
  return response.data
}
