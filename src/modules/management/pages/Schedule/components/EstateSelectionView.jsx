import { Check, Image as ImageIcon } from 'lucide-react'

/**
 * EstateSelectionView.jsx
 * Componente para seleção de imóvel no formulário de agendamento
 */

export function EstateSelectionView({
  estates = [],
  selectedEstateId = null,
  loading = false,
  error = null,
  onSelectEstate = () => {},
  getEstateImageUrl = () => null,
  getEstateTitle = () => '',
}) {
  if (loading) {
    return (
      <div className="text-center py-8 text-muted">
        Carregando imóveis...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (estates.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-lg text-center">
        Nenhum imóvel disponível para agendamento
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {estates.map((estate) => {
        const imageUrl = getEstateImageUrl(estate.estate)
        const isSelected = selectedEstateId === estate.id

        return (
          <button
            key={estate.id}
            type="button"
            onClick={() => onSelectEstate(estate)}
            className={`p-3 rounded-lg border-2 transition text-left ${
              isSelected
                ? 'border-distac-primary bg-distac-primary/5'
                : 'border-slate-200 bg-white hover:border-distac-primary/50'
            }`}
            aria-pressed={isSelected}
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={getEstateTitle(estate.estate)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-slate-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm text-default-dark truncate">
                  {getEstateTitle(estate.estate)}
                </p>
                <p className="text-xs text-muted mt-1">
                  {estate.estate?.type || 'Imóvel'}
                </p>
                {estate.estate?.address && (
                  <p className="text-xs text-muted truncate mt-1">
                    {estate.estate.address.street}, {estate.estate.address.number}
                    {estate.estate.address.neighborhood && ` - ${estate.estate.address.neighborhood}`}
                  </p>
                )}
              </div>

              {isSelected && (
                <div className="flex items-start justify-end">
                  <div className="bg-distac-primary text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
