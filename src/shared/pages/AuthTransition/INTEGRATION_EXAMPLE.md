/**
 * EXEMPLO DE INTEGRAÇÃO COM SIGNINPANEL
 * 
 * Este arquivo demonstra como integrar a transição de autenticação
 * com o formulário de login (SignInPanel).
 * 
 * Copie e adapte para src/modules/auth/components/ui/SingInPanel/SignInPanel.jsx
 */

import { useAuthTransitionHandler } from '@shared/hooks/useAuthTransitionHandler'
import axiosInstance from '@penelopec/axiosInstance'

/**
 * Adicionar ao topo do SignInPanel:
 */
export function SignInPanelExample() {
  const { triggerLoginTransition } = useAuthTransitionHandler()
  // ... outros states e props

  /**
   * ANTES (sem transição):
   * const handleLoginSubmit = async (credentials) => {
   *   try {
   *     const response = await axiosInstance.post('/auth/login', credentials)
   *     sessionStorage.setItem('jwtToken', response.data.token)
   *     navigate('/') // Redireciona imediatamente
   *   } catch (error) {
   *     // Mostrar erro
   *   }
   * }
   */

  /**
   * DEPOIS (com transição):
   */
  const handleLoginSubmit = async (credentials) => {
    try {
      // Opção 1: Usar o hook helper (RECOMENDADO)
      await triggerLoginTransition(async () => {
        const response = await axiosInstance.post('/auth/login', credentials)
        return {
          token: response.data.token,
          userId: response.data.userId,
          userRole: response.data.role,
          userEmail: response.data.email,
        }
      }, '/')

      // Opção 2: Manual (mais controle)
      /*
      // 1. Disparar transição visual
      window.dispatchEvent(new CustomEvent('authTransition', {
        detail: { 
          type: 'login', 
          message: 'Autenticando sua conta...' 
        }
      }))

      // 2. Fazer login
      const response = await axiosInstance.post('/auth/login', credentials)

      // 3. Aguardar um pouco para renderizar a transição
      await new Promise(resolve => setTimeout(resolve, 300))

      // 4. Salvar tokens
      sessionStorage.setItem('jwtToken', response.data.token)
      sessionStorage.setItem('userId', response.data.userId)
      sessionStorage.setItem('userRole', response.data.role)
      sessionStorage.setItem('userEmail', response.data.email)
      sessionStorage.setItem('_hadToken', 'true')

      // 5. Notificar mudança
      window.dispatchEvent(new CustomEvent('authChanged'))

      // 6. Aguardar transição terminar
      await new Promise(resolve => setTimeout(resolve, 1200))

      // 7. Redirecionar
      window.location.href = '/'
      */

    } catch (error) {
      console.error('Erro ao fazer login:', error)
      
      // Mostrar mensagem de erro ao usuário
      if (error.response?.status === 401) {
        setAlertConfig({
          type: 'error',
          message: 'Credenciais inválidas. Tente novamente.',
          onClose: handleCloseAlert,
        })
      } else {
        setAlertConfig({
          type: 'error',
          message: 'Erro ao conectar. Tente novamente mais tarde.',
          onClose: handleCloseAlert,
        })
      }
    }
  }

  /**
   * DICA: Se quiser mensagem customizada por tipo de erro:
   */
  const handleLoginSubmitWithCustomMessages = async (credentials) => {
    try {
      // Disparar transição
      window.dispatchEvent(new CustomEvent('authTransition', {
        detail: { 
          type: 'login', 
          message: 'Entrando na sua conta...' // Mensagem customizada
        }
      }))

      const response = await axiosInstance.post('/auth/login', credentials)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Salvar tokens
      sessionStorage.setItem('jwtToken', response.data.token)
      sessionStorage.setItem('userId', response.data.userId)
      sessionStorage.setItem('userRole', response.data.role)
      sessionStorage.setItem('userEmail', response.data.email)
      sessionStorage.setItem('_hadToken', 'true')
      
      window.dispatchEvent(new CustomEvent('authChanged'))
      
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      window.location.href = '/'

    } catch (error) {
      // Mostrar erro dependendo do tipo
      let errorMessage = 'Erro ao conectar. Tente novamente.'
      
      if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado.'
      } else if (error.response?.status === 429) {
        errorMessage = 'Muitas tentativas. Aguarde alguns minutos.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Conexão expirou. Tente novamente.'
      }
      
      console.error('Erro ao fazer login:', error)
      
      setAlertConfig({
        type: 'error',
        message: errorMessage,
        onClose: handleCloseAlert,
      })
    }
  }

  // ... resto do componente
}

/**
 * FLUXO VISUAL PARA USUÁRIO:
 * 
 * 1. Usuário clica em "Entrar"
 * 2. Tela de loading aparece com:
 *    - Logo pulsando
 *    - Spinner circular animado
 *    - Texto "Autenticando sua conta..."
 *    - 3 pontos animados de progresso
 * 3. Enquanto isso:
 *    - Requisição de login é feita
 *    - Tokens são salvos
 * 4. Após ~1.5 segundos, a tela desaparece
 * 5. Usuário é redirecionado para a home autenticado
 * 
 * EM CASO DE ERRO:
 * - Tela de loading desaparece após 1.5s
 * - Alerta de erro é mostrado
 * - Usuário pode tentar novamente
 */

/**
 * VERIFICAÇÃO CHECKLIST:
 * 
 * ✅ AuthTransitionView está renderizando em PageView?
 * ✅ useAuthTransitionViewModel está sendo usado?
 * ✅ Evento 'authTransition' está sendo disparado?
 * ✅ sessionStorage está sendo atualizado corretamente?
 * ✅ Evento 'authChanged' está sendo disparado?
 * ✅ Redirecionamento funciona após a transição?
 * ✅ Erro é tratado corretamente?
 */
