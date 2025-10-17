export class SelectFilterModel {
  constructor({ options = [], name = 'filtro', id = 'select_filter' }) {
    this.options = options
    this.name = name
    this.id = id
  }

  getFormattedOptions() {
    return this.options.map(option => ({
      label: option.toUpperCase(),
      value: option,
    }))
  }
}
