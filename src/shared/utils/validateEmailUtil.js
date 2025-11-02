/**
 * Valida se uma string é um email válido.
 * @param {string} email - Email a ser validado.
 * @returns {boolean} true se válido, false caso contrário.
 * @example
 * validateEmail("exemplo@email.com"); // true
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
