export class ContactIconModel {
  static SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
  }

  static getSizeClasses(size) {
    switch (size) {
      case ContactIconModel.SIZES.SMALL:
        return 'p-2 text-[26px]'
      case ContactIconModel.SIZES.MEDIUM:
        return 'p-4 text-[38px]'
      case ContactIconModel.SIZES.LARGE:
        return 'p-6 text-[44px]'
      default:
        return 'p-4 text-[32px]'
    }
  }

  static validateContactIconProps(children, onClick, href) {
    const errors = []

    if (!children) {
      errors.push('Children (ícone) é obrigatório')
    }

    if (!onClick && !href) {
      errors.push('onClick ou href deve ser fornecido para navegação')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static getBaseClasses() {
    return 'bg-brand-pink h-fit w-fit rounded-full text-brand-white cursor-pointer transition-all duration-200 hover:bg-brand-soft-pink hover:scale-105'
  }
}
