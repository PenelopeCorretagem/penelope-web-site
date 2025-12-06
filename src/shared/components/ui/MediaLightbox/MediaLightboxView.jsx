import { FaTimes } from 'react-icons/fa'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { createPortal } from 'react-dom'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useMediaLightboxViewModel } from './useMediaLightboxViewModel'

export function MediaLightboxView({ isOpen = true, medias = [] }) {
  const {
    currentIndex,
    currentMedia,
    isCurrentVideo,
    handleNext,
    handlePrev
  } = useMediaLightboxViewModel({ isOpen, medias })

  if (!isOpen || !medias.length) return null

  // Opção de debug — descomente pra inspecionar
  // console.log({ currentIndex, currentMedia, isCurrentVideo });

  // helper detecta youtube embed
  const isYouTube = typeof currentMedia === 'string' && (currentMedia.includes('youtube.com') || currentMedia.includes('youtu.be'))

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="relative bg-black rounded-lg border-4 border-distac-primary w-5/6 max-w-6xl h-4/5 flex flex-col items-center justify-center shadow-2xl">
        <ButtonView
          shape="square"
          width="fit"
          onClick={onClose}
          color="transparent"
          className="absolute top-4 right-4 !p-button-x"
          title="Fechar"
        >
          <FaTimes className="text-white text-4xl" aria-hidden="true" />
          <span className="sr-only">Fechar</span>
        </ButtonView>

        {/* SETAS — APARECEM SOMENTE SE NÃO FOR VÍDEO */}
        {!isCurrentVideo && (
        <ButtonView
          shape="square"
          width="fit"
          onClick={handlePrev}
          color="transparent"
          className="absolute left-6 p-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition"
          title="Anterior"
        >
          <IoChevronBack className="text-white text-4xl" aria-hidden="true" />
          <span className="sr-only">Anterior</span>
        </ButtonView>
        )}

        {!isCurrentVideo && (
        <ButtonView
          shape="square"
          width="fit"
          onClick={handleNext}
          color="transparent"
          className="absolute right-6 p-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition"
          title="Próximo"
        >
          <IoChevronForward className="text-white text-4xl" aria-hidden="true" />
          <span className="sr-only">Próximo</span>
        </ButtonView>
        )}


        <div className="flex items-center justify-center w-full h-full">

          {isYouTube ? (
            <iframe
              key={`yt-${currentIndex}`}
              src={currentMedia}
              title={`video-${currentIndex}`}
              className="rounded-lg w-[90%] h-[80%]"   // 👈 AQUI O TAMANHO MAIOR
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (isCurrentVideo && currentMedia.toLowerCase().endsWith('.mp4')) ? (
            <video
              key={`mp4-${currentIndex}`}
              src={currentMedia}
              controls
              className="rounded-lg w-[90%] h-[80%] object-contain"
            />
          ) : (
            <img
              key={`img-${currentIndex}`}
              src={currentMedia}
              alt="Media"
              className="max-h-[60vh] max-w-[80%] object-contain rounded-lg select-none"
            />
          )}

        </div>


        <div className="absolute bottom-6 text-white text-lg font-medium">
          {currentIndex + 1}/{medias.length}
        </div>
      </div>
    </div>,
    document.body
  )
}
