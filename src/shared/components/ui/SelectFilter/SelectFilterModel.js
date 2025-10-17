export class SelectFilterModel {
  constructor({ options = [], name = 'filtro', id = 'select_filter' }) {
    this.options = options
    this.name = name
    this.id = id
  }

  getFormattedOptions() {
    return this.options.map(option => {
      // If option is an object with label/value, respect it (don't uppercase label)
      if (option && typeof option === 'object' && ('value' in option)) {
        return {
          label: option.label,
          value: option.value,
        }
      }

      // otherwise it's a primitive/string
      return {
        label: String(option).toUpperCase(),
        value: option,
      }
    })
  }
}
