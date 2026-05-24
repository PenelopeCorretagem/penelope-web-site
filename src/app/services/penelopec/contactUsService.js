import * as contactUsApi from '@api-penelopec/contactUsApi'
import { contactUsMapper } from '@mappers/contactUsMapper'
import { ContactUs } from '@dtos/ContactUs'
import { handleContactUsError } from '@responses/penelopec/ContactUsResponse'

export const sendContactMessage = async (contactData) => {
  if (!contactData)
    throw new Error('Os dados do contato são obrigatórios')
  if (!contactData.name)
    throw new Error('O nome é obrigatório')
  if (!contactData.email)
    throw new Error('O e-mail é obrigatório')
  if (!contactData.subject)
    throw new Error('O assunto é obrigatório')
  if (!contactData.message)
    throw new Error('A mensagem é obrigatória')

  try {
    const entity = contactData instanceof ContactUs
      ? contactData
      : contactUsMapper.toEntity(contactData)

    const payload = contactUsMapper.toRequestPayload(entity)
    const response = await contactUsApi.sendContactMessage(payload)

    return response ? contactUsMapper.toEntity(response) : null
  } catch (error) {
    throw handleContactUsError(error, 'Envio de Mensagem')
  }
}
