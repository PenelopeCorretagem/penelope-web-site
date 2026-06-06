import { Server, AlertTriangle, Home, Mail } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { useNavigate } from 'react-router-dom'

/**
 * ServerErrorView - Tela para erros do servidor (5xx)
 * Exibe mensagem amigável e opções de ação
 *
 * @param {Object} props
 * @param {number} [props.statusCode=500] - Código HTTP do erro
 * @param {string} [props.message] - Mensagem personalizada de erro
 */
export function ServerErrorView({ statusCode = 500, message = null }) {
  const navigate = useNavigate()

  const getErrorTitle = () => {
    switch (statusCode) {
      case 500:
        return 'Erro Interno do Servidor'
      case 502:
        return 'Gateway Inválido'
      case 503:
        return 'Serviço Indisponível'
      case 504:
        return 'Tempo Limite Excedido'
      default:
        return 'Erro do Servidor'
    }
  }

  const getErrorDescription = () => {
    switch (statusCode) {
      case 500:
        return 'Algo deu errado em nossos servidores. Nosso time foi notificado e está investigando.'
      case 502:
        return 'Problema na comunicação com nossos servidores. Tente novamente em alguns momentos.'
      case 503:
        return 'Nossos servidores estão em manutenção. Tente novamente mais tarde.'
      case 504:
        return 'O servidor demorou muito para responder. Tente novamente.'
      default:
        return 'Ocorreu um erro inesperado no servidor.'
    }
  }

  return (
    <SectionView className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-default-light to-default-light-alt px-4 py-12">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* Ícone */}
        <div className="p-4 bg-distac-primary/10 rounded-full">
          <Server size={64} className="text-distac-primary" />
        </div>

        {/* Código de erro */}
        <HeadingView level={1} className="text-8xl font-bold text-distac-primary">
          {statusCode}
        </HeadingView>

        {/* Título */}
        <HeadingView level={2} className="text-2xl font-bold text-default-dark">
          {getErrorTitle()}
        </HeadingView>

        {/* Descrição */}
        <TextView className="text-default-dark-light text-base leading-relaxed">
          {message || getErrorDescription()}
        </TextView>

        {/* Ícone de aviso adicional */}
        <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg w-full">
          <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
          <TextView className="text-xs text-yellow-800">
            Se o problema persistir, entre em contato conosco.
          </TextView>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 w-full pt-4">
          <ButtonView
            onClick={() => window.location.reload()}
            color="pink"
            shape="square"
            width="full"
            aria-label="Tentar novamente"
          >
            Tentar Novamente
          </ButtonView>

          <ButtonView
            onClick={() => navigate('/')}
            color="brown"
            shape="square"
            width="full"
            aria-label="Voltar para Home"
          >
            Voltar para Home
          </ButtonView>
        </div>

        {/* Suporte */}
        <div className="pt-4 border-t border-default-light-muted w-full">
          <TextView className="text-xs text-default-dark-light mb-3">
            Precisa de ajuda?
          </TextView>
          <div className="flex gap-3 justify-center">
            <ButtonView
              onClick={() => (window.location.href = 'mailto:suporte@penelope.com.br')}
              color="distac-primary"
              shape="square"
              width="fit"
              aria-label="Enviar email para suporte"
            >
              <Mail size={18} />
              <span>Suporte</span>
            </ButtonView>
            <ButtonView
              onClick={() => navigate('/')}
              color="brown"
              shape="square"
              width="fit"
              aria-label="Voltar para Home"
            >
              <Home size={18} />
              <span>Home</span>
            </ButtonView>
          </div>
        </div>
      </div>
    </SectionView>
  )
}
