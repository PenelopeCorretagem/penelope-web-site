import { LogoModel } from '@shared/model/components/LogoModel'
import { LogoView } from '@shared/view/components/LogoView'
import { MenuView } from '@shared/view/components/MenuView'

export function HeaderView({
  isAuthenticated,
  logoSize = 40,
  logoColorScheme = 'primary',
}) {
  const getHeaderClasses = () => {
    return [
      'flex items-center justify-between',
      'w-full px-section-x md:px-section-x-md py-5',
      'bg-white shadow-md',
      'transition-all duration-200',
      'sticky top-0 z-50',
    ].join(' ')
  }

  return (
    <header className={getHeaderClasses()}>
      <LogoView
        model={new LogoModel(logoColorScheme, logoSize)}
        className='transition-opacity hover:opacity-80'
      />
      <MenuView isAuthenticated={isAuthenticated} />
    </header>
  )
}
