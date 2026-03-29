/**
 * Valida se uma string é um email válido.
 * @param {string} email - Email a ser validado.
 * @returns {boolean|string} true se válido, string com erro caso contrário.
 * @example
 * validateEmail("exemplo@email.com"); // true
 * validateEmail("email-invalido"); // "E-mail inválido"
 */
export function validateEmail(email) {
  if (!email) {
    return 'E-mail é obrigatório'
  }

  // Trim e lowercase para normalização
  const normalizedEmail = email.trim().toLowerCase()

  // Regex mais rigorosa para validação de email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(normalizedEmail)) {
    return 'E-mail inválido'
  }

  // Validações adicionais
  if (normalizedEmail.length > 254) {
    return 'E-mail muito longo'
  }

  const [localPart, domain] = normalizedEmail.split('@')

  if (localPart.length > 64) {
    return 'Parte local do e-mail muito longa'
  }

  if (domain.length > 253) {
    return 'Domínio do e-mail muito longo'
  }

  // Verificar se não começa ou termina com ponto
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'E-mail não pode começar ou terminar com ponto'
  }

  // Verificar pontos consecutivos
  if (localPart.includes('..') || domain.includes('..')) {
    return 'E-mail não pode ter pontos consecutivos'
  }

  return true
}

/**
 * Normaliza um email (trim, lowercase).
 * @param {string} email - Email a ser normalizado.
 * @returns {string} Email normalizado.
 * @example
 * normalizeEmail("  EXEMPLO@EMAIL.COM  "); // "exemplo@email.com"
 */
export function normalizeEmail(email) {
  if (!email) return ''
  return email.trim().toLowerCase()
}

/**
 * Verifica se um email pertence a um domínio específico.
 * @param {string} email - Email a ser verificado.
 * @param {string|string[]} domains - Domínio(s) permitido(s).
 * @returns {boolean} true se pertence ao domínio.
 * @example
 * isEmailFromDomain("user@gmail.com", "gmail.com"); // true
 * isEmailFromDomain("user@gmail.com", ["gmail.com", "yahoo.com"]); // true
 */
export function isEmailFromDomain(email, domains) {
  if (!email || !domains) return false

  const normalizedEmail = normalizeEmail(email)
  const emailDomain = normalizedEmail.split('@')[1]

  if (Array.isArray(domains)) {
    return domains.some(domain => emailDomain === domain.toLowerCase())
  }

  return emailDomain === domains.toLowerCase()
}
