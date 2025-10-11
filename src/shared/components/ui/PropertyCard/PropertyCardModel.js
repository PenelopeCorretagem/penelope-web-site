import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'

export class PropertyCardModel {
  constructor(category, title, subtitle, description, differences = []) {
    this.category = this.ensureCategory(category)
    this.title = title
    this.subtitle = subtitle
    this.description = description
    this.differences = differences
    this.categoryCardLabel = this.createPropertyCardLabel(category)
    this.button = new ButtonModel('saber mais', 'pink', 'button')
    this.differenceLabels = this.createDifferenceLabels(differences)
  }

  createPropertyCardLabel(category) {
    const color = this.getPropertyCardColor(category)
    return new LabelModel(category, color, 'medium')
  }

  createDifferenceLabels(differences) {
    return differences.map(diff => new LabelModel(diff, 'gray', 'small'))
  }

  getPropertyCardColor() {
    const colors = {
      [EPropertyCardCategory.LANCAMENTO]: 'pink',
      [EPropertyCardCategory.DISPONIVEL]: 'brown',
      [EPropertyCardCategory.EM_OBRAS]: 'softBrown',
    }
    return colors[this.category]
  }

  ensureCategory(category) {
    const categoryValue = String(category).trim()

    if (!Object.values(EPropertyCardCategory).includes(categoryValue)) {
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
