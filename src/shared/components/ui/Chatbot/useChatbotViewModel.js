import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@constant/routes'
import { chatbotModel } from './ChatbotModel'

const ICON_SIZE = 64
const ICON_MARGIN = 24
const CARD_WIDTH = 384
const CARD_HEIGHT = 500
const CARD_MARGIN = 24
const DRAG_THRESHOLD = 4

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function getDefaultFloatingPosition() {
  const { width, height } = getViewportSize()

  return {
    x: Math.max(ICON_MARGIN, width - ICON_SIZE - ICON_MARGIN),
    y: Math.max(ICON_MARGIN, height - ICON_SIZE - ICON_MARGIN),
  }
}

function getDefaultCardPosition() {
  const { width, height } = getViewportSize()

  return {
    x: Math.max(CARD_MARGIN, width - CARD_WIDTH - CARD_MARGIN),
    y: Math.max(CARD_MARGIN, height - CARD_HEIGHT - CARD_MARGIN),
  }
}

export function useChatbotViewModel() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false)
  const [step, setStep] = useState('inicio')
  const [iconPosition, setIconPosition] = useState(() => getDefaultFloatingPosition())
  const [cardPosition, setCardPosition] = useState(() => getDefaultCardPosition())
  const [dragTarget, setDragTarget] = useState(null)

  const [messages, setMessages] = useState([chatbotModel.initialMessage])
  const dragStateRef = useRef(null)
  const suppressNextClickRef = useRef(false)

  const syncPositionsWithViewport = useCallback(() => {
    const { width, height } = getViewportSize()

    setIconPosition((currentPosition) => ({
      x: clamp(currentPosition.x, ICON_MARGIN, Math.max(ICON_MARGIN, width - ICON_SIZE - ICON_MARGIN)),
      y: clamp(currentPosition.y, ICON_MARGIN, Math.max(ICON_MARGIN, height - ICON_SIZE - ICON_MARGIN)),
    }))

    setCardPosition((currentPosition) => ({
      x: clamp(currentPosition.x, CARD_MARGIN, Math.max(CARD_MARGIN, width - CARD_WIDTH - CARD_MARGIN)),
      y: clamp(currentPosition.y, CARD_MARGIN, Math.max(CARD_MARGIN, height - CARD_HEIGHT - CARD_MARGIN)),
    }))
  }, [])

  useEffect(() => {
    window.addEventListener('resize', syncPositionsWithViewport)

    return () => {
      window.removeEventListener('resize', syncPositionsWithViewport)
    }
  }, [syncPositionsWithViewport])

  const finishDrag = useCallback(() => {
    dragStateRef.current = null
    setDragTarget(null)
  }, [])

  const updateDragPosition = useCallback((event) => {
    const dragState = dragStateRef.current

    if (!dragState) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    if (!dragState.moved && (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)) {
      dragState.moved = true

      if (dragState.target === 'icon') {
        suppressNextClickRef.current = true
      }
    }

    const nextX = dragState.originX + deltaX
    const nextY = dragState.originY + deltaY
    const { width, height } = getViewportSize()

    if (dragState.target === 'icon') {
      setIconPosition({
        x: clamp(nextX, ICON_MARGIN, Math.max(ICON_MARGIN, width - ICON_SIZE - ICON_MARGIN)),
        y: clamp(nextY, ICON_MARGIN, Math.max(ICON_MARGIN, height - ICON_SIZE - ICON_MARGIN)),
      })
    }

    if (dragState.target === 'card') {
      setCardPosition({
        x: clamp(nextX, CARD_MARGIN, Math.max(CARD_MARGIN, width - CARD_WIDTH - CARD_MARGIN)),
        y: clamp(nextY, CARD_MARGIN, Math.max(CARD_MARGIN, height - CARD_HEIGHT - CARD_MARGIN)),
      })
    }
  }, [])

  useEffect(() => {
    if (!dragTarget) return undefined

    window.addEventListener('pointermove', updateDragPosition)
    window.addEventListener('pointerup', finishDrag)
    window.addEventListener('pointercancel', finishDrag)

    return () => {
      window.removeEventListener('pointermove', updateDragPosition)
      window.removeEventListener('pointerup', finishDrag)
      window.removeEventListener('pointercancel', finishDrag)
    }
  }, [dragTarget, finishDrag, updateDragPosition])

  const beginDrag = useCallback((target, event) => {
    if (event.button !== 0) return

    const currentPosition = target === 'icon' ? iconPosition : cardPosition

    dragStateRef.current = {
      target,
      startX: event.clientX,
      startY: event.clientY,
      originX: currentPosition.x,
      originY: currentPosition.y,
      moved: false,
    }

    setDragTarget(target)
  }, [cardPosition, iconPosition])

  const handleFloatingButtonClick = useCallback(() => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }

    setIsOpen(true)
  }, [])

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

    const isAuthenticated = Boolean(sessionStorage.getItem('token') && sessionStorage.getItem('userId'))

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
    iconPosition,
    cardPosition,
    beginDrag,
    handleFloatingButtonClick,
    handleOpen,
    handleClose,
    handleCloseScreeningForm,
    handleOptionClick,
  }
}
