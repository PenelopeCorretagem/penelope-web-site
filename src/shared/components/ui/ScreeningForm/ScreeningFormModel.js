// ScreeningFormModel.js
import { formatCPF, cleanCPF } from '@shared/utils/CPF/formatCPFUtil'
import { formatPhoneNumber, cleanPhoneNumber } from '@shared/utils/phone/formatPhoneNumberUtil'
import { formatCurrencyInput } from '@shared/utils/currency/formatCurrencyUtil'

const formatCpfMask = (value) => {
  const digits = cleanCPF(value).slice(0, 11)
  return formatCPF(digits)
}

const formatCelularMask = (value) => {
  const digits = cleanPhoneNumber(value).slice(0, 11)
  return formatPhoneNumber(digits)
}

export const ScreeningFormModel = {
  fields: [
    { name: 'nome', placeholder: 'NOME:', type: 'text', hasLabel: true, required: true, column: 1 },
    {
      name: 'cpf',
      placeholder: 'CPF:',
      type: 'text',
      hasLabel: true,
      required: true,
      column: 1,
      inputMode: 'numeric',
      maxLength: 14,
      formatOnChange: true,
      formatter: formatCpfMask
    },
    {
      name: 'celular',
      placeholder: 'CELULAR:',
      type: 'tel',
      hasLabel: true,
      column: 1,
      inputMode: 'numeric',
      maxLength: 15,
      formatOnChange: true,
      formatter: formatCelularMask
    },

    { name: 'sobrenome', placeholder: 'SOBRENOME:', type: 'text', hasLabel: true, required: true, column: 2 },
    { name: 'email', placeholder: 'E-MAIL', type: 'email', hasLabel: true, required: true, column: 2 },
    {
      name: 'rendaMed',
      placeholder: 'RENDA MÉDIA MENSAL:',
      type: 'text',
      hasLabel: true,
      column: 2,
      inputMode: 'numeric',
      formatOnChange: true,
      formatter: formatCurrencyInput
    },
    {
      name: 'lgpdConsent',
      type: 'checkbox',
      hasLabel: false,
      required: true,
      column: 3,
      checkboxCentered: true,
      label: 'Aceito os termos da Lei Geral de Proteção de Dados (LGPD) e autorizo o uso das minhas informações pessoais para os fins descritos.',
      link: { text: 'Saiba mais sobre LGPD', url: 'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd' },
      helperIcon: 'info',
      helperText: 'Os dados preenchidos neste formulário não serão salvos, seu uso é exclusivamente para facilitar a comunicação entre você e nosso especialista.'
    },
  ],

  defaultFormData: {
    nome: '',
    sobrenome: '',
    cpf: '',
    celular: '',
    email: '',
    rendaMed: '',
    lgpdConsent: false
  }
}
