import { useMemo } from 'react'
import { ImageModel } from './ImageModel'

export function useImageViewModel({ src, alt, description, mode = 'auto', className = '' }) {
  const imageMode = useMemo(() => {
    return ImageModel.determineMode(mode, className)
  }, [mode, className])

  const hasImage = useMemo(() => {
    return ImageModel.hasValidSource(src)
  }, [src])

  const isBackgroundMode = useMemo(() => {
    return imageMode === ImageModel.MODES.BACKGROUND
  }, [imageMode])

  const hasDescription = useMemo(() => {
    return ImageModel.hasValidDescription(description)
  }, [description])

  return {
    hasImage,
    isBackgroundMode,
    hasDescription,
    alt
  }
}
