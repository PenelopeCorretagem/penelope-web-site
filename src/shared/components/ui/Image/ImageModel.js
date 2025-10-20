export class ImageModel {
  static MODES = {
    IMAGE: 'image',
    BACKGROUND: 'background'
  }

  static determineMode(mode, className) {
    if (mode === 'auto') {
      return className.includes('bg-cover') || className.includes('flex-1')
        ? ImageModel.MODES.BACKGROUND
        : ImageModel.MODES.IMAGE
    }
    return mode
  }

  static hasValidSource(src) {
    return src != null && src !== ''
  }

  static hasValidDescription(description) {
    return description && description.trim() !== ''
  }
}
