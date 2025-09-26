/**
 * LogoModel - Gerencia configurações visuais do logotipo
 * Controla esquemas de cores e dimensionamento
 * Implementa validações e presets de tamanho
 */
export class LogoModel {
  constructor(colorScheme = 'primary', size = 100) {
    this.colorScheme = colorScheme
    this.size = size
  }

  static COLOR_SCHEMES = ['primary', 'surface', 'text', 'custom']
  static SIZES = {
    small: 40,
    medium: 100,
    large: 140,
    xlarge: 200,
  }

  isValid() {
    return this.isValidColorScheme() && this.isValidSize()
  }

  isValidColorScheme() {
    return LogoModel.COLOR_SCHEMES.includes(this.colorScheme)
  }

  isValidSize() {
    return typeof this.size === 'number' && this.size > 0
  }

  updateColorScheme(newColorScheme) {
    if (!LogoModel.COLOR_SCHEMES.includes(newColorScheme)) {
      throw new Error(
        `Invalid color scheme. Must be one of: ${LogoModel.COLOR_SCHEMES.join(', ')}`
      )
    }
    this.colorScheme = newColorScheme
  }

  updateSize(newSize) {
    if (typeof newSize !== 'number' || newSize <= 0) {
      throw new Error('Size must be a positive number')
    }
    this.size = newSize
  }

  // Método para obter tamanho predefinido
  setSizePreset(preset) {
    if (!LogoModel.SIZES[preset]) {
      throw new Error(
        `Invalid size preset. Must be one of: ${Object.keys(LogoModel.SIZES).join(', ')}`
      )
    }
    this.size = LogoModel.SIZES[preset]
  }
}
