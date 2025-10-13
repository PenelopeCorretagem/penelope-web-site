import { useMemo } from 'react'
import { ImageModel } from './ImageModel'

export function useImageViewModel({ src, alt, description, mode = 'auto', className = '' }) {
  const imageMode = useMemo(() => {
    if (mode === 'auto') {
      return className.includes('bg-cover') || className.includes('flex-1')
        ? ImageModel.MODES.BACKGROUND
        : ImageModel.MODES.IMAGE
    }
    return mode
  }, [mode, className])

  const validation = useMemo(() => {
    return ImageModel.validateImageProps(src, alt, description)
  }, [src, alt, description])

  const finalClassName = useMemo(() => {
    const defaultClasses = ImageModel.getDefaultClasses(imageMode)
    return `${defaultClasses} ${className}`.trim()
  }, [imageMode, className])

  const hasImage = useMemo(() => {
    return src != null && src !== ''
  }, [src])

  const isBackgroundMode = useMemo(() => {
    return imageMode === ImageModel.MODES.BACKGROUND
  }, [imageMode])

  const hasDescription = useMemo(() => {
    return description && description.trim() !== ''
  }, [description])

  return {
    hasImage,
    isBackgroundMode,
    finalClassName,
    validation,
    hasDescription,
    src,
    alt,
    description
  }
}
