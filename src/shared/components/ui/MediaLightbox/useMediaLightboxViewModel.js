import { useState, useEffect, useCallback } from 'react'

/**
 * Converte vários formatos de YouTube para o formato embed.
 * - aceita: watch?v=ID, youtu.be/ID, já-embed
 */
function toYouTubeEmbed(url) {
  if (!url || typeof url !== 'string') return url

  // já é embed
  if (url.includes('youtube.com/embed/')) return url

  // youtu.be/ID
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split(/[?&]/)[0]
    return `https://www.youtube.com/embed/${id}`
  }

  // watch?v=ID
  if (url.includes('watch?v=')) {
    const v = url.split('v=')[1].split(/[?&]/)[0]
    return `https://www.youtube.com/embed/${v}`
  }

  return url
}

function isYouTubeUrl(url) {
  return !!(url && (url.includes('youtube.com') || url.includes('youtu.be')))
}

export function useMediaLightboxViewModel({ isOpen, medias = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen])

  const handleNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % medias.length)
  }, [medias.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + medias.length) % medias.length)
  }, [medias.length])

  // prepara a mídia atual: converte youtube para embed
  const rawCurrent = medias[currentIndex]
  const currentMedia = isYouTubeUrl(rawCurrent) ? toYouTubeEmbed(rawCurrent) : rawCurrent

  // isCurrentVideo true para mp4 ou youtube
  const isCurrentVideo = typeof currentMedia === 'string' && (
    (currentMedia.toLowerCase().endsWith('.mp4')) ||
    isYouTubeUrl(rawCurrent)
  )

  return {
    currentIndex,
    currentMedia,
    isCurrentVideo,
    handleNext,
    handlePrev
  }
}
