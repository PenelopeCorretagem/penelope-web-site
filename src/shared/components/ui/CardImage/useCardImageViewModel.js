import { useMemo } from 'react'
import { CardImageModel } from './CardImageModel'

export function useCardImageViewModel({ src, alt, description, position = 'bottom-right', className = '' }) {
  const hasDescription = useMemo(() => {
    return CardImageModel.hasValidDescription(description)
  }, [description])

  return {
    hasDescription,
    src,
    alt,
    description,
    position,
    className
  }
}
