// ScreeningFormModel.js

export const ScreeningFormModel = {
  fields: [
    { name: 'nome', placeholder: 'NOME:', type: 'text', hasLabel: true, required: true, column: 1 },
    { name: 'cpf', placeholder: 'CPF:', type: 'text', hasLabel: true, required: true, column: 1 },
    { name: 'celular', placeholder: 'CELULAR:', type: 'tel', hasLabel: true, column: 1 },

    { name: 'sobrenome', placeholder: 'SOBRENOME:', type: 'text', hasLabel: true, required: true, column: 2 },
    { name: 'email', placeholder: 'E-MAIL', type: 'email', hasLabel: true, required: true, column: 2 },
    { name: 'rendaMed', placeholder: 'RENDA MÉDIA MENSAL:', type: 'renda', hasLabel: true, column: 2 },
  ],

  defaultFormData: {
    nome: '',
    sobrenome: '',
    cpf: '',
    celular: '',
    email: '',
    rendaMed: ''
  }
}
