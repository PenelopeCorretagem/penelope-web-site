export class ResultTitleModel {
  constructor({ filters, results }) {
    this.filters = filters
    this.results = results
  }

  getTitle() {
    const { city, bedrooms } = this.filters || {}
    // results may be a number (total) or an array; normalize to number
    const count = typeof this.results === 'number' ? this.results : (Array.isArray(this.results) ? this.results.length : 0)

    const cityText = city || 'todas as cidades'
    const bedroomText = bedrooms || 'qualquer número de dormitórios'
    const typeText = 'apartamentos encontrados'

    if (count === 0) {
      return `0 apartamentos encontrados`.trim()
    }

    return `${count} ${typeText.toUpperCase()}${city ? ` EM ${cityText.toUpperCase()}` : ''}${bedrooms ? ` COM ${bedroomText.toUpperCase()}` : ''}`
  }
}
