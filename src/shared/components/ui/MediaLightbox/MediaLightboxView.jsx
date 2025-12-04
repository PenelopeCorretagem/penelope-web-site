import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { createPortal } from 'react-dom'

export function MediaLightboxView({
  isOpen = true,
  medias = [],
  onClose = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Garante que sempre comece do 0 ao abrir
  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen])

  if (!isOpen || !medias.length) return null

  const handleNext = () => {
    setCurrentIndex(i => (i + 1) % medias.length)
  }

  const handlePrev = () => {
    setCurrentIndex(i => (i - 1 + medias.length) % medias.length)
  }

  const currentMedia = medias[currentIndex]

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999]">

      {/* CONTAINER PRINCIPAL */}
      <div className="relative bg-black rounded-lg border-4  border-distac-primary w-5/6 max-w-6xl h-4/5 flex flex-col items-center justify-center shadow-2xl">

        {/* BOTÃO DE FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl hover:scale-110 transition"
        >
          <FaTimes />
        </button>

        {/* SETA ESQUERDA */}
        <button
          onClick={handlePrev}
          className="absolute left-6 text-white text-4xl bg-white/10 border border-white/30 rounded-full p-3 hover:bg-white/20 transition"
        >
          <IoChevronBack />
        </button>

        {/* SETA DIREITA */}
        <button
          onClick={handleNext}
          className="absolute right-6 text-white text-4xl bg-white/10 border border-white/30 rounded-full p-3 hover:bg-white/20 transition"
        >
          <IoChevronForward />
        </button>

        {/* IMAGEM */}
        {currentMedia.endsWith('.mp4') ? (
          <video
            src={currentMedia}
            controls
            className="max-h-[60vh] max-w-[80%] rounded-lg"
          />
        ) : (
          <img
            src={currentMedia}
            alt="Media"
            className="max-h-[60vh] max-w-[80%] object-contain rounded-lg select-none"
          />
        )}

        {/* CONTADOR */}
        <div className="absolute bottom-6 text-white text-lg font-medium">
          {currentIndex + 1}/{medias.length}
        </div>
      </div>
    </div>,
    document.body
  )
}
