import { useCallback, useState } from 'react'

export function useAlert(initialVisible = false) {
  const [isVisible, setIsVisible] = useState(initialVisible)

  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible(prev => !prev), [])

  return { isVisible, show, hide, toggle }
}
