/**
 * Gera um slug (URL amigável) a partir de um texto.
 * @param {string} text - Texto a ser transformado em slug.
 * @returns {string} Texto formatado como slug.
 * @example
 * generateSlug("Apartamento Luxo na Vila Mariana");
 * // "apartamento-luxo-na-vila-mariana"
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}
