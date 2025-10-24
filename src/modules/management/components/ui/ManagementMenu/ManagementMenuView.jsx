import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function ManagementMenuView({ variant, activeMenu, setActiveMenu }) {

  const variants = { perfil: ['perfil', 'acesso'], config: ['usuários', 'imóveis'] }

  return (
    <nav className='flex items-center gap-subsection md:gap-subsection-md'>
      {variants[variant].map(item => (
        <button key={item} onClick={() => setActiveMenu(item)} className='cursor-pointer'>
          <HeadingView level={2} className={`${activeMenu === item ? 'text-brand-pink underline' : ''}`}>{item}</HeadingView>
        </button>
      ))}
    </nav>
  )
}
