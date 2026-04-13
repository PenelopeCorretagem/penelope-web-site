import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@constant/routes'
import { chatbotModel } from './ChatbotModel'

export function useChatbotViewModel() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false)
  const [step, setStep] = useState('inicio')

  const [messages, setMessages] = useState([chatbotModel.initialMessage])

  function handleOpen() {
    setIsOpen(true)
  }

  function handleClose() {
    setIsOpen(false)
  }

  function handleOpenScreeningForm() {
    setIsTyping(false)
    setIsOpen(false)
    setIsScreeningFormOpen(true)
  }

  function handleCloseScreeningForm() {
    setIsScreeningFormOpen(false)
  }

  function handleOptionClick(option) {
    setMessages((prev) => [...prev, { sender: 'user', text: option }])

    const isAuthenticated = Boolean(sessionStorage.getItem('jwtToken') && sessionStorage.getItem('userId'))

    if (option === 'Ver Imóveis') {
      setIsOpen(false)
      navigate(ROUTES.PROPERTIES.path)
      return
    }

    if (option === 'Ir para a tela de login') {
      setIsOpen(false)
      navigate(ROUTES.LOGIN.path)
      return
    }

    if (option === 'Agendar agora!') {
      if (isAuthenticated) {
        setIsOpen(false)
        navigate(ROUTES.SCHEDULE.path)
        return
      }

      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: chatbotModel.responses.agendamentoLoginNecessario.botResponse
          }
        ])
        setStep('agendamentoLoginNecessario')
      }, 2000)

      return
    }

    if (option === 'Falar com corretor') {
      handleOpenScreeningForm()
      return
    }

    setIsTyping(true)

    const nextStep = chatbotModel.stepMap[option] || 'falha'

    const botText = chatbotModel.responses[nextStep].botResponse

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }])
      setStep(nextStep)
    }, 2000)
  }

  return {
    isOpen,
    isTyping,
    isScreeningFormOpen,
    messages,
    step,
    responses: chatbotModel.responses,
    handleOpen,
    handleClose,
    handleCloseScreeningForm,
    handleOptionClick,
  }
}
