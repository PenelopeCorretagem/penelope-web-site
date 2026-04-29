import { LogoView } from '@shared/components/ui/Logo/LogoView'

/**
 * AuthTransitionView - Tela de transição durante autenticação
 *
 * Exibe durante:
 * - Login (carregamento após submissão)
 * - Logout (transição para home)
 * - Verificação de token
 *
 * Componente simples que não precisa de ViewModel pois:
 * - Não tem lógica de negócio
 * - Apenas renderiza UI de carregamento
 * - Props controladas pelo PageView
 *
 * RESPONSIVIDADE:
 * - Mobile: logo 100px, gap-6, texto base
 * - Desktop: logo 128px, gap-8, texto lg
 *
 * @param {string} status - Status da transição ('login' | 'logout' | 'verifying')
 * @param {string} message - Mensagem customizada (opcional)
 */
export function AuthTransitionView({ status = 'verifying', message }) {
  // Mensagens padrão por status
  const messageMap = {
    login: 'Autenticando sua conta...',
    logout: 'Encerrando sua sessão...',
    verifying: 'Verificando acesso...',
  }

  const displayMessage = message || messageMap[status]

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gradient-to-br from-distac-primary via-distac-primary to-distac-secondary overflow-hidden">
      {/* Efeito de fundo com blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Container central - Desktop e Mobile */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 md:gap-8">
        {/* Logo com animação */}
        <div className="animate-pulse flex items-center justify-center transform transition-transform">
          <LogoView 
            variant="mark" 
            height="100" 
            className="text-white fill-current drop-shadow-2xl"
          />
        </div>

        {/* Spinner - Anel de carregamento */}
        <div className="flex justify-center">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            {/* Anel de fundo */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            
            {/* Anel animado */}
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .spinner-ring {
                animation: spin 1.2s linear infinite;
              }
            `}</style>
            <div 
              className="spinner-ring absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white"
            ></div>
          </div>
        </div>

        {/* Mensagem de status */}
        <div className="text-center">
          <p className="text-base md:text-lg font-medium text-white drop-shadow-lg">
            {displayMessage}
          </p>
          
          {/* Indicador de progresso com pontos animados */}
          <div className="flex items-center justify-center gap-1 mt-4">
            <div className="w-2 h-2 rounded-full bg-default-light animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-default-light animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-default-light animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Mensagem adicional (mobile) */}
        <p className="text-xs md:text-sm text-default-light text-center opacity-80 mt-4">
          Isso pode levar alguns segundos
        </p>
      </div>
    </div>
  )
}
