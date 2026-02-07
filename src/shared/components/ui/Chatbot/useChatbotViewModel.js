import { useState } from 'react'
import { chatbotModel } from './ChatbotModel'

export function useChatbotViewModel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [step, setStep] = useState('inicio')

  const [messages, setMessages] = useState([chatbotModel.initialMessage])

  function handleOpen() {
    setIsOpen(true)
  }

  function handleClose() {
    setIsOpen(false)
  }

  function handleOptionClick(option) {
    setMessages((prev) => [...prev, { sender: 'user', text: option }])
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
    messages,
    step,
    responses: chatbotModel.responses,
    handleOpen,
    handleClose,
    handleOptionClick,
  }
}
