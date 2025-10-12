export class ImageModel {
  static MODES = {
    IMAGE: 'image',
    BACKGROUND: 'background'
  }

  static validateImageProps(src, alt) {
    const errors = []

    if (!alt || alt.trim() === '') {
      errors.push('Alt text é obrigatório para acessibilidade')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static getDefaultClasses(mode) {
    return mode === ImageModel.MODES.IMAGE
      ? 'max-h-72 min-w-lg'
      : ''
  }
}
