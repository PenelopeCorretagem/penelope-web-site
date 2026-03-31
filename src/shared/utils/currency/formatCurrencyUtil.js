/**
 * Formata um valor numérico para moeda brasileira (Real).
 * @param {number|string} value - O valor a ser formatado.
 * @returns {string} Valor formatado como R$ X.XXX,XX
 * @example
 * formatCurrency(1234.56); // "R$ 1.234,56"
 * formatCurrency("1234.56"); // "R$ 1.234,56"
 */
export function formatCurrency(value) {
  if (!value) return ''

  // Remove tudo exceto números
  const numbers = value.toString().replace(/\D/g, '')

  // Se não tem números, retorna vazio
  if (numbers === '') return ''

  // Converte para número (em centavos)
  const amount = parseInt(numbers, 10)

  // Formata como moeda brasileira (divide por 100 para ter centavos)
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount / 100)

  return formatted
}

/**
 * Formata valor de entrada de moeda com comportamento inteligente.
 * @param {string} value - Valor atual no input
 * @param {string} previousValue - Valor anterior (para detectar backspace)
 * @returns {string} Valor formatado
 */
export function formatCurrencyInput(value, previousValue = '') {
  if (!value) return ''

  // Se o usuário está apagando (valor atual menor que anterior)
  const isDeleting = value.length < previousValue.length

  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '')

  if (numbers === '') return ''

  // Se está apagando e tem só 1 ou 2 dígitos, formata como centavos
  if (isDeleting && numbers.length <= 2) {
    const amount = parseInt(numbers, 10)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount / 100)
  }

  // Formatação normal
  const amount = parseInt(numbers, 10)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount / 100)
}

/**
 * Remove a formatação de moeda e retorna um número.
 * @param {string} currencyString - String formatada como moeda (R$ 1.234,56).
 * @returns {number} Valor numérico sem formatação.
 * @example
 * parseCurrency("R$ 1.234,56"); // 1234.56
 * parseCurrency("1.234,56"); // 1234.56
 */
export function parseCurrency(currencyString) {
  if (!currencyString || currencyString === '') return 0

  // Remove R$, espaços e pontos (separadores de milhares)
  // Substitui vírgula por ponto (separador decimal)
  const cleanValue = currencyString
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim()

  return parseFloat(cleanValue) || 0
}

/**
 * Formata um valor para ser enviado ao banco de dados.
 * @param {string|number} value - Valor a ser formatado.
 * @returns {number} Valor numérico para o banco.
 * @example
 * formatCurrencyForDatabase("R$ 1.234,56"); // 1234.56
 * formatCurrencyForDatabase("1234,56"); // 1234.56
 */
export function formatCurrencyForDatabase(value) {
  return parseCurrency(value.toString())
}

/**
 * Formata um valor do banco para exibição.
 * @param {number} value - Valor numérico do banco.
 * @returns {string} Valor formatado para exibição.
 * @example
 * formatCurrencyForDisplay(1234.56); // "R$ 1.234,56"
 */
export function formatCurrencyForDisplay(value) {
  if (!value || value === 0) return 'R$ 0,00'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(value))
}
