import axiosInstance from '@api/axiosInstance'

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Envia uma mensagem de contato.
 * @param {object} contactData - Dados do contato { nome, email, assunto, mensagem }
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const sendContactMessage = async (contactData) => {
  const response = await axiosInstance.post('/contact-us', contactData)
  return response.data
}
