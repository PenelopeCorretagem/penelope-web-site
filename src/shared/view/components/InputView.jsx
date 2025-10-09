export function InputView({ id, name, placeholder, variant }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="uppercase font-semibold" htmlFor={id}>{name}:</label>
      <input className={`${variant === 'perfil' ? 'bg-brand-white-tertiary' : 'bg-brand-soft-pink'} w-full p-2 rounded-sm`} type="text" id={id} name={name} placeholder={placeholder} />
    </div>
  )
}
