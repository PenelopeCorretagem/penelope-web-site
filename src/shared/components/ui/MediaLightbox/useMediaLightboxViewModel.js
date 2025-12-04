// useMediaLightboxViewModel.js
import { useState, useCallback, useEffect } from 'react'
import { MediaLightboxModel } from './MediaLightboxModel'


export function useMediaLightboxViewModel(initial = {}) {
  const [model] = useState(() => new MediaLightboxModel(initial))
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])


  useEffect(() => {
    // Prevent background scroll when open
    if (model.isOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prevOverflow }
    }
    return undefined
  }, [model.isOpen])


  // Commands that mutate model then refresh
  const open = useCallback(({ media = [], type = 'gallery', startIndex = 0 } = {}) => {
    model.open({ media, type, startIndex })
    refresh()
  }, [model, refresh])


  const close = useCallback(() => { model.close(); refresh() }, [model, refresh])
  const next = useCallback(() => { model.next(); refresh() }, [model, refresh])
  const prev = useCallback(() => { model.prev(); refresh() }, [model, refresh])
  const setIndex = useCallback((i) => { model.setIndex(i); refresh() }, [model, refresh])


  // Keyboard handlers
  useEffect(() => {
    function onKey(e) {
      if (!model.isOpen) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [model, close, next, prev])


  return {
    // read-only state
    isOpen: () => model.isOpen,
    media: () => model.media.slice(),
    currentIndex: () => model.currentIndex,
    current: () => model.current,
    type: () => model.type,


    // commands
    open,
    close,
    next,
    prev,
    setIndex,


    // raw model (useful for advanced cases)
    _model: model,
  }
}
