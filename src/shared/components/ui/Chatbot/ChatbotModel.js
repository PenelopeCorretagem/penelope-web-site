export const chatbotModel = {
  initialMessage: {
    sender: 'bot',
    text: 'Olá, meu nome é Penélope, sou sua assistente virtual! Como posso te ajudar?',
  },

  responses: {
    inicio: {
      botResponse: 'Claro! Aqui estão as opções iniciais.',
      options: [
        'Falar sobre imóveis',
        'Falar sobre agendamento',
        'Falar sobre financiamento',
      ],
    },

    // ===== IMÓVEIS =====

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

    imoveisDisponiveis: {
      botResponse:
        'Atualmente temos apartamentos de 2 e 3 quartos, casas em condomínio fechado e studios no centro da cidade. Deseja mais detalhes?',
      options: [
        'Faixa de preço',
        'Localização',
        'Voltar para o inicio',
      ],
    },

    faixaPreco: {
      botResponse:
        'Nossos imóveis variam entre R$ 250.000 e R$ 1.200.000, dependendo do tamanho e localização. Deseja simular financiamento?',
      options: [
        'Simulação',
        'Voltar para o inicio',
      ],
    },

    localizacao: {
      botResponse:
        'Temos imóveis nas regiões Central, Zona Sul e Zona Norte. Você tem preferência por alguma área?',
      options: [
        'Imóveis disponíveis',
        'Voltar para o inicio',
      ],
    },

    // ===== AGENDAMENTO =====

    agendamento: {
      botResponse:
        'Perfeito! Você deseja agendar uma visita presencial ou online?',
      options: [
        'Visita presencial',
        'Visita online',
        'Voltar para o inicio',
      ],
    },

    visitaPresencial: {
      botResponse:
        'Ótimo! Nossa equipe entrará em contato para confirmar data e horário da visita presencial.',
      options: [
        'Voltar para o inicio',
      ],
    },

    visitaOnline: {
      botResponse:
        'Perfeito! Enviaremos um link para uma visita virtual guiada pelo corretor.',
      options: [
        'Voltar para o inicio',
      ],
    },

    // ===== FINANCIAMENTO =====

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

    simulacao: {
      botResponse:
        'Para simular, consideramos entrada mínima de 20% e parcelamento em até 360 meses. Deseja falar com um especialista?',
      options: [
        'Voltar para o inicio',
      ],
    },

    taxas: {
      botResponse:
        'As taxas variam entre 7% e 9% ao ano, dependendo da instituição financeira e análise de crédito.',
      options: [
        'Voltar para o inicio',
      ],
    },

    documentos: {
      botResponse:
        'Os documentos necessários são: RG, CPF, comprovante de renda, comprovante de residência e certidão de estado civil.',
      options: [
        'Voltar para o inicio',
      ],
    },

    // ===== FALHA =====

    falha: {
      botResponse:
        'Infelizmente eu não posso te ajudar com isso no momento.',
      options: [
        'Voltar para o inicio',
      ],
    },
  },

  stepMap: {
    // início
    'Falar sobre imóveis': 'imoveis',
    'Falar sobre agendamento': 'agendamento',
    'Falar sobre financiamento': 'financiamento',
    'Voltar para o inicio': 'inicio',

    // imóveis
    'Imóveis disponíveis': 'imoveisDisponiveis',
    'Faixa de preço': 'faixaPreco',
    'Localização': 'localizacao',

    // agendamento
    'Visita presencial': 'visitaPresencial',
    'Visita online': 'visitaOnline',

    // financiamento
    'Simulação': 'simulacao',
    'Taxas': 'taxas',
    'Documentos necessários': 'documentos',
  },

  getNextStep(userMessage) {
    return this.stepMap[userMessage] || 'falha'
  },
}
