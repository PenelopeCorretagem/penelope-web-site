import { useMemo, useCallback } from 'react'
import { ContactIconModel } from '@institutional/components/ContactIcon/ContactIconModel'

export function useContactIconViewModel({
  children,
  size = 'medium',
  onClick,
  href,
  className = ''
}) {
  const validation = useMemo(() => {
    return ContactIconModel.validateContactIconProps(children, onClick, href)
  }, [children, onClick, href])

  const sizeClasses = useMemo(() => {
    return ContactIconModel.getSizeClasses(size)
  }, [size])

  const baseClasses = useMemo(() => {
    return ContactIconModel.getBaseClasses()
  }, [])

  const finalClassName = useMemo(() => {
    return `${baseClasses} ${sizeClasses} ${className}`.trim()
  }, [baseClasses, sizeClasses, className])

  const isLink = useMemo(() => {
    return !!href
  }, [href])

  const handleClick = useCallback((event) => {
    if (onClick) {
      onClick(event)
    }
  }, [onClick])

  return {
    validation,
    finalClassName,
    isLink,
    handleClick,
    href,
    children
  }
}
