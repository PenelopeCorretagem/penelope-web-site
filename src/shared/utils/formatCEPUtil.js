/**
 * Formata um CEP brasileiro.
 * @param {string} cep - CEP sem formatação.
 * @returns {string} CEP formatado no padrão XXXXX-XXX.
 * @example
 * formatCEP("01234567"); // "01234-567"
 */
export function formatCEP(cep) {
  if (!cep) return ''

  // Remove tudo que não é número
  const cleanCep = cep.replace(/\D/g, '')

  // Se tem 8 dígitos (CEP completo)
  if (cleanCep.length === 8) {
    return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  // Para números incompletos, formata o que conseguir
  if (cleanCep.length >= 6) {
    return cleanCep.replace(/(\d{5})(\d*)/, '$1-$2').replace(/-$/, '')
  }

  return cleanCep
}

/**
 * Remove a formatação do CEP, retornando apenas números.
 * @param {string} cep - CEP formatado.
 * @returns {string} Apenas os números do CEP.
 * @example
 * cleanCEP("01234-567"); // "01234567"
 */
export function cleanCEP(cep) {
  if (!cep) return ''
  return cep.replace(/\D/g, '')
}

/**
 * Valida se um CEP está no formato correto.
 * @param {string} cep - CEP a ser validado.
 * @returns {boolean|string} true se válido, string com erro caso contrário.
 * @example
 * validateCEP("01234-567"); // true
 * validateCEP("123"); // "CEP deve ter 8 dígitos"
 */
export function validateCEP(cep) {
  if (!cep) {
    return 'CEP é obrigatório'
  }

  const cleanCep = cleanCEP(cep)

  if (cleanCep.length !== 8) {
    return 'CEP deve ter 8 dígitos'
  }

  // Verifica se não são todos números iguais
  if (/^(\d)\1{7}$/.test(cleanCep)) {
    return 'CEP inválido'
  }

  return true
}

/**
 * Formata CEP para envio à API (apenas números).
 * @param {string} cep - CEP formatado ou não.
 * @returns {string} CEP limpo para API.
 */
export function formatCEPForAPI(cep) {
  return cleanCEP(cep)
}

/**
 * Formata CEP vindo da API para exibição.
 * @param {string} cep - CEP da API.
 * @returns {string} CEP formatado para exibição.
 */
export function formatCEPForDisplay(cep) {
  return formatCEP(cep)
}
