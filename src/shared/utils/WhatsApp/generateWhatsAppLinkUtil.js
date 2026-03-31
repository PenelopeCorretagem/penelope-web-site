/**
 * Gera um link do WhatsApp com mensagem pronta.
 * @param {string} phoneNumber - Número do WhatsApp.
 * @param {string} message - Mensagem a ser enviada.
 * @returns {string} URL do WhatsApp.
 * @example
 * generateWhatsAppLink("11987654321", "Olá, tenho interesse no imóvel!");
 * // "https://wa.me/11987654321?text=Olá%2C%20tenho%20interesse%20no%20imóvel%21"
 */
export function generateWhatsAppLink(phoneNumber, message) {
  return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
