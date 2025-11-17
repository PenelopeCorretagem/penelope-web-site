export class Address {
  constructor({
    id,
    street,
    number,
    neighborhood,
    city,
    uf,
    region,
    zipCode,
    complement,
  }) {
    this.id = id
    this.street = street
    this.number = number
    this.neighborhood = neighborhood
    this.city = city
    this.uf = uf
    this.region = region
    this.zipCode = zipCode
    this.complement = complement
  }

  getFullAddress() {
    return `${this.street}, ${this.number}${this.complement ? ', ' + this.complement : ''}, ${this.neighborhood}, ${this.city} - ${this.uf}`
  }
}
