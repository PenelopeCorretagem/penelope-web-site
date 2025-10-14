import { useState, useEffect, useCallback, useMemo } from 'react'
import { PopUpModel } from './PopUpModel'

/**
 * usePopUpViewModel - ViewModel para gerenciar lógica do popup
 * Centraliza estado, handlers e configurações de estilo
 */
export function usePopUpViewModel(initialProps = {}) {
  const [isOpen, setIsOpen] = useState(initialProps.isOpen || false)
  const popUpModel = useMemo(() => new PopUpModel(), [])

  // Sincronizar com prop externa
  useEffect(() => {
    if (initialProps.isOpen !== undefined) {
      setIsOpen(initialProps.isOpen)
    }
  }, [initialProps.isOpen])

  // Validar props
  const validation = useMemo(() => {
    return popUpModel.validateProps(initialProps)
  }, [initialProps, popUpModel])

  // Configuração final (merge de padrões + customizações)
  const config = useMemo(() => {
    return popUpModel.mergeConfig(initialProps.config)
  }, [initialProps.config, popUpModel])

  // Estilos gerados
  const styles = useMemo(() => {
    return popUpModel.generateStyles(config)
  }, [config, popUpModel])

  // Classes CSS
  const classes = useMemo(() => {
    return popUpModel.getDefaultClasses()
  }, [popUpModel])

  // Handlers
  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    if (initialProps.onClose) {
      initialProps.onClose()
    }
  }, [initialProps])

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleOverlayClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }, [handleClose])

  const handleContentClick = useCallback((event) => {
    event.stopPropagation()
  }, [])

  // Propriedades computadas
  const shouldRender = useMemo(() => {
    return isOpen
  }, [isOpen])

  const hasTitle = useMemo(() => {
    return Boolean(initialProps.title)
  }, [initialProps.title])

  const showCloseButton = useMemo(() => {
    return initialProps.showCloseButton !== false
  }, [initialProps.showCloseButton])

  // Configurações de estilo específicas
  const getOverlayStyle = useCallback(() => {
    return styles.overlay
  }, [styles.overlay])

  const getContentStyle = useCallback(() => {
    return {
      ...styles.content,
      maxWidth: initialProps.maxWidth || config.maxWidth
    }
  }, [styles.content, initialProps.maxWidth, config.maxWidth])

  const getCloseButtonStyle = useCallback(() => {
    return styles.closeButton
  }, [styles.closeButton])

  const getTitleStyle = useCallback(() => {
    return styles.title
  }, [styles.title])

  const getContentClasses = useCallback(() => {
    const baseClass = classes.content
    const customClass = initialProps.className || ''
    return `${baseClass} ${customClass}`.trim()
  }, [classes.content, initialProps.className])

  // Debug info (apenas em desenvolvimento)
  const debugInfo = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return {
        isOpen,
        validation,
        config,
        props: initialProps
      }
    }
    return null
  }, [isOpen, validation, config, initialProps])

  return {
    // Estado
    isOpen,
    shouldRender,
    hasTitle,
    showCloseButton,

    // Props
    title: initialProps.title,
    children: initialProps.children,

    // Handlers
    handleOpen,
    handleClose,
    handleToggle,
    handleOverlayClick,
    handleContentClick,

    // Estilos
    getOverlayStyle,
    getContentStyle,
    getCloseButtonStyle,
    getTitleStyle,
    getContentClasses,

    // Classes CSS
    classes,

    // Configuração
    config,
    validation,

    // Utilitários
    setIsOpen,
    debugInfo
  }
}

/**
 * Hook personalizado mais simples para controle básico do popup
 */
export function usePopUp(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  }
}
