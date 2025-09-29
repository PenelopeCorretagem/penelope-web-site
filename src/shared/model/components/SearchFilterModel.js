export class SearchFilterModel {
  constructor() {
    this.cities = ['São Paulo', 'Campinas', 'Santos']
    this.regions = ['Região', 'Zona Sul', 'Zona Oeste', 'Centro']
    this.types = ['Apartamento', 'Casa', 'Studio']
    this.bedrooms = ['3 Dormitórios', '2 Dormitórios', '1 Dormitório']
  }

  getOptions() {
    return {
      cities: this.cities,
      regions: this.regions,
      types: this.types,
      bedrooms: this.bedrooms,
    }
  }
}
