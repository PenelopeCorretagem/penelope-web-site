import { validateEmail } from '@shared/utils/validateEmailUtil'
import { validatePassword } from '@shared/utils/validatePasswordUtil'
import { validateCPF } from '@shared/utils/validateCPFUtil'
import { formatPhoneNumber, cleanPhoneNumber } from '@shared/utils/formatPhoneNumberUtil'
import { formatCPF, cleanCPF } from '@shared/utils/formatCPFUtil'
import { formatCurrencyInput, formatCurrencyForDatabase, formatCurrencyForDisplay } from '@shared/utils/formatCurrencyUtil'

/**
 * UserConfigModel - Modelo de dados para configuração de usuários
 *
 * RESPONSABILIDADES:
 * - Validar dados do usuário
 * - Formatar dados para exibição
 * - Definir regras de validação
 * - Normalizar dados de entrada
 */
export class UserConfigModel {
  constructor(userData = {}) {
    this.name = userData.name || userData.nomeCompleto || ''
    this.email = userData.email || ''
    this.phone = userData.phone || ''
    this.creci = userData.creci || ''
    this.cpf = userData.cpf || ''
    this.dateBirth = userData.dateBirth || userData.dtNascimento || ''
    this.monthlyIncome = userData.monthlyIncome || userData.rendaMensal || ''
    this.accessLevel = userData.accessLevel || 'CLIENTE'
    this.senha = userData.senha || ''
  }

  /**
   * Define os campos do formulário baseado no modo e tipo de usuário
   */
  static getFormFields(isEditMode = false, userAccessLevel = 'CLIENTE') {
    const isAdmin = userAccessLevel === 'ADMINISTRADOR'

    const fields = [
      // LINHA 1: Nome (1/2 = 3 cols), Data (1/3 = 2 cols), CPF (1/6 = 1 col) = 6 cols total
      {
        name: 'name',
        label: 'Nome Completo',
        placeholder: 'Digite o nome completo',
        required: true,
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        validate: (value) => {
          if (!value || value.trim().length < 2) {
            return 'Nome completo deve ter pelo menos 2 caracteres'
          }
          if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
            return 'Nome deve conter apenas letras e espaços'
          }
          const nameParts = value.trim().split(/\s+/)
          if (nameParts.length < 2) {
            return 'Informe nome e sobrenome'
          }
          return true
        }
      },
      {
        name: 'dateBirth',
        label: 'Data de Nascimento',
        type: 'date',
        placeholder: 'DD/MM/AAAA',
        required: true,
        gridColumn: 'col-span-2', // 1/3 de 6 colunas
        validate: (value) => {
          if (!value) return 'Data de nascimento é obrigatória'

          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()

          if (age < 18) {
            return 'Deve ter pelo menos 18 anos'
          }

          if (age > 120) {
            return 'Data de nascimento inválida'
          }

          return true
        }
      },
      {
        name: 'cpf',
        label: 'CPF',
        placeholder: 'Digite o CPF',
        required: true,
        gridColumn: 'col-span-1', // 1/6 de 6 colunas
        formatOnChange: true,
        formatter: formatCPF,
        validate: (value) => {
          if (!value) return 'CPF é obrigatório'

          if (!validateCPF(value)) {
            return 'CPF inválido'
          }

          return true
        }
      },

      // LINHA 2: Telefone (1/2 = 3 cols), Renda (1/2 = 3 cols) = 6 cols total
      {
        name: 'phone',
        label: 'Telefone',
        placeholder: 'Digite o telefone com DDD',
        required: true,
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        formatOnChange: true,
        formatter: formatPhoneNumber,
        validate: (value) => {
          if (!value) return 'Telefone é obrigatório'

          const cleanPhone = cleanPhoneNumber(value)
          if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            return 'Telefone deve ter 10 ou 11 dígitos'
          }

          return true
        }
      },
      {
        name: 'monthlyIncome',
        label: 'Renda Média Mensal',
        type: 'text',
        placeholder: 'Ex: R$ 5.000,00',
        required: true,
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        formatOnChange: true,
        formatter: formatCurrencyInput,
        validate: (value) => {
          if (!value) return 'Renda mensal é obrigatória'

          const numericValue = formatCurrencyForDatabase(value)

          if (isNaN(numericValue) || numericValue <= 0) {
            return 'Renda deve ser um valor positivo'
          }

          if (numericValue > 1000000) {
            return 'Valor de renda muito alto'
          }

          return true
        }
      },

      // LINHA 3: Nível de Acesso (1/2 = 3 cols), CRECI (1/2 = 3 cols) = 6 cols total
      {
        name: 'accessLevel',
        label: 'Nível de Acesso',
        type: 'select',
        placeholder: 'Selecione o nível de acesso',
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        options: [
          { value: 'CLIENTE', label: 'Cliente' },
          { value: 'ADMINISTRADOR', label: 'Administrador' }
        ],
        required: true,
        validate: (value) => {
          if (!value) {
            return 'Nível de acesso é obrigatório'
          }
          if (!['CLIENTE', 'ADMINISTRADOR'].includes(value)) {
            return 'Nível de acesso inválido'
          }
          return true
        }
      },
      {
        name: 'creci',
        label: 'CRECI',
        placeholder: 'Digite o número do CRECI (opcional)',
        required: false,
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        conditional: {
          field: 'accessLevel',
          value: 'ADMINISTRADOR',
          clearOnHide: true // Limpa o valor quando o campo está oculto
        },
        validate: (value) => {
          if (value && value.trim().length > 0) {
            const cleanCreci = value.replace(/\D/g, '')
            if (cleanCreci.length < 4 || cleanCreci.length > 10) {
              return 'CRECI deve ter entre 4 e 10 dígitos'
            }
          }
          return true
        }
      },

      // LINHA 4: E-mail (1/2 = 3 cols), Senha/Placeholder (1/2 = 3 cols) = 6 cols total
      {
        name: 'email',
        label: 'E-mail',
        type: 'email',
        placeholder: 'Digite o e-mail',
        required: true,
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        validate: validateEmail
      }
    ]

    if (!isEditMode) {
      // Senha apenas no modo adição
      fields.push({
        name: 'senha',
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite a senha',
        required: true,
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        showPasswordToggle: true,
        validate: validatePassword
      })
    } else {
      // Campo de senha no modo edição (para alterar senha)
      fields.push({
        name: 'senha',
        label: 'Nova Senha',
        type: 'password',
        placeholder: 'Digite uma nova senha (deixe em branco para manter a atual)',
        required: false, // Não obrigatório no modo edição
        gridColumn: 'col-span-3', // 1/2 de 6 colunas
        showPasswordToggle: true,
        validate: (value) => {
          // Se não foi preenchida, não valida (campo opcional no edit)
          if (!value || value.trim().length === 0) {
            return true
          }

          // Se foi preenchida, usa validação completa de senha
          return validatePassword(value)
        }
      })
    }

    return fields
  }

  /**
   * Valida todos os dados do usuário
   */
  validate(isEditMode = false, userAccessLevel = 'CLIENTE') {
    const errors = {}
    const fields = UserConfigModel.getFormFields(isEditMode, userAccessLevel)

    fields.forEach(field => {
      if (field.validate) {
        const valueToValidate = this[field.name]
        const result = field.validate(valueToValidate)
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
   * Valida dados fornecidos externamente (usado no handleSubmit)
   */
  validateWithData(data, isEditMode = false, userAccessLevel = 'CLIENTE') {
    const errors = {}
    const fields = UserConfigModel.getFormFields(isEditMode, userAccessLevel)

    fields.forEach(field => {
      // Verificar se o campo deve ser validado com base em condições
      let shouldValidate = true
      if (field.conditional) {
        const dependentFieldValue = data[field.conditional.field]
        shouldValidate = dependentFieldValue === field.conditional.value
      }

      // Pular validação de campos ocultos
      if (!shouldValidate) {
        return
      }

      if (field.validate) {
        const valueToValidate = data[field.name]
        const result = field.validate(valueToValidate)
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
      name: this.name,
      email: this.email,
      phone: formatPhoneNumber(this.phone),
      creci: this.creci,
      cpf: formatCPF(this.cpf),
      dateBirth: this.dateBirth,
      monthlyIncome: formatCurrencyForDisplay(this.monthlyIncome),
      accessLevel: this.accessLevel
    }
  }

  /**
   * Converte dados para formato de API
   */
  toApiFormat() {
    const apiData = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      phone: cleanPhoneNumber(this.phone),
      cpf: cleanCPF(this.cpf),
      dateBirth: this.dateBirth,
      monthlyIncome: formatCurrencyForDatabase(this.monthlyIncome),
      accessLevel: this.accessLevel
    }

    // Incluir CRECI se disponível
    if (this.creci && this.creci.trim() !== '') {
      apiData.creci = this.creci.trim()
    }

    // Incluir senha se disponível (modo adição)
    if (this.senha && this.senha.trim() !== '') {
      apiData.senha = this.senha.trim()
    }

    return apiData
  }

  /**
   * Cria instância a partir dos dados da API
   */
  static fromApiData(apiData) {
    return new UserConfigModel({
      name: apiData.nomeCompleto || '',
      email: apiData.email || '',
      phone: apiData.phone || '',
      creci: apiData.creci || '',
      cpf: apiData.cpf || '',
      dateBirth: apiData.dtNascimento || '',
      monthlyIncome: apiData.rendaMensal?.toString() || '',
      accessLevel: apiData.accessLevel || 'CLIENTE'
    })
  }

  /**
   * Verifica se os dados estão completos
   */
  get isComplete() {
    return !!(
      this.name &&
      this.email &&
      this.phone &&
      this.cpf &&
      this.dateBirth &&
      this.monthlyIncome &&
      this.accessLevel
    )
  }

  /**
   * Verifica se é administrador
   */
  get isAdmin() {
    return this.accessLevel === 'ADMINISTRADOR'
  }

  /**
   * Verifica se tem CRECI
   */
  get hasCreci() {
    return !!(this.creci && this.creci.trim() !== '')
  }
}
