import { ContactUs } from '../../model/entities/ContactUs'

export const contactUsMapper = {
  /**
   * Converte dados do formulário para entidade ContactUs
   */
  toEntity: (data) => {
    if (!data) return null
    return new ContactUs(data)
  },

  /**
   * Converte entidade ContactUs para payload de requisição
   */
  toRequestPayload: (contactUs) => {
    if (!contactUs) return null
    if (contactUs instanceof ContactUs) {
      return contactUs.toRequestPayload()
    }
    // Se for um objeto simples, converte para ContactUs primeiro
    const contactUsEntity = new ContactUs(contactUs)
    return contactUsEntity.toRequestPayload()
  },
}
