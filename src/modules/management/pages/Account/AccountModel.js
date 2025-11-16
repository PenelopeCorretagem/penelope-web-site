/**
 * AccountModel - Modelo de dados para a conta do usuário
 *
 * RESPONSABILIDADES:
 * - Validar dados de conta (email, senhas)
 * - Formatar dados para exibição
 * - Definir regras de validação
 * - Normalizar dados de entrada
 */
export class AccountModel {
  constructor(accountData = {}) {
    this.email = accountData.email || ''
    // Senhas NUNCA são preenchidas automaticamente por segurança
    this.currentPassword = ''
    this.newPassword = ''
  }

  /**
   * Define os campos do formulário de conta
   */
  static getFormFields() {
    return [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Digite seu endereço de e-mail',
        required: true,
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Email é obrigatório'
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            return 'Email inválido'
          }
          return true
        }
      },
      {
        name: 'newPassword',
        type: 'password',
        label: 'Nova Senha',
        placeholder: 'Crie uma nova senha (deixe em branco para manter a atual)',
        required: false,
        showPasswordToggle: true,
        validate: (value) => {
          if (value && value.trim().length > 0) {
            if (value.length < 6) {
              return 'Nova senha deve ter pelo menos 6 caracteres'
            }
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
              return 'Nova senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número'
            }
          }
          return true
        }
      },
      {
        name: 'currentPassword',
        type: 'password',
        label: 'Senha Atual',
        placeholder: 'Digite sua senha atual para confirmar alterações',
        required: true,
        showPasswordToggle: true,
        hideInViewMode: true, // Campo só aparece no modo edição
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Senha atual é obrigatória para confirmar alterações'
          }
          if (value.length < 6) {
            return 'Senha deve ter pelo menos 6 caracteres'
          }
          return true
        }
      }
    ]
  }

  /**
   * Valida todos os dados da conta
   */
  validate() {
    const errors = {}
    const fields = AccountModel.getFormFields()

    fields.forEach(field => {
      if (field.validate) {
        const result = field.validate(this[field.name])
        if (result !== true) {
          errors[field.name] = result
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Converte dados para formato de exibição
   */
  toDisplayFormat() {
    return {
      email: this.email,
      // Senhas nunca são exibidas em view mode por segurança
      newPassword: '',
      currentPassword: ''
    }
  }

  /**
   * Converte dados para formato de API
   */
  toApiFormat() {
    const apiData = {
      email: this.email.trim()
    }

    // Só inclui a nova senha se foi fornecida
    if (this.newPassword && this.newPassword.trim() !== '') {
      apiData.senha = this.newPassword.trim()
    }

    return apiData
  }

  /**
   * Cria instância a partir dos dados da API
   * IMPORTANTE: Senhas nunca são preenchidas por segurança
   */
  static fromApiData(apiData) {
    return new AccountModel({
      email: apiData.email || '',
      // Senhas sempre vazias por segurança
      currentPassword: '',
      newPassword: ''
    })
  }

  /**
   * Verifica se a conta está completa
   */
  get isComplete() {
    return !!(this.email && this.currentPassword)
  }

  /**
   * Verifica se há uma nova senha para alterar
   */
  get hasNewPassword() {
    return !!(this.newPassword && this.newPassword.trim() !== '')
  }

  /**
   * Limpa senhas após operação
   */
  clearPasswords() {
    this.currentPassword = ''
    this.newPassword = ''
    return true
  }
}
