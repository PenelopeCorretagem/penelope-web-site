/**
 * Valida se uma senha atende aos critérios de segurança.
 * @param {string} password - A senha a ser validada.
 * @returns {boolean|string} true se válida, string com erro caso contrário.
 * @example
 * validatePassword("MinhaSenh@123"); // true
 * validatePassword("123"); // "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número, um caractere especial"
 */
export function validatePassword(password) {
  if (!password) return 'Senha é obrigatória'

  const rules = []

  if (password.length < 8) {
    rules.push('pelo menos 8 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    rules.push('uma letra maiúscula')
  }

  if (!/[a-z]/.test(password)) {
    rules.push('uma letra minúscula')
  }

  if (!/\d/.test(password)) {
    rules.push('um número')
  }

  if (!/[!@#$%^&*(),.?"':{}|<>\[\]\\/`~\-_=+;]/.test(password)) {
    rules.push('um caractere especial')
  }

  if (/\s/.test(password)) {
    rules.push('sem espaços em branco')
  }

  if (rules.length === 0) {
    return true
  }

  return `A senha deve conter ${rules.join(', ')}`
}

/**
 * Valida se as senhas coincidem.
 * @param {string} password - A senha principal.
 * @param {string} confirmPassword - A confirmação da senha.
 * @returns {boolean|string} true se coincidem, string com erro caso contrário.
 * @example
 * validatePasswordConfirmation("123456", "123456"); // true
 * validatePasswordConfirmation("123456", "654321"); // "As senhas não coincidem"
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Confirmação de senha é obrigatória'
  }

  if (password !== confirmPassword) {
    return 'As senhas não coincidem'
  }

  return true
}

/**
 * Verifica a força da senha e retorna um score de 0 a 4.
 * @param {string} password - A senha a ser avaliada.
 * @returns {Object} Objeto com score (0-4) e descrição da força.
 * @example
 * getPasswordStrength("123"); // { score: 0, description: "Muito fraca" }
 * getPasswordStrength("MinhaSenh@123"); // { score: 4, description: "Muito forte" }
 */
export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, description: 'Muito fraca' }
  }

  let score = 0

  // Comprimento
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Caracteres
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*(),.?"':{}|<>\[\]\\/`~\-_=+;]/.test(password)) score++

  // Penalidades
  if (/\s/.test(password)) score--
  if (/(.)\1{2,}/.test(password)) score-- // Caracteres repetidos

  // Normalizar score
  score = Math.max(0, Math.min(4, score))

  const descriptions = {
    0: 'Muito fraca',
    1: 'Fraca',
    2: 'Regular',
    3: 'Forte',
    4: 'Muito forte'
  }

  return {
    score,
    description: descriptions[score]
  }
}
