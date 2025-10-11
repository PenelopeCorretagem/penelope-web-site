export function InputView({ id, name, placeholder, variant }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="uppercase font-semibold" htmlFor={id}>{name}:</label>
      <input className={`${variant === 'editar' ? 'bg-brand-soft-pink' : 'bg-brand-white-tertiary'} w-full p-2 rounded-sm`} type="text" id={id} name={name} placeholder={placeholder} />
    </div>
  )
}
