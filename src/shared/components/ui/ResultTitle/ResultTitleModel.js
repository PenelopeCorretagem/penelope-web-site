export class ResultTitleModel {
  constructor({ filters, results }) {
    this.filters = filters
    this.results = results
  }

  getTitle() {
    const { city, bedrooms, type } = this.filters
    const count = this.results?.length || 0

    const cityText = city || 'alguma cidade'
    const bedroomText = bedrooms || 'qualquer número de dormitórios'
    const typeText = type || 'imóveis'

    return `${count} ${typeText.toUpperCase()} EM ${cityText.toUpperCase()} COM ${bedroomText.toUpperCase()}`
  }
}
