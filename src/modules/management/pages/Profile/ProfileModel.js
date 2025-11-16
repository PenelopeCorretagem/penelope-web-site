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
    this.fullName = userData.fullName || userData.nomeCompleto || ''
    this.cpf = userData.cpf || ''
    this.birthDate = userData.birthDate || userData.dtNascimento || ''
    this.monthlyIncome = userData.monthlyIncome || userData.rendaMensal || ''
    this.phone = userData.phone || ''
    this.accessLevel = userData.accessLevel || 'CLIENTE'
  }

  /**
   * Define os campos do formulário de perfil
   */
  static getFormFields(isEditingOwnProfile = true, currentUserIsAdmin = false) {
    const fields = [
      {
        name: 'fullName',
        label: 'Nome Completo',
        placeholder: 'Digite seu nome completo',
        required: true,
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
        name: 'cpf',
        label: 'CPF',
        placeholder: 'Digite seu CPF (somente números)',
        required: true,
        validate: (value) => {
          if (!value) return 'CPF é obrigatório'

          // Remove caracteres não numéricos
          const cleanCpf = value.replace(/\D/g, '')

          if (cleanCpf.length !== 11) {
            return 'CPF deve ter 11 dígitos'
          }

          // Validação básica de CPF
          if (ProfileModel.isValidCPF(cleanCpf)) {
            return true
          }

          return 'CPF inválido'
        }
      },
      {
        name: 'birthDate',
        label: 'Data de Nascimento',
        type: 'date',
        placeholder: 'DD/MM/AAAA',
        required: true,
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
        name: 'monthlyIncome',
        label: 'Renda Média Mensal',
        type: 'number',
        placeholder: 'Informe sua renda mensal aproximada',
        required: true,
        validate: (value) => {
          if (!value) return 'Renda mensal é obrigatória'

          const income = parseFloat(value)
          if (isNaN(income) || income <= 0) {
            return 'Renda deve ser um valor positivo'
          }

          if (income > 1000000) {
            return 'Valor de renda muito alto'
          }

          return true
        }
      },
      {
        name: 'phone',
        label: 'Celular',
        placeholder: 'Digite seu número de celular com DDD',
        required: true,
        validate: (value) => {
          if (!value) return 'Telefone é obrigatório'

          // Remove caracteres não numéricos
          const cleanPhone = value.replace(/\D/g, '')

          if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            return 'Telefone deve ter 10 ou 11 dígitos'
          }

          return true
        }
      }
    ]

    // Adicionar campo de nível de acesso como checkboxes mutuamente exclusivos
    if (currentUserIsAdmin || isEditingOwnProfile) {
      fields.push({
        name: 'accessLevel',
        label: 'Nível de Acesso',
        type: 'checkbox-group',
        layout: 'horizontal', // Para exibir lado a lado
        options: [
          {
            value: 'CLIENTE',
            label: 'Cliente',
            checked: false
          },
          {
            value: 'ADMINISTRADOR',
            label: 'Administrador',
            checked: false
          }
        ],
        mutuallyExclusive: true, // Apenas uma opção pode ser selecionada
        required: true,
        disabled: isEditingOwnProfile && !currentUserIsAdmin, // Desabilita se editando próprio perfil e não é admin
        validate: (value) => {
          // Value será um array com os valores selecionados
          if (!value || value.length === 0) {
            return 'Selecione um nível de acesso'
          }
          if (value.length > 1) {
            return 'Selecione apenas um nível de acesso'
          }
          if (!['CLIENTE', 'ADMINISTRADOR'].includes(value[0])) {
            return 'Nível de acesso inválido'
          }
          return true
        },
        // Função para processar o valor inicial
        getInitialValue: (currentAccessLevel) => {
          return currentAccessLevel === 'ADMINISTRADOR' ? ['ADMINISTRADOR'] : ['CLIENTE']
        },
        // Função para processar o valor antes de salvar
        processValue: (selectedArray) => {
          return selectedArray && selectedArray.length > 0 ? selectedArray[0] : 'CLIENTE'
        }
      })
    }

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
        let valueToValidate = this[field.name]

        // Para o campo accessLevel checkbox-group, converter para array
        if (field.name === 'accessLevel' && field.type === 'checkbox-group') {
          valueToValidate = [this.accessLevel]
        }

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
      fullName: this.fullName,
      cpf: this.formatCPF(this.cpf),
      birthDate: this.birthDate,
      monthlyIncome: this.formatCurrency(this.monthlyIncome),
      phone: this.formatPhone(this.phone),
      accessLevel: this.accessLevel
    }
  }

  /**
   * Converte dados para formato de API
   */
  toApiFormat() {
    return {
      nomeCompleto: this.fullName.trim(),
      cpf: this.cpf.replace(/\D/g, ''), // Remove formatação
      dtNascimento: this.birthDate,
      rendaMensal: parseFloat(this.monthlyIncome),
      phone: this.phone.replace(/\D/g, ''), // Remove formatação
      accessLevel: this.accessLevel
    }
  }

  /**
   * Cria instância a partir dos dados da API
   */
  static fromApiData(apiData) {
    return new ProfileModel({
      fullName: apiData.nomeCompleto || '',
      cpf: apiData.cpf || '',
      birthDate: apiData.dtNascimento || '',
      monthlyIncome: apiData.rendaMensal?.toString() || '',
      phone: apiData.phone || '',
      accessLevel: apiData.accessLevel || 'CLIENTE'
    })
  }

  /**
   * Formata CPF para exibição
   */
  formatCPF(cpf) {
    if (!cpf) return ''
    const cleanCpf = cpf.replace(/\D/g, '')
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Formata telefone para exibição
   */
  formatPhone(phone) {
    if (!phone) return ''
    const cleanPhone = phone.replace(/\D/g, '')

    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return phone
  }

  /**
   * Formata valor monetário
   */
  formatCurrency(value) {
    if (!value) return ''
    const numValue = parseFloat(value)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  /**
   * Validação de CPF
   */
  static isValidCPF(cpf) {
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false

    // Calcula os dígitos verificadores
    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.substring(10, 11))) return false

    return true
  }

  /**
   * Verifica se o perfil está completo
   */
  get isComplete() {
    return !!(
      this.fullName &&
      this.cpf &&
      this.birthDate &&
      this.monthlyIncome &&
      this.phone &&
      this.accessLevel
    )
  }

  /**
   * Calcula idade baseada na data de nascimento
   */
  get age() {
    if (!this.birthDate) return null

    const birthDate = new Date(this.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }
}
