import { X } from 'lucide-react' // 1. Importe o ícone 'X'

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
      onClick={onClose}
    >
      <div
        className='relative rounded-lg bg-white shadow-xl'
        onClick={e => e.stopPropagation()}
        style={{ width: '820px', height: '384px' }}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-800'
          aria-label='Fechar modal'
        >
          <X size={24} />
        </button>

        {children}
      </div>
    </div>
  )
}
