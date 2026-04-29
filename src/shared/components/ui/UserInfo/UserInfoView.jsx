import { User } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

/**
 * UserInfoView - Seção com informações do usuário na sidebar
 *
 * RESPONSABILIDADES:
 * - Exibir avatar/ícone do usuário
 * - Mostrar email e nível de acesso
 * - Adaptar-se ao estado expandido/recolhido da sidebar
 *
 * @param {Object} props
 * @param {string} props.email - Email do usuário
 * @param {string} props.role - Nível de acesso (Admin, User, etc)
 * @param {boolean} props.isOpen - Se a sidebar está expandida
 */
export function UserInfoView({ email = '', role = 'Cliente', isOpen = true }) {

  return (
    <div className="px-4 h-24 flex items-center border-b border-default-light">
      {/* Horizontal Layout: Icon + Info */}
      <div className="flex items-center gap-3">
        {/* Avatar Circle */}
        <div className="flex items-center justify-center w-10 h-10 bg-default-light rounded-full flex-shrink-0">
          <User size={20} className="text-distac-secondary" />
        </div>

        {/* Email and Role - Hide when sidebar is closed */}
        <div
          className={`flex-1 transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen
              ? 'opacity-100 w-auto'
              : 'opacity-0 w-0'
          }`}
        >
          {isOpen && (
            <div className="flex flex-col">
              <p className="text-xs text-default-light truncate" title={email}>
                {email}
              </p>
              <HeadingView 
                level={6} 
                className="text-xs font-medium text-distac-primary uppercase tracking-wider leading-tight"
              >
                {role}
              </HeadingView>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
