// MediaLightboxView.jsx
import ReactDOM from 'react-dom'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export const MediaLightboxView = ({ property, onClose }) => {
  const media = property?.media ?? []
  const [currentIndex, setCurrentIndex] = useState(0)

  const current = media.length > 0 ? media[currentIndex] : null

  const handlePrev = () => setCurrentIndex(i => (i > 0 ? i - 1 : media.length - 1))
  const handleNext = () => setCurrentIndex(i => (i < media.length - 1 ? i + 1 : 0))
  const handleSetIndex = (i) => setCurrentIndex(i)

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-default-light rounded-lg shadow-2xl p-8 w-full max-w-5xl mx-4 border-2 border-distac-primary flex flex-col space-y-6">

        {/* Cabeçalho */}
        <HeadingView
          level={4}
          className="flex justify-between items-center w-full text-distac-primary font-semibold"
        >
          <ButtonView
            shape="square"
            width="fit"
            onClick={onClose}
            className="!p-button-x"
            color="transparent"
            title="Fechar"
          >
            <FaArrowLeft className="text-distac-secondary text-3xl" aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </ButtonView>

          <span>{property?.title || 'Galeria'}</span>

          <div className="w-12" />
        </HeadingView>

        {/* Conteúdo principal */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-default-light-alt p-4 rounded-lg min-h-[400px]">
            {current ? (
              current.type === 'video' ? (
                <video src={current.url} controls className="w-full max-h-[500px] object-contain rounded-lg" />
              ) : (
                <img src={current.url} alt={`media-${currentIndex}`} className="w-full max-h-[500px] object-contain rounded-lg" />
              )
            ) : (
              <TextView className="text-default-dark-muted">Nenhuma mídia disponível</TextView>
            )}
          </div>

          {/* Sidebar com thumbnails */}
          {media.length > 0 && (
          <div className="w-full md:w-24 flex flex-col gap-4">
            {/* Controles de navegação */}
            <div className="flex md:flex-col gap-2">
              <ButtonView onClick={handlePrev} shape="square" width="fit" title="Anterior">
                <FaChevronLeft />
              </ButtonView>
              <ButtonView onClick={handleNext} shape="square" width="fit" title="Próximo">
                <FaChevronRight />
              </ButtonView>
            </div>

            {/* Grid de thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
              {media.map((m, i) => (
                <button
                  key={`${m.url}-${i}`}
                  onClick={() => handleSetIndex(i)}
                  className={`p-0 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 w-20 h-20 md:w-full ${
                    i === currentIndex
                      ? 'ring-2 ring-distac-primary border-distac-primary'
                      : 'border-default-light hover:border-distac-primary'
                  }`}
                  title={m.type}
                >
                  {m.type === 'video' ? (
                    <video src={m.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={m.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>

            {/* Indicador de posição */}
            <div className="text-center text-sm text-default-dark-muted">
              {currentIndex + 1} / {media.length}
            </div>
          </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  )
}
