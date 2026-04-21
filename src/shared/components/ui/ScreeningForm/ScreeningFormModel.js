// ScreeningFormModel.js

export const ScreeningFormModel = {
  fields: [
    { name: 'nome', placeholder: 'NOME:', type: 'text', hasLabel: true, required: true, column: 1 },
    { name: 'cpf', placeholder: 'CPF:', type: 'text', hasLabel: true, required: true, column: 1 },
    { name: 'celular', placeholder: 'CELULAR:', type: 'tel', hasLabel: true, column: 1 },

    { name: 'sobrenome', placeholder: 'SOBRENOME:', type: 'text', hasLabel: true, required: true, column: 2 },
    { name: 'email', placeholder: 'E-MAIL', type: 'email', hasLabel: true, required: true, column: 2 },
    { name: 'rendaMed', placeholder: 'RENDA MÉDIA MENSAL:', type: 'renda', hasLabel: true, column: 2 },
    {
      name: 'lgpdConsent',
      type: 'checkbox',
      hasLabel: false,
      required: true,
      column: 3,
      label: 'Aceito os termos da Lei Geral de Proteção de Dados (LGPD) e autorizo o uso das minhas informações pessoais para os fins descritos.',
      link: { text: 'Saiba mais sobre LGPD', url: 'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd' },
      helperText: 'ℹ️ Os dados preenchidos neste formulário não serão salvos, seu uso é exclusivamente para facilitar a comunicação entre você e nosso especialista.'
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
