import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function ManagementMenuView({ variant, activeMenu, setActiveMenu }) {
  const variants = {
    perfil: ['perfil', 'acesso'],
    config: ['usuários', 'imóveis']
  }

  const menuItems = variants[variant] || []

  const handleMenuClick = (item) => {
    setActiveMenu(item)
  }

  return (
    <nav className='flex items-center gap-subsection md:gap-subsection-md'>
      {menuItems.map(item => {
        const isActive = item === activeMenu

        return (
          <button
            key={item}
            onClick={() => handleMenuClick(item)}
            className={`cursor-pointer transition-colors duration-200 ${
              isActive
                ? 'text-distac-primary'
                : 'text-default-dark hover:text-distac-primary'
            }`}
            type="button"
          >
            <HeadingView
              level={2}
              className="transition-colors duration-200 !text-current"
            >
              {item}
            </HeadingView>
          </button>
        )
      })}
    </nav>
  )
}
