/**
 * AvailableHoursSection.jsx
 * Componente para exibição de horários disponíveis
 */

export function AvailableHoursSection({
  availableHours = [],
  selectedEstate = null,
}) {
  if (!selectedEstate) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-blue-900 mb-2">
        Horários disponíveis para este imóvel neste dia:
      </p>
      <div className="flex flex-wrap gap-2">
        {availableHours.length > 0 ? (
          availableHours.map(hour => (
            <div
              key={hour}
              className="px-3 py-1 bg-blue-100 text-blue-900 rounded text-xs font-medium"
            >
              {String(hour).padStart(2, '0')}:00
            </div>
          ))
        ) : (
          <p className="text-xs text-blue-700">
            Nenhum horário disponível para este imóvel neste dia
          </p>
        )}
      </div>
    </div>
  )
}
