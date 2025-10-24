import { useMemo } from 'react'
import { CardImageModel } from './CardImageModel'

export function useCardImageViewModel({ src, alt, description, position = 'bottom-right', className = '' }) {
  const validation = useMemo(() => {
    return CardImageModel.validateCardImageProps(src, alt)
  }, [src, alt])

  const positionClasses = useMemo(() => {
    return CardImageModel.getPositionClasses(position)
  }, [position])

  const paddingClasses = useMemo(() => {
    return CardImageModel.getPaddingClasses(position)
  }, [position])

  const hasDescription = useMemo(() => {
    return description && description.trim() !== ''
  }, [description])

  const imageClassName = useMemo(() => {
    const defaultClasses = 'block rounded-sm shadow-sm object-cover'
    return `${defaultClasses} ${className}`.trim()
  }, [className])

  return {
    validation,
    positionClasses,
    paddingClasses,
    hasDescription,
    imageClassName,
    src,
    alt,
    description
  }
}
