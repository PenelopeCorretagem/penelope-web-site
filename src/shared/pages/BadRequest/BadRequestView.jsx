import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { useNavigate } from 'react-router-dom'

/**
 * BadRequestView - Tela para erros de requisição (400, 422, etc)
 * Exibe mensagem de erro específica com opções de ação
 *
 * @param {Object} props
 * @param {number} [props.statusCode=400] - Código HTTP do erro
 * @param {string} [props.message] - Mensagem personalizada de erro
 * @param {string[]} [props.details] - Detalhes adicionais do erro
 * @param {Function} [props.onRetry] - Callback para tentar novamente
 */
export function BadRequestView({
  statusCode = 400,
  message = null,
  details = [],
  onRetry = null,
}) {
  const navigate = useNavigate()

  const getErrorTitle = () => {
    switch (statusCode) {
      case 400:
        return 'Requisição Inválida'
      case 422:
        return 'Dados Inválidos'
      case 409:
        return 'Conflito nos Dados'
      default:
        return 'Erro na Requisição'
    }
  }

  const getErrorDescription = () => {
    switch (statusCode) {
      case 400:
        return 'A requisição enviada está incompleta ou malformada. Verifique os dados e tente novamente.'
      case 422:
        return 'Os dados fornecidos não são válidos. Verifique os campos obrigatórios.'
      case 409:
        return 'Houve um conflito ao processar sua requisição. Este recurso pode já existir ou não estar disponível.'
      default:
        return 'Houve um problema ao processar sua requisição.'
    }
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <SectionView className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-default-light to-default-light-alt px-4 py-12">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* Ícone */}
        <div className="p-4 bg-yellow-50 rounded-full">
          <AlertTriangle size={64} className="text-yellow-600" />
        </div>

        {/* Código de erro */}
        <HeadingView level={1} className="text-7xl font-bold text-yellow-600">
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

        {/* Detalhes específicos */}
        {details && details.length > 0 && (
          <div className="w-full px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
            <TextView className="text-xs font-semibold text-yellow-800 mb-2">
              Detalhes do erro:
            </TextView>
            <ul className="text-xs text-yellow-700 space-y-1">
              {details.map((detail, idx) => (
                <li key={idx}>• {detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col gap-3 w-full pt-4">
          {onRetry && (
            <ButtonView
              onClick={onRetry}
              color="pink"
              shape="square"
              width="full"
              aria-label="Tentar novamente"
            >
              Tentar Novamente
            </ButtonView>
          )}

          <ButtonView
            onClick={handleGoBack}
            color="brown"
            shape="square"
            width="full"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </ButtonView>

          <ButtonView
            onClick={() => navigate('/')}
            color="distac-primary"
            shape="square"
            width="full"
            aria-label="Ir para Home"
          >
            <Home size={18} />
            <span>Home</span>
          </ButtonView>
        </div>
      </div>
    </SectionView>
  )
}
