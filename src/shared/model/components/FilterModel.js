// model/components/FilterModel.ts

export class FilterModel {
  constructor() {
    this.cities = ['SÃO PAULO', 'RIO DE JANEIRO', 'CURITIBA'];
    this.regions = ['Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste'];
    this.types = ['Apartamento', 'Casa', 'Studio'];
    this.bedroomOptions = [1, 2, 3, 4];
  }

  getCities() {
    return this.cities;
  }

  getRegions() {
    return this.regions;
  }

  getTypes() {
    return this.types;
  }

  getBedroomOptions() {
    return this.bedroomOptions;
  }
}
