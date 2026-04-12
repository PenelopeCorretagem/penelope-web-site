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
        'Claro! Sobre imóveis, posso te ajudar com: imóveis disponíveis ou localização. O que você deseja saber?',
      options: [
        'Imóveis disponíveis',
        'Localização',
        'Voltar para o inicio',
      ],
    },

    imoveisDisponiveis: {
      botResponse:
        'Atualmente trabalhamos com Studios e apartamentos de 1 a 3 dormitórios. Deseja mais detalhes?',
      options: [
        'Ver Imóveis',
        'Localização',
        'Voltar para o inicio',
      ],
    },

    verImoveis: {
      botResponse:
        'Nossos imóveis variam entre R$ 250.000 e R$ 1.200.000, dependendo do tamanho e localização. Deseja simular financiamento?',
      options: [
        'Simulação',
        'Voltar para o inicio',
      ],
    },

    localizacao: {
      botResponse:
        'Temos imóveis nas regiões Central, Zona Sul, Norte, Leste e Oeste. Veja nossos imóveis disponíveis!',
      options: [
        'Imóveis disponíveis',
        'Voltar para o inicio',
      ],
    },

    // ===== AGENDAMENTO =====

    agendamento: {
      botResponse:
        'Perfeito! Trabalhamos com Visitas Presenciais aos nossos Stands, e visitas totalmente Online. Deseja agendar uma visita?',
      options: [
        'Agendar agora!',
        'Voltar para o inicio',
      ],
    },

    agendamentoLoginNecessario: {
      botResponse:
        'Para agendar uma visita, você precisa realizar o Cadastro. Faça login para continuar.',
      options: [
        'Ir para a tela de login',
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
        'Falar com corretor',
        'Voltar para o inicio',
      ],
    },

    taxas: {
      botResponse:
        'As taxas variam entre 7% e 9% ao ano, dependendo da instituição financeira e análise de crédito. Fale com um de nossos corretores!',
      options: [
        'Falar com corretor',
        'Voltar para o inicio',
      ],
    },

    documentos: {
      botResponse:
        'Os documentos necessários são: RG, CPF, comprovante de renda, comprovante de residência e certidão de estado civil.',
      options: [
        'Falar com corretor',
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
    'Ver Imóveis': 'verImoveis',
    'Localização': 'localizacao',

    // agendamento
    'Agendar agora!': 'agendamento',

    // login
    'Ir para a tela de login': 'agendamentoLoginNecessario',

    // financiamento
    'Simulação': 'simulacao',
    'Taxas': 'taxas',
    'Documentos necessários': 'documentos',

  },

  getNextStep(userMessage) {
    return this.stepMap[userMessage] || 'falha'
  },
}
