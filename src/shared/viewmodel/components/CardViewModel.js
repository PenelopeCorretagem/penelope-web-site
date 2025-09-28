export class CardViewModel {
  constructor(model) {
    this.model = model
  }

  get categoryLabel() {
    return this.model.getCategoryLabel()
  }

  get button() {
    return this.model.getButton()
  }

  get formattedDifferences() {
    return this.model.getDifferenceLabels()
  }

  handleButtonClick() {
    const button = this.model.getButton()
    console.log('Button clicked:', button.text)
  }
}
