/**
 * Formata um número de telefone brasileiro.
 * @param {string} phone - Número do telefone sem formatação.
 * @returns {string} Telefone formatado no padrão (XX) XXXXX-XXXX.
 * @example
 * formatPhoneNumber("11987654321"); // "(11) 98765-4321"
 */
export function formatPhoneNumber(phone) {
  phone = phone.replace(/\D/g, '')
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}
