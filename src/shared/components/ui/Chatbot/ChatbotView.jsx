import { useState } from 'react'
import { FaTimes, FaComments } from 'react-icons/fa'

export function ChatbotView() {
  const [isOpen, setIsOpen] = useState(false)

  // Lista de mensagens (chat)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá, meu nome é Penélope, sou sua assistente virtual! Como posso te ajudar?',
    },
  ])

  // Etapa atual da árvore de decisão
  const [step, setStep] = useState('inicio')

  // Respostas da árvore de decisão
  const responses = {
    inicio: {
      options: [
        'Falar sobre imóveis',
        'Falar sobre agendamento',
        'Falar sobre financiamento',
      ],
      botResponse: null, // já exibida no início
    },

    imoveis: {
      botResponse:
        'Claro! Sobre imóveis, posso te ajudar com: imóveis disponíveis, valores ou localização. O que você deseja saber?',
      options: ['Imóveis disponíveis', 'Faixa de preço', 'Localização'],
    },

    agendamento: {
      botResponse:
        'Perfeito! Você deseja agendar uma visita presencial ou online?',
      options: ['Visita presencial', 'Visita online'],
    },

    financiamento: {
      botResponse:
        'Sobre financiamento, posso te ajudar com simulação, taxas e documentos necessários. Qual opção deseja?',
      options: ['Simulação', 'Taxas', 'Documentos necessários'],
    },
  }

  function handleOptionClick(option) {
    // Adiciona mensagem do usuário no chat
    setMessages((prev) => [...prev, { sender: 'user', text: option }])

    // Mapeia opção → etapa correspondente
    const map = {
      'Falar sobre imóveis': 'imoveis',
      'Falar sobre agendamento': 'agendamento',
      'Falar sobre financiamento': 'financiamento',
    }

    const nextStep = map[option]

    if (nextStep) {
      const botText = responses[nextStep].botResponse

      // Adiciona resposta do bot
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }])

      // Atualiza etapa
      setStep(nextStep)
    }
  }

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[999999] bg-distac-primary rounded-full shadow-lg w-16 h-16 flex items-center justify-center hover:scale-105 transition cursor-pointer"
        >
          <FaComments className="text-white text-3xl" />
        </button>
      )}

      {/* JANELA DO CHAT */}
      {isOpen && (
      <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white shadow-xl rounded-xl z-[999999] overflow-hidden flex flex-col h-[500px]">
        {/* CABEÇALHO */}
        <div className="bg-distac-primary text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaComments className="text-3xl" />
            <div>
              <p className="font-bold">PENÉLOPE</p>
              <p className="text-sm opacity-90 -mt-1">Assistente virtual</p>
            </div>
          </div>

          <button onClick={() => setIsOpen(false)}>
            <FaTimes className="text-xl cursor-pointer" />
          </button>
        </div>

        {/* MENSAGENS */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 max-w-[80%] rounded-xl ${
                  m.sender === 'user'
                    ? 'bg-distac-primary text-white rounded-tr-none'
                    : 'bg-distac-primary/20 text-distac-secondary rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* OPÇÕES DINÂMICAS */}
          {responses[step]?.options && (
          <div className="flex flex-col gap-2 text-left">
            {responses[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className="text-distac-primary border border-distac-primary px-3 py-2 rounded-lg hover:bg-distac-primary hover:text-white transition w-fit cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
          )}
        </div>

        {/* RODAPÉ VAZIO */}
        <div className="bg-distac-primary text-white p-4"></div>
      </div>
      )}
    </>
  )
}
