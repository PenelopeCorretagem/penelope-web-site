import { EPlaceholderManagementForm } from '../../../Enum/EPlaceholderManagementForm'

export function InputView({ id, name, variant }) {

  function getPlaceholder(label) {
    // normaliza o label para minúsculo e sem acentos
    const normalized = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    // Mapeia o nome do campo para o texto do placeholder
    return EPlaceholderManagementForm[normalized] || `Digite seu ${label}`
  }

  const finalPlaceholder = getPlaceholder(name)

  return (
    <div className="flex flex-col gap-2">
      <label className="uppercase font-semibold" htmlFor={id}>{name}:</label>
      <input className={`${variant === 'editar' ? 'bg-brand-soft-pink' : 'bg-brand-white-tertiary'} w-full p-2 rounded-sm`} type="text" id={id} name={name} placeholder={finalPlaceholder} />
    </div>
  )
}
