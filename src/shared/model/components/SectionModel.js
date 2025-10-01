import { ESectionBackgroundColor } from '@shared/Enum/components/ESectionBackgroundColor'

export class SectionModel {
  constructor({
    children,
    backgroundColor = ESectionBackgroundColor.WHITE,
    paddingClasses = 'p-section md:p-section-md',
    gapClasses = 'gap-section md:gap-section-md',
    className = '',
  } = {}) {
    this.children = children
    this.backgroundColor = backgroundColor
    this.paddingClasses = paddingClasses
    this.gapClasses = gapClasses
    this.className = className
  }

  static VALID_BACKGROUND_COLORS = Object.values(ESectionBackgroundColor)

  isValidBackgroundColor(backgroundColor) {
    const backGroundColorValue = String(backgroundColor).trim()
    return SectionModel.VALID_BACKGROUND_COLORS.includes(backGroundColorValue)
  }

  validateBackgroundColor(backgroundColor = this.backgroundColor) {
    if (!this.isValidBackgroundColor(backgroundColor)) {
      throw new Error(`Cor de fundo inválida: ${backgroundColor}. Cores válidas: ${SectionModel.VALID_BACKGROUND_COLORS.join(', ')}`)
    }
    return backgroundColor
  }

  getSectionClasses() {
    return [
      'section',
      'w-full',
      'h-fit',
      this.gapClasses,
      this.paddingClasses,
      this.className,
    ].filter(Boolean).join(' ')
  }
}
