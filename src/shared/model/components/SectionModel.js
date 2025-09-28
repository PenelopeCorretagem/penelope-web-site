export class SectionModel {
  static BACKGROUND_COLORS = [
    'white',
    'white-secondary',
    'pink',
    'pinkGradient',
  ]

  constructor({ backgroundColor = 'white' } = {}) {
    this.backgroundColor = backgroundColor
  }

  isValidBackgroundColor(backgroundColor) {
    const backGroundColorValue = String(backgroundColor).trim()
    return SectionModel.BACKGROUND_COLORS.includes(backGroundColorValue)
  }

  validateBackgroundColor(backgroundColor) {
    if (!this.isValidBackgroundColor(backgroundColor)) {
      throw new Error(`Categoria inválida: ${backgroundColor}`)
    }
    return backgroundColor
  }
}
