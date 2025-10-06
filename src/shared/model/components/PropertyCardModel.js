import { ECategoryCard } from '@shared/Enum/components/ECategorycard'
import { LabelModel } from '@shared/model/components/LabelModel'
import { ButtonModel } from '@shared/model/components/ButtonModel'

export class PropertyCardModel {
  constructor(category, title, subtitle, description, differences = []) {
    this.category = this.ensureCategory(category)
    this.title = title
    this.subtitle = subtitle
    this.description = description
    this.differences = differences
    this.categoryCardLabel = this.createCategoryCardLabel(category)
    this.button = new ButtonModel('saber mais', 'pink', 'button')
    this.differenceLabels = this.createDifferenceLabels(differences)
  }

  createCategoryCardLabel(category) {
    const color = this.getCategoryCardColor(category)
    return new LabelModel(category, color, 'medium')
  }

  createDifferenceLabels(differences) {
    return differences.map(diff => new LabelModel(diff, 'gray', 'small'))
  }

  getCategoryCardColor() {
    const colors = {
      [ECategoryCard.LANCAMENTO]: 'pink',
      [ECategoryCard.DISPONIVEL]: 'brown',
      [ECategoryCard.EM_OBRAS]: 'softBrown',
    }
    return colors[this.category]
  }

  ensureCategory(category) {
    const categoryValue = String(category).trim()

    if (!Object.values(ECategoryCard).includes(categoryValue)) {
      throw new Error(`Categoria inválida: ${category}`)
    }

    return categoryValue
  }

  getButton() {
    return this.button
  }

  getCategoryLabel() {
    return this.categoryCardLabel
  }

  getDifferenceLabels() {
    return this.differenceLabels
  }
}
