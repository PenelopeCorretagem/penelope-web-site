import { ContactUs } from '@dtos/ContactUs'

export const contactUsMapper = {
  // API usa campos em português — o Mapper é o único que conhece isso
  toEntity(data) {
    if (!data) return null

    return new ContactUs({
      name: data.nome ?? data.name,
      email: data.email,
      subject: data.assunto ?? data.subject,
      message: data.mensagem ?? data.message,
    })
  },

  toRequestPayload(contactUs) {
    if (!contactUs) return null

    // Serializa para o contrato da API (campos em português)
    return {
      nome: contactUs.name,
      email: contactUs.email,
      assunto: contactUs.subject,
      mensagem: contactUs.message,
    }
  },
}
