import { useState } from 'react'
import { FaTimes, FaComments } from 'react-icons/fa'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'

export function ChatbotView() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá, meu nome é Penélope, sou sua assistente virtual! Como posso te ajudar?',
    },
  ])

  const [step, setStep] = useState('inicio')

  const responses = {
    inicio: {
      options: [
        'Falar sobre imóveis',
        'Falar sobre agendamento',
        'Falar sobre financiamento',
      ],
      botResponse: 'Claro! Aqui estão as opções iniciais.'
    },

    imoveis: {
      botResponse:
        'Claro! Sobre imóveis, posso te ajudar com: imóveis disponíveis, valores ou localização. O que você deseja saber?',
      options: ['Imóveis disponíveis', 'Faixa de preço', 'Localização', 'Voltar para o inicio'],
    },

    agendamento: {
      botResponse:
        'Perfeito! Você deseja agendar uma visita presencial ou online?',
      options: ['Visita presencial', 'Visita online', 'Voltar para o inicio'],
    },

    financiamento: {
      botResponse:
        'Sobre financiamento, posso te ajudar com simulação, taxas e documentos necessários. Qual opção deseja?',
      options: ['Simulação', 'Taxas', 'Documentos necessários', 'Voltar para o inicio'],
    },
  }

  function handleOptionClick(option) {
    setMessages(prev => [...prev, { sender: 'user', text: option }])
    setIsTyping(true)

    const map = {
      'Falar sobre imóveis': 'imoveis',
      'Falar sobre agendamento': 'agendamento',
      'Falar sobre financiamento': 'financiamento',
      'Voltar para o inicio': 'inicio'
    }

    const nextStep = map[option]

    if (nextStep) {
      const botText = responses[nextStep].botResponse

      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, { sender: 'bot', text: botText }])
        setStep(nextStep)
      }, 2000)
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[999999] bg-distac-primary rounded-full shadow-lg w-16 h-16 flex items-center justify-center hover:scale-105 transition cursor-pointer"
        >
          <FaComments className="text-white text-3xl" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white shadow-xl rounded-2xl z-[999999] overflow-hidden flex flex-col h-[500px] animate-slideUp">

          {/* Header */}
          <div className="bg-distac-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaComments className="text-3xl" />
              <div>
                <TextView className="font-bold text-white pb-2">PENÉLOPE</TextView>
                <TextView className="text-sm opacity-90 -mt-1 text-white">Assistente virtual</TextView>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)}>
              <FaTimes className="text-xl cursor-pointer" />
            </button>
          </div>

          {/* ÁREA DAS MENSAGENS */}
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <TextView
                  className={`p-3 max-w-[80%] rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-distac-primary text-white rounded-tr-none'
                      : 'bg-distac-primary/20 text-distac-secondary rounded-tl-none'
                  }`}
                >
                  {m.text}
                </TextView>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <TextView className="p-3 bg-distac-primary/20 text-distac-secondary rounded-xl rounded-tl-none max-w-[80%] italic opacity-80">
                  ...
                </TextView>
              </div>
            )}

            {!isTyping && responses[step]?.options && (
              <div className="flex flex-col gap-2 text-left">
                {responses[step].options.map((opt, index) => (
                  <ButtonView
                    key={index}
                    color="secondary"
                    width="fit"
                    shape="rounded"
                    onClick={() => handleOptionClick(opt)}
                    className="!px-3 !py-2 !text-sm !justify-start"
                  >
                    {opt}
                  </ButtonView>
                ))}
              </div>
            )}
          </div>

          <div className="bg-distac-primary text-white p-4"></div>
        </div>
      )}
    </>
  )
}
