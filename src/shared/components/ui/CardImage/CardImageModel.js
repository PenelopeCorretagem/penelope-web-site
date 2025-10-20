export class CardImageModel {
  static POSITIONS = {
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right'
  }

  static hasValidDescription(description) {
    return description && description.trim() !== ''
  }
}
