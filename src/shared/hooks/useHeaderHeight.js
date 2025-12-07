import { useState, useEffect } from 'react'

/**
 * Hook para obter a altura do header dinamicamente
 * Monitora mudanças no tamanho do header via ResizeObserver
 *
 * @returns {number} Altura do header em pixels
 */
export function useHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    // Função para atualizar a altura
    const updateHeaderHeight = () => {
      // Tenta encontrar o header por diferentes seletores comuns
      const header = document.querySelector('header') ||
                     document.querySelector('[role="banner"]') ||
                     document.querySelector('.header') ||
                     document.querySelector('#header')

      if (header) {
        const height = header.offsetHeight
        setHeaderHeight(height)
      }
    }

    // Atualiza inicialmente
    updateHeaderHeight()

    // Cria observer para mudanças no tamanho
    const header = document.querySelector('header') ||
                   document.querySelector('[role="banner"]') ||
                   document.querySelector('.header') ||
                   document.querySelector('#header')

    if (header) {
      const resizeObserver = new ResizeObserver(() => {
        updateHeaderHeight()
      })

      resizeObserver.observe(header)

      // Cleanup
      return () => {
        resizeObserver.disconnect()
      }
    }

    // Fallback: listener para resize da janela
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  return headerHeight
}
