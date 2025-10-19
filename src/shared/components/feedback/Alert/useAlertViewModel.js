import { useState, useCallback } from 'react'
import { AlertModel } from './AlertModel'

export function useAlertViewModel(initialConfig = {}) {
  const [alert] = useState(() => AlertModel.create(initialConfig))
  const [isVisible, setIsVisible] = useState(alert.isVisible)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    alert.close()
  }, [alert])

  const show = useCallback(() => {
    setIsVisible(true)
    alert.show()
  }, [alert])

  const hide = useCallback(() => {
    setIsVisible(false)
    alert.hide()
  }, [alert])

  return {
    isVisible,
    type: alert.type, 
    message: alert.message,
    children: alert.children,
    handleClose,
    show,
    hide
  }
}
