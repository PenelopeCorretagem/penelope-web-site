/**
 * EditFormModel - Modelo de dados para formulários de edição/exclusão
 */
export class EditFormModel {
  constructor({
    title = '',
    fields = [],
    initialData = {},
    onSubmit = null,
    onDelete = null,
    isEditing = false,
  } = {}) {
    this.title = title
    this.fields = fields
    this.initialData = initialData
    this.onSubmit = onSubmit
    this.onDelete = onDelete
    this.isEditingInitial = isEditing
    this.fieldValues = { ...initialData }
    this.errors = []
    this.successMessage = ''
    this.isLoading = false
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get hasSuccess() {
    return Boolean(this.successMessage)
  }

  get formData() {
    return { ...this.fieldValues }
  }

  updateFieldValue(fieldName, value) {
    this.fieldValues[fieldName] = value
    return true
  }

  setLoading(loading) {
    this.isLoading = loading
    return true
  }

  setErrors(errors) {
    this.errors = Array.isArray(errors) ? errors : [errors]
    return true
  }

  clearErrors() {
    this.errors = []
    return true
  }

  setSuccess(message) {
    this.successMessage = message
    return true
  }

  clearSuccess() {
    this.successMessage = ''
    return true
  }

  reset() {
    this.fieldValues = { ...this.initialData }
    this.clearErrors()
    this.clearSuccess()
    this.setLoading(false)
    return true
  }
}
