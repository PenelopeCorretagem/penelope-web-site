import { NavMenuView } from '@shared/components/layout/NavMenu/NavMenuView'

/**
 * FooterView - Rodapé principal da aplicação
 */
export function FooterView({
  isAuthenticated = false,
  className = '',
}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`flex flex-col items-center justify-center p-section md:p-section-md w-full border-t-2 border-default-light-muted h-auto gap-subsection md:gap-subsection-md bg-default-light ${className}`.trim()}>
      <NavMenuView
        isAuthenticated={isAuthenticated}
        variant="footer"
        logoSize={'40'}
        logoColorScheme={'pink'}
      />
      <div className="w-full text-center border-t-2 border-default-light-muted pt-section-y">
        © {currentYear} Penélope - Consultora de Imóveis | Todos os direitos reservados.
      </div>
    </footer>
  )
}
