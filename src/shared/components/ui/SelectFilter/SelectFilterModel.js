export class SelectFilterModel {
  constructor({ options = [], name = 'filtro', id = 'select_filter' }) {
    this.options = options
    this.name = name
    this.id = id
  }

  getFormattedOptions() {
    return this.options.map(option => {
      if (option && typeof option === 'object' && ('value' in option)) {
        return {
          label: option.label,
          value: option.value,
        }
      }

      return {
        label: String(option).toUpperCase(),
        value: option,
      }
    })
  }
}
