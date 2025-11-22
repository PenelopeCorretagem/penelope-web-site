import { validateCPF } from '@shared/utils/validateCPFUtil'
import { formatPhoneNumber, cleanPhoneNumber } from '@shared/utils/formatPhoneNumberUtil'
import { formatCPF, cleanCPF } from '@shared/utils/formatCPFUtil'
import { formatCurrencyInput, formatCurrencyForDatabase, formatCurrencyForDisplay } from '@shared/utils/formatCurrencyUtil'

/**
 * ProfileModel - Modelo de dados para o perfil do usuário
 *
 * RESPONSABILIDADES:
 * - Validar dados do perfil
 * - Formatar dados para exibição
 * - Definir regras de validação
 * - Normalizar dados de entrada
 */
export class ProfileModel {
  constructor(userData = {}) {
    this.name = userData.name || userData.nomeCompleto || ''
    this.phone = userData.phone || ''
    this.creci = userData.creci || ''
    this.cpf = userData.cpf || ''
    this.dateBirth = userData.dateBirth || userData.dtNascimento || ''
    this.monthlyIncome = userData.monthlyIncome || userData.rendaMensal || ''
    this.accessLevel = userData.accessLevel || 'CLIENTE'
  }

  /**
   * Define os campos do formulário de perfil
   */
  static getFormFields(isEditingOwnProfile = true, currentUserIsAdmin = false) {
    // Se for usuário cliente (não admin), usar layout específico
    if (!currentUserIsAdmin) {
      return ProfileModel.getClientFormFields()
    }

    // Layout para administradores (layout original)
    return ProfileModel.getAdminFormFields()
  }

  /**
   * Layout específico para usuários CLIENTE
   */
  static getClientFormFields() {
    return [
      // LINHA 1 - Nome (1/2), Data de Nascimento (1/2)
      {
        name: 'name',
        label: 'Nome Completo',
        placeholder: 'Digite seu nome completo',
        required: true,
        gridColumn: 'col-span-3', // 3/6 = 1/2
        validate: (value) => {
          if (!value || value.trim().length < 3) {
            return 'Nome completo deve ter pelo menos 3 caracteres'
          }
          if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return 'Nome deve conter apenas letras'
          }
          const nameParts = value.trim().split(' ')
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
        gridColumn: 'col-span-3', // 3/6 = 1/2
        validate: (value) => {
          if (!value) return 'Data de nascimento é obrigatória'

          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()

          if (age < 18) {
            return 'Você deve ter pelo menos 18 anos'
          }

          if (age > 120) {
            return 'Data de nascimento inválida'
          }

          return true
        }
      },

      // LINHA 2 - Telefone (1/2), CPF (1/2)
      {
        name: 'phone',
        label: 'Telefone',
        placeholder: 'Digite seu número de telefone com DDD',
        required: true,
        gridColumn: 'col-span-3', // 3/6 = 1/2
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
        name: 'cpf',
        label: 'CPF',
        placeholder: 'Digite seu CPF',
        required: true,
        gridColumn: 'col-span-3', // 3/6 = 1/2
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

      // LINHA 3 - Renda (1/2), Nível de Acesso (1/2)
      {
        name: 'monthlyIncome',
        label: 'Renda Média Mensal',
        type: 'text',
        placeholder: 'Ex: R$ 5.000,00',
        required: true,
        gridColumn: 'col-span-3', // 3/6 = 1/2
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
      {
        name: 'accessLevel',
        label: 'Nível de Acesso',
        type: 'select',
        placeholder: 'Selecione o nível de acesso',
        gridColumn: 'col-span-3', // 3/6 = 1/2
        options: [
          { value: 'CLIENTE', label: 'Cliente' },
          { value: 'ADMINISTRADOR', label: 'Administrador' }
        ],
        required: true,
        disabled: true, // Sempre desabilitado
        hideInViewMode: false, // Sempre visível
        validate: (value) => {
          if (!value) {
            return 'Nível de acesso é obrigatório'
          }
          if (!['CLIENTE', 'ADMINISTRADOR'].includes(value)) {
            return 'Nível de acesso inválido'
          }
          return true
        }
      }
    ]
  }

  /**
   * Layout específico para usuários ADMINISTRADOR
   */
  static getAdminFormFields() {
    const fields = [
      // LINHA 1 - Nome (1/2), Data (1/3), CPF (1/6)
      {
        name: 'name',
        label: 'Nome Completo',
        placeholder: 'Digite seu nome completo',
        required: true,
        gridColumn: 'col-span-3', // 3/6 = 1/2
        validate: (value) => {
          if (!value || value.trim().length < 3) {
            return 'Nome completo deve ter pelo menos 3 caracteres'
          }
          if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return 'Nome deve conter apenas letras'
          }
          const nameParts = value.trim().split(' ')
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
        gridColumn: 'col-span-2', // 2/6 = 1/3
        validate: (value) => {
          if (!value) return 'Data de nascimento é obrigatória'

          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()

          if (age < 18) {
            return 'Você deve ter pelo menos 18 anos'
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
        placeholder: 'Digite seu CPF',
        required: true,
        gridColumn: 'col-span-1', // 1/6
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

      // LINHA 2 - Telefone (1/2), Renda (1/2)
      {
        name: 'phone',
        label: 'Telefone',
        placeholder: 'Digite seu número de telefone com DDD',
        required: true,
        gridColumn: 'col-span-3', // 3/6 = 1/2
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
        gridColumn: 'col-span-3', // 3/6 = 1/2
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

      // LINHA 3 - Nível de Acesso (1/2), CRECI (1/2)
      {
        name: 'accessLevel',
        label: 'Nível de Acesso',
        type: 'select',
        placeholder: 'Selecione o nível de acesso',
        gridColumn: 'col-span-3', // 3/6 = 1/2
        options: [
          { value: 'CLIENTE', label: 'Cliente' },
          { value: 'ADMINISTRADOR', label: 'Administrador' }
        ],
        required: true,
        disabled: true, // Sempre desabilitado
        hideInViewMode: false, // Sempre visível
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
        placeholder: 'Digite o número do CRECI',
        required: false,
        gridColumn: 'col-span-3', // 3/6 = 1/2
        validate: (value) => {
          if (value && value.trim().length > 0) {
            const cleanCreci = value.replace(/\D/g, '')
            if (cleanCreci.length < 4 || cleanCreci.length > 10) {
              return 'CRECI deve ter entre 4 e 10 dígitos'
            }
          }
          return true
        }
      }
    ]

    return fields
  }

  /**
   * Valida todos os dados do perfil
   */
  validate(isEditingOwnProfile = true, currentUserIsAdmin = false) {
    const errors = {}
    const fields = ProfileModel.getFormFields(isEditingOwnProfile, currentUserIsAdmin)

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
   * Converte dados para formato de exibição
   */
  toDisplayFormat() {
    return {
      name: this.name,
      phone: this.formatPhone(this.phone),
      creci: this.creci,
      cpf: this.formatCPF(this.cpf),
      dateBirth: this.dateBirth,
      monthlyIncome: formatCurrencyForDisplay(this.monthlyIncome),
      accessLevel: this.accessLevel
    }
  }

  /**
   * Converte dados para formato de API
   */
  toApiFormat() {
    return {
      name: this.name.trim(), // API usa 'name', não 'nomeCompleto'
      phone: cleanPhoneNumber(this.phone), // Remove formatação
      creci: this.creci?.trim() || '',
      cpf: cleanCPF(this.cpf), // Remove formatação
      dateBirth: this.dateBirth, // API usa 'dateBirth', não 'dtNascimento'
      monthlyIncome: formatCurrencyForDatabase(this.monthlyIncome), // API usa 'monthlyIncome', não 'rendaMensal'
      accessLevel: this.accessLevel
    }
  }

  /**
   * Cria instância a partir dos dados da API
   */
  static fromApiData(apiData) {
    return new ProfileModel({
      name: apiData.name || apiData.nomeCompleto || '', // Suporte para ambos os formatos
      phone: apiData.phone || '',
      creci: apiData.creci || '',
      cpf: apiData.cpf || '',
      dateBirth: apiData.dateBirth || apiData.dtNascimento || '', // Suporte para ambos os formatos
      monthlyIncome: apiData.monthlyIncome?.toString() || apiData.rendaMensal?.toString() || '', // Suporte para ambos os formatos
      accessLevel: apiData.accessLevel || 'CLIENTE'
    })
  }

  /**
   * Formata CPF para exibição (usando utility)
   */
  formatCPF(cpf) {
    return formatCPF(cpf)
  }

  /**
   * Formata telefone para exibição (usando utility)
   */
  formatPhone(phone) {
    return formatPhoneNumber(phone)
  }

  /**
   * Formata valor monetário (usando utility)
   */
  formatCurrency(value) {
    return formatCurrencyForDisplay(value)
  }

  /**
   * Validação de CPF (usando utility)
   */
  static isValidCPF(cpf) {
    return validateCPF(cpf)
  }

  /**
   * Verifica se o perfil está completo
   */
  get isComplete() {
    return !!(
      this.name &&
      this.phone &&
      this.cpf &&
      this.dateBirth &&
      this.monthlyIncome &&
      this.accessLevel
    )
  }

  /**
   * Calcula idade baseada na data de nascimento
   */
  get age() {
    if (!this.dateBirth) return null

    const birthDate = new Date(this.dateBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }
}
