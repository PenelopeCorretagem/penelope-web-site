/**
 * Valida um nome completo.
 * @param {string} name - Nome a validar.
 * @param {object} [options] - Opções de validação.
 * @param {number} [options.minLength=2] - Comprimento mínimo do nome.
 * @param {boolean} [options.requireSurname=true] - Exige nome e sobrenome.
 * @returns {boolean|string} true se válido ou mensagem de erro.
 */
export function validateName(name, options = {}) {
  const { minLength = 2, requireSurname = true } = options

  if (!name) {
    return 'Nome completo é obrigatório'
  }

  const safeName = String(name).trim()

  if (safeName.length < minLength) {
    return `Nome completo deve ter pelo menos ${minLength} caracteres`
  }

  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(safeName)) {
    return 'Nome deve conter apenas letras e espaços'
  }

  if (safeName.includes('  ')) {
    return 'Nome não pode conter espaços duplicados'
  }

  if (requireSurname) {
    const words = safeName.split(/\s+/)
    if (words.length < 2) {
      return 'Informe nome e sobrenome'
    }
  }

  return true
}
