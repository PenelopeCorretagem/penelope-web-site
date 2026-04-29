import { FaTimes } from 'react-icons/fa'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { createPortal } from 'react-dom'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useMediaLightboxViewModel } from './useMediaLightboxViewModel'

export function MediaLightboxView({ isOpen = true, medias = [], onClose }) {
  // Extrair URLs dos objetos ImageEstate
  const normalizedMedias = Array.isArray(medias) ? medias.map(m => m?.url || m).filter(m => typeof m === 'string') : []

  const {
    currentIndex,
    currentMedia,
    isCurrentVideo,
    handleNext,
    handlePrev,
    goToIndex,
  } = useMediaLightboxViewModel({ isOpen, medias: normalizedMedias })

  if (!isOpen || !normalizedMedias.length) {
    return null
  }

  // helper detecta youtube embed
  const isYouTube = typeof currentMedia === 'string' && (currentMedia.includes('youtube.com') || currentMedia.includes('youtu.be'))

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-default-dark/85 px-3 py-4 backdrop-blur-xl md:px-6 md:py-6">
      <div className="relative flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0b0f] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-distac-primary/20 via-transparent to-transparent" />

        <ButtonView
          shape="square"
          width="fit"
          onClick={onClose}
          color="transparent"
          className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-white/10 !p-3 text-white backdrop-blur-md transition hover:bg-white/15"
          title="Fechar"
        >
          <FaTimes className="text-xl" aria-hidden="true" />
          <span className="sr-only">Fechar</span>
        </ButtonView>

        <div className="flex h-full flex-col md:flex-row">
          <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/25 p-3 md:p-5">
            {!isCurrentVideo && (
              <ButtonView
                shape="square"
                width="fit"
                onClick={handlePrev}
                color="transparent"
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/15"
                title="Anterior"
              >
                <IoChevronBack className="text-2xl" aria-hidden="true" />
                <span className="sr-only">Anterior</span>
              </ButtonView>
            )}

            {!isCurrentVideo && (
              <ButtonView
                shape="square"
                width="fit"
                onClick={handleNext}
                color="transparent"
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/15"
                title="Próximo"
              >
                <IoChevronForward className="text-2xl" aria-hidden="true" />
                <span className="sr-only">Próximo</span>
              </ButtonView>
            )}

            <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-black">
              {isYouTube ? (
                <iframe
                  key={`yt-${currentIndex}`}
                  src={currentMedia}
                  title={`video-${currentIndex}`}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (isCurrentVideo && currentMedia.toLowerCase().endsWith('.mp4')) ? (
                <video
                  key={`mp4-${currentIndex}`}
                  src={currentMedia}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  key={`img-${currentIndex}`}
                  src={currentMedia}
                  alt="Mídia do imóvel"
                  className="h-full w-full select-none object-cover object-center"
                />
              )}
            </div>
          </div>

          <div className="flex w-full flex-col justify-between gap-4 border-t border-white/10 bg-white/[0.03] p-4 md:w-64 md:border-l md:border-t-0 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Mídia</p>
              <p className="mt-2 text-lg font-semibold text-white">{currentIndex + 1}</p>
              <p className="text-sm text-white/55">de {normalizedMedias.length}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 md:grid-cols-2">
              {normalizedMedias.map((media, index) => {
                const isActive = index === currentIndex
                const isThumbVideo = typeof media === 'string' && (media.includes('youtube.com') || media.includes('youtu.be') || media.toLowerCase().endsWith('.mp4'))

                return (
                  <button
                    key={`${media}-${index}`}
                    type="button"
                      onClick={() => goToIndex(index)}
                    className={`group relative aspect-[4/3] overflow-hidden rounded-xl border transition ${isActive ? 'border-distac-primary ring-2 ring-distac-primary/40' : 'border-white/10 hover:border-white/25'}`}
                    aria-label={`Abrir mídia ${index + 1}`}
                  >
                    {isThumbVideo ? (
                      <div className="flex h-full w-full items-center justify-center bg-black/60 text-white/70">
                        <span className="text-xs uppercase tracking-[0.2em]">Vídeo</span>
                      </div>
                    ) : (
                      <img
                        src={media}
                        alt={`Miniatura ${index + 1}`}
                        className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-md">
          {currentIndex + 1} / {normalizedMedias.length}
        </div>
      </div>
    </div>,
    document.body
  )
}
