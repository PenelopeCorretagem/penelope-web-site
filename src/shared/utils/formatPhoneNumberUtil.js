/**
 * Formata um número de telefone brasileiro.
 * @param {string} phone - Número do telefone sem formatação.
 * @returns {string} Telefone formatado no padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
 * @example
 * formatPhoneNumber("11987654321"); // "(11) 98765-4321"
 * formatPhoneNumber("1187654321"); // "(11) 8765-4321"
 */
export function formatPhoneNumber(phone) {
  if (!phone) return ''

  // Remove tudo que não é número
  const cleanPhone = phone.replace(/\D/g, '')

  // Se tem 11 dígitos (celular com 9)
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  // Se tem 10 dígitos (telefone fixo ou celular antigo)
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  // Para números incompletos, formata o que conseguir
  if (cleanPhone.length >= 6) {
    if (cleanPhone.length <= 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d*)/, '($1) $2-$3').replace(/-$/, '')
    } else {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d*)/, '($1) $2-$3').replace(/-$/, '')
    }
  }

  if (cleanPhone.length >= 2) {
    return cleanPhone.replace(/(\d{2})(\d*)/, '($1) $2')
  }

  return cleanPhone
}

/**
 * Remove a formatação do telefone, retornando apenas números.
 * @param {string} phone - Telefone formatado.
 * @returns {string} Apenas os números do telefone.
 * @example
 * cleanPhoneNumber("(11) 98765-4321"); // "11987654321"
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}
