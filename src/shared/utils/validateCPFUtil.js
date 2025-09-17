/**
 * Valida se uma string é um CPF válido.
 * @param {string} cpf - O CPF a ser validado (com ou sem formatação).
 * @returns {boolean} true se válido, false caso contrário.
 * @example
 * validateCPF("123.456.789-09"); // true ou false
 */
export function validateCPF(cpf) {
  // Remove tudo que não é número
  cpf = cpf.replace(/[^\d]+/g, '')

  if (cpf.length !== 11) return false

  // Verifica se todos os números são iguais
  if (/^(.)\1+$/.test(cpf)) return false

  let soma = 0
  let resto

  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
  }

  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.substring(9, 10), 10)) return false

  // Validação do segundo dígito verificador
  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
  }

  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0

  return resto === parseInt(cpf.substring(10, 11), 10)
}
