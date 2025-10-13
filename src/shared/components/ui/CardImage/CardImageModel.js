export class CardImageModel {
  static POSITIONS = {
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right'
  }

  static getPositionClasses(position) {
    switch (position) {
      case CardImageModel.POSITIONS.BOTTOM_LEFT:
        return '-translate-x-8 translate-y-8'
      case CardImageModel.POSITIONS.BOTTOM_RIGHT:
        return 'translate-x-8 translate-y-8'
      case CardImageModel.POSITIONS.TOP_LEFT:
        return '-translate-x-8 -translate-y-8'
      case CardImageModel.POSITIONS.TOP_RIGHT:
        return 'translate-x-8 -translate-y-8'
      default:
        return 'translate-x-8 translate-y-8'
    }
  }

  static getPaddingClasses(position) {
    switch (position) {
      case CardImageModel.POSITIONS.BOTTOM_LEFT:
        return 'pl-8 pb-8'
      case CardImageModel.POSITIONS.BOTTOM_RIGHT:
        return 'pr-8 pb-8'
      case CardImageModel.POSITIONS.TOP_LEFT:
        return 'pl-8 pt-8'
      case CardImageModel.POSITIONS.TOP_RIGHT:
        return 'pr-8 pt-8'
      default:
        return 'pr-8 pb-8'
    }
  }

  static validateCardImageProps(src, alt) {
    const errors = []

    if (!src || src.trim() === '') {
      errors.push('Src da imagem é obrigatório')
    }

    if (!alt || alt.trim() === '') {
      errors.push('Alt text é obrigatório para acessibilidade')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
