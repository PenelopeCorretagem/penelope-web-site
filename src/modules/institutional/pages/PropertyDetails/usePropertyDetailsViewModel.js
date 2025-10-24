import { useRef, useState, useEffect } from 'react'

export function usePropertyDetailsViewModel() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const [cardStyle, setCardStyle] = useState({ position: 'relative', width: '100%', zIndex: 50 })

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      const wrapper = wrapperRef.current
      const card = cardRef.current
      if (!section || !wrapper || !card) return

      const sectionRect = section.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      if (sectionRect.top <= 100) {
        setCardStyle({
          position: 'fixed',
          top: 100,
          left: wrapperRect.left,
          width: wrapperRect.width,
          zIndex: 1000,
        })
      } else {
        setCardStyle({
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return {
    sectionRef,
    wrapperRef,
    cardRef,
    cardStyle,
  }
}
