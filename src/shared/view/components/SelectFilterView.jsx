export function SelectFilterView({ options }) {
  return (
    <>
      <select
        name='filtro'
        id='select_filter'
        className='bg-surface-secondary text-text-primary cursor-pointer appearance-none rounded-md border border-gray-300 px-4 py-2 font-bold uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
      >
        {options.map(option => (
          <option value={option}></option>
        ))}
      </select>
    </>
  )
}

// export function SelectFilterView({
//   options = [],
//   value,
//   onChange,
//   name = '',
//   id = '',
//   width = 'fit',
//   className = '',
//   variant = 'default',
//   shape = 'square',
//   disabled = false,
// }) {
//   const baseClasses = [
//     'appearance-none',
//     'font-bold uppercase',
//     'text-gray-800',
//     'bg-gray-100',
//     'border border-gray-300',
//     'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
//     'cursor-pointer',
//     'px-4 py-2',
//     'transition-colors duration-200',
//   ];

//   const variants = {
//     default: 'text-gray-800 bg-gray-100',
//     destac: 'text-white bg-brand-primary',
//   };

//   const shapes = {
//     square: 'rounded-md',
//     circle: 'rounded-full',
//   };

//   const widths = {
//     full: 'w-full',
//     fit: 'w-fit',
//   };

//   return (
//     <div className={`relative ${widths[width]}`}>
//       <select
//         name={name}
//         id={id}
//         value={value}
//         disabled={disabled}
//         onChange={onChange}
//         className={[
//           baseClasses.join(' '),
//           variants[variant],
//           shapes[shape],
//           widths[width],
//           className,
//           'pr-10', // espaço para ícone
//         ]
//           .filter(Boolean)
//           .join(' ')}
//       >
//         {options.map(opt => (
//           <option key={opt.id} value={opt.id}>
//             {opt.label}
//           </option>
//         ))}
//       </select>

//       {/* Ícone de seta */}
//       <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//         <svg
//           className="w-4 h-4 text-gray-500"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//         >
//           <path d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>
//     </div>
//   );
// }
