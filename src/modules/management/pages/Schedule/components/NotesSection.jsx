/**
 * NotesSection.jsx
 * Componente para entrada de notas ou motivo de reagendamento
 */

export function NotesSection({
  isRescheduleMode = false,
  value = '',
  onChange = () => {},
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-default-dark mb-2 uppercase">
        {isRescheduleMode ? 'Motivo do reagendamento' : 'Notas (opcional)'}
      </label>
      <textarea
        placeholder={
          isRescheduleMode
            ? 'Descreva o motivo do reagendamento...'
            : 'Adicione observações sobre o agendamento...'
        }
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none resize-none"
      />
    </div>
  )
}
