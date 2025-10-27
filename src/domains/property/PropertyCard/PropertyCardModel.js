import { EPropertyCardCategory, PropertyCardCategoryConfig } from '@domains/property/PropertyCard/EPropertyCardCategory'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'

export class PropertyCardModel {
  constructor(category, title, subtitle, description, differences = []) {
    this.validateInputs(category, title, subtitle, description)

    this.category = this.normalizeCategory(category)
    this.title = String(title).trim()
    this.subtitle = String(subtitle).trim()
    this.description = String(description).trim()
    this.differences = this.validateDifferences(differences)

    this._categoryLabel = null
    this._button = null
    this._differenceLabels = null
  }

  validateInputs(category, title, subtitle, description) {
    if (!category) throw new Error('Category é obrigatório')
    if (!title) throw new Error('Title é obrigatório')
    if (!subtitle) throw new Error('Subtitle é obrigatório')
    if (!description) throw new Error('Description é obrigatório')
  }

  normalizeCategory(category) {
    const normalizedCategory = String(category).toUpperCase().trim()

    if (!Object.values(EPropertyCardCategory).includes(normalizedCategory)) {
      throw new Error(`Categoria inválida: ${category}. Categorias válidas: ${Object.values(EPropertyCardCategory).join(', ')}`)
    }

    return normalizedCategory
  }

  validateDifferences(differences) {
    if (!Array.isArray(differences)) {
      throw new Error('Differences deve ser um array')
    }

    return differences
      .filter(diff => diff && String(diff).trim())
      .map(diff => String(diff).trim())
  }

  getCategoryConfig() {
    return PropertyCardCategoryConfig[this.category]
  }

  getCategoryLabel() {
    if (!this._categoryLabel) {
      const config = this.getCategoryConfig()
      this._categoryLabel = new LabelModel(config.label, config.variant, 'medium')
    }
    return this._categoryLabel
  }

  getButton() {
    if (!this._button) {
      this._button = new ButtonModel('SABER MAIS', 'pink', 'button')
    }
    return this._button
  }

  getDifferenceLabels() {
    if (!this._differenceLabels) {
      this._differenceLabels = this.differences.map(diff =>
        new LabelModel(diff, 'gray', 'small')
      )
    }
    return this._differenceLabels
  }


  get categoryPriority() {
    return this.getCategoryConfig().priority
  }

  get hasValidCategory() {
    return Object.values(EPropertyCardCategory).includes(this.category)
  }

  get hasDifferences() {
    return this.differences.length > 0
  }
}
