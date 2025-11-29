export const chatbotModel = {
  initialMessage: {
    sender: 'bot',
    text: 'Olá, meu nome é Penélope, sou sua assistente virtual! Como posso te ajudar?',
  },

  responses: {
    inicio: {
      options: [
        'Falar sobre imóveis',
        'Falar sobre agendamento',
        'Falar sobre financiamento',
      ],
      botResponse: 'Claro! Aqui estão as opções iniciais.',
    },

    imoveis: {
      botResponse:
        'Claro! Sobre imóveis, posso te ajudar com: imóveis disponíveis, valores ou localização. O que você deseja saber?',
      options: [
        'Imóveis disponíveis',
        'Faixa de preço',
        'Localização',
        'Voltar para o inicio',
      ],
    },

    agendamento: {
      botResponse:
        'Perfeito! Você deseja agendar uma visita presencial ou online?',
      options: ['Visita presencial', 'Visita online', 'Voltar para o inicio'],
    },

    financiamento: {
      botResponse:
        'Sobre financiamento, posso te ajudar com simulação, taxas e documentos necessários. Qual opção deseja?',
      options: [
        'Simulação',
        'Taxas',
        'Documentos necessários',
        'Voltar para o inicio',
      ],
    },
  },

  stepMap: {
    'Falar sobre imóveis': 'imoveis',
    'Falar sobre agendamento': 'agendamento',
    'Falar sobre financiamento': 'financiamento',
    'Voltar para o inicio': 'inicio',
  },
}
