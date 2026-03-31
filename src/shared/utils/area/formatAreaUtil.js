/**
 * Formata um valor de área em m² com vírgula decimal.
 * @param {string} value - O valor a ser formatado.
 * @returns {string} Valor formatado com vírgula decimal e m²
 * @example
 * formatArea("12345"); // "123,45 m²"
 * formatArea("1000"); // "10,00 m²"
 */
export function formatArea(value, previousValue = '') {
  if (!value) return ''

  // Se o usuário está tentando editar e há "m²" no valor, remove para processar
  let cleanValue = value
  if (cleanValue.includes('m²')) {
    cleanValue = cleanValue.replace(/\s*m²$/g, '').trim()
  }

  // Remove tudo exceto números
  const numbers = cleanValue.replace(/\D/g, '')

  // Se não tem números, retorna vazio
  if (numbers === '') return ''

  // Se o usuário está apagando (valor atual menor que anterior sem o m²)
  const isDeleting = cleanValue.length < (previousValue.replace(/\s*m²$/g, '').length)

  // Converte para número (em centésimos)
  const amount = parseInt(numbers, 10)

  // Se está apagando e tem só 1 ou 2 dígitos, formata como centésimos
  if (isDeleting && numbers.length <= 2) {
    const formatted = (amount / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return `${formatted} m²`
  }

  // Formatação normal - divide por 100 para ter casas decimais
  const formatted = (amount / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return `${formatted} m²`
}

/**
 * Remove a formatação de área e retorna um número.
 * @param {string} areaString - String formatada de área (123,45 m²).
 * @returns {number} Valor numérico sem formatação.
 * @example
 * parseArea("123,45 m²"); // 123.45
 * parseArea("1.234,56 m²"); // 1234.56
 */
export function parseArea(areaString) {
  if (!areaString || areaString === '') return 0

  // Remove m², espaços, pontos (separadores de milhares) e substitui vírgula por ponto
  const cleanValue = areaString
    .replace(/\s*m²$/g, '')
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
 * formatAreaForDatabase("123,45 m²"); // 123.45
 */
export function formatAreaForDatabase(value) {
  return parseArea(value.toString())
}

/**
 * Formata um valor do banco para exibição.
 * @param {number} value - Valor numérico do banco.
 * @returns {string} Valor formatado para exibição.
 * @example
 * formatAreaForDisplay(123.45); // "123,45 m²"
 */
export function formatAreaForDisplay(value) {
  if (!value || value === 0) return '0,00 m²'

  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return `${formatted} m²`
}
