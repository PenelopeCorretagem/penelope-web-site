import { AlertCircle } from 'lucide-react'

/**
 * FormErrorsSection.jsx
 * Componente para exibição de erros de validação e submissão
 */

export function FormErrorsSection({
  validationErrors = [],
  submitError = null,
}) {
  if (validationErrors.length === 0 && !submitError) {
    return null
  }

  return (
    <>
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-2 mb-2">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="font-semibold text-red-900">Erros encontrados:</p>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {validationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}
    </>
  )
}
