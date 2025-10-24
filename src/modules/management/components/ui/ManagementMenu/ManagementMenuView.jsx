import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function ManagementMenuView({ variant, activeMenu, setActiveMenu }) {
  const variants = {
    perfil: ['perfil', 'acesso'],
    config: ['usuários', 'imóveis']
  }

  const menuItems = variants[variant] || []

  return (
    <nav className='flex items-center gap-subsection md:gap-subsection-md'>
      {menuItems.map(item => {
        const isActive = item === activeMenu

        return (
          <button
            key={item}
            onClick={() => setActiveMenu(item)}
            className='cursor-pointer'
          >
            <HeadingView
              level={2}
              state={isActive ? 'active' : 'default'}
            >
              {item}
            </HeadingView>
          </button>
        )
      })}
    </nav>
  )
}
