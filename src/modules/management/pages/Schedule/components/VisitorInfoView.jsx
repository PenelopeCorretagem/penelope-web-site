/**
 * VisitorInfoView.jsx
 * Componente para entrada de informações do visitante
 */

export function VisitorInfoView({
  visitorName = '',
  visitorEmail = '',
  visitorPhone = '',
  onNameChange = () => {},
  onEmailChange = () => {},
  onPhoneChange = () => {},
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-default-dark mb-3 uppercase">
        Informações do Visitante
      </label>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nome do visitante"
          value={visitorName}
          onChange={onNameChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
        />

        <input
          type="email"
          placeholder="Email do visitante"
          value={visitorEmail}
          onChange={onEmailChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
        />

        <input
          type="tel"
          placeholder="Telefone do visitante"
          value={visitorPhone}
          onChange={onPhoneChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
        />
      </div>
    </div>
  )
}
