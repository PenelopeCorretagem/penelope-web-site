import { useState } from 'react'
import { ButtonView as Botao } from '@shared/components/ui/Button/ButtonView'
import { LogoView as Logo } from '@shared/view/components/LogoView'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import ForgotPasswordForm from './ForgotPassword'
import { Modal } from '@shared/view/components/Modal'
import EmailExistsPopup from './EmailExistsPopup'
import ConfirmEmailPopup from './ConfirmEmailPopup'
import RecoveryLinkSentPopup from './RecoveryLinkSentPopup'

/**
 * AuthPage - Componente Principal de Autenticação
 *
 * Este componente gerencia toda a interface de autenticação da aplicação,
 *
 * ================================
 * ARQUITETURA E FUNCIONAMENTO
 * ================================
 *
 * O componente utiliza um sistema de 4 painéis sobrepostos que deslizam
 * horizontalmente para criar transições visuais suaves:
 *
 * 1. **Painel de Login** (esquerda) - Formulário de acesso
 * 2. **Painel de Marketing** (direita) - Convite para cadastro
 * 3. **Painel de Welcome** (esquerda) - Convite para login
 * 4. **Painéis de Forms** (direita) - Cadastro e recuperação de senha
 *
 * ================================
 * SISTEMA DE TRANSIÇÕES
 * ================================
 *
 * As transições funcionam através de:
 * - **Posicionamento**: cada painel tem posição fixa (left/right: 0%)
 * - **Transform**: translate-x para criar o movimento de deslizamento
 * - **Z-index**: controla qual painel fica visível/interativo
 * - **Opacity**: cria efeito de fade durante as transições
 * - **Pointer-events**: desabilita interação em painéis inativos
 *
 * Estados de transição:
 * - **Ativo**: translate-x-0, z-20, , pointer-events-auto
 * - **Inativo**: translate-x-full/-translate-x-full, z-10, , pointer-events-none
 *
 * ================================
 * ESTADOS E VIEWS
 * ================================
 *
 * @typedef {'login' | 'register' | 'forgotPassword'} ViewState
 *
 * - **login**: Exibe formulário de login + painel de marketing
 * - **register**: Exibe painel de welcome + formulário de cadastro
 * - **forgotPassword**: Exibe painel de welcome + formulário de recuperação
 *
 * ================================
 * MODAIS E POPUPS
 * ================================
 *
 * O componente gerencia 3 modais para diferentes cenários:
 * - **EmailExistsPopup**: Quando email já existe no cadastro
 * - **ConfirmEmailPopup**: Após cadastro bem-sucedido
 * - **RecoveryLinkSentPopup**: Após envio de link de recuperação
 *
 * ================================
 */
export default function AuthPage() {
  /**
   * Estado principal que controla qual view está ativa
   */
  const [view, setView] = useState('login')

  /**
   * Controla a visibilidade do modal de email já existente
   */
  const [isEmailExistsModalOpen, setEmailExistsModalOpen] = useState(false)

  /**
   * Controla a visibilidade do modal de confirmação de email
   */
  const [isConfirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false)

  /**
   * Controla a visibilidade do modal de link de recuperação enviado
   */
  const [isRecoverySentModalOpen, setRecoverySentModalOpen] = useState(false)

  // ================================
  // HANDLERS DE NAVEGAÇÃO
  // ================================

  /**
   * Navega para a tela de login e fecha todos os modais abertos.
   * Utilizado como callback pelos popups para retornar ao login.
   */
  const handleNavigateToLogin = () => {
    setEmailExistsModalOpen(false)
    setConfirmEmailModalOpen(false)
    setRecoverySentModalOpen(false)
    setView('login')
  }

  /**
   * Navega para a tela de recuperação de senha e fecha o modal de email existente.
   * Utilizado quando o usuário confirma que já tem uma conta e esqueceu a senha.
   */
  const handleNavigateToForgotPassword = () => {
    setEmailExistsModalOpen(false)
    setView('forgotPassword')
  }

  /**
   * Simula o reenvio de email de confirmação.
   * TODO: Implementar integração com API de email.
   */
  const handleResendEmail = () => {
    alert('E-mail de confirmação reenviado!')
  }

  /**
   * Handler executado quando o link de recuperação é enviado com sucesso.
   * Abre o modal de confirmação de envio.
   */
  const handleRecoverySent = () => {
    setRecoverySentModalOpen(true)
  }

  // ================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ================================

  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-100'>
      {/* ================================
          PAINEL: FORMULÁRIO DE LOGIN
          ================================

          Posicionado à esquerda, contém o formulário de acesso.
          Visível apenas na view 'login'.

          Estados:
          - Ativo (login): translate-x-0, totalmente visível e interativo
          - Inativo: translate-x-full, desliza para direita e fica semi-transparente
      */}
      <div
        className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-all duration-700 ease-in-out ${
          view === 'login'
            ? 'pointer-events-auto z-20 translate-x-0'
            : 'pointer-events-none z-10 translate-x-full'
        }`}
        style={{ left: '0%' }}
      >
        <div className='w-full max-w-md text-center'>
          <h2 className='text-4xl font-bold text-gray-800'>Acessar Conta</h2>
          <p className='mt-3 text-gray-600'>
            Utilize seu email e senha para entrar.
          </p>
          <LoginForm onForgotPasswordClick={() => setView('forgotPassword')} />
        </div>
      </div>

      {/* ================================
          PAINEL: MARKETING/CONVITE PARA CADASTRO
          ================================

          Posicionado à direita, convida usuários a se cadastrarem.
          Visível apenas na view 'login'.
          Contém gradiente da marca e call-to-action para cadastro.

          Estados:
          - Ativo (login): translate-x-0, totalmente visível e interativo
          - Inativo: -translate-x-full, desliza para esquerda e fica semi-transparente
      */}
      <div
        className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white transition-all duration-700 ease-in-out ${
          view === 'login'
            ? 'pointer-events-auto z-20 translate-x-0'
            : 'pointer-events-none z-10 -translate-x-full'
        }`}
        style={{ right: '0%' }}
      >
        <Logo className='absolute top-8 right-8 h-12 w-auto text-white' />
        <div className='w-full max-w-md text-center'>
          <h2 className='font-agh1 text-4xl font-bold'>
            <span>É NOVO</span>
            <span className='mt-2 block'>POR AQUI?</span>
          </h2>
          <p className='font-agh3 mt-8'>
            Clique abaixo e conquiste a chave do seu sonho.
          </p>
          <Botao onClick={() => setView('register')} className='mt-6'>
            CADASTRAR
          </Botao>
        </div>
      </div>

      {/* ================================
          PAINEL: WELCOME/CONVITE PARA LOGIN
          ================================

          Posicionado à esquerda, convida usuários a fazerem login.
          Visível nas views 'register' e 'forgotPassword'.
          Conteúdo dinâmico baseado na view ativa.

          Estados:
          - Ativo (register/forgotPassword): translate-x-0, totalmente visível e interativo
          - Inativo: -translate-x-full, desliza para esquerda e fica semi-transparente
      */}
      <div
        className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white transition-all duration-700 ease-in-out ${
          view === 'register' || view === 'forgotPassword'
            ? 'pointer-events-auto z-20 translate-x-0'
            : 'pointer-events-none z-10 -translate-x-full'
        }`}
        style={{ left: '0%' }}
      >
        <div className='w-full max-w-md text-center'>
          {/* Conteúdo condicional baseado na view ativa */}
          {view === 'register' ? (
            <>
              <h2 className='font-agh1 text-4xl font-bold'>
                <span>SEJA</span>
                <span className='mt-2 block'>BEM-VINDO!</span>
              </h2>
              <p className='font-agh3 mt-8'>
                Já tem uma conta? Faça login para continuar.
              </p>
            </>
          ) : (
            <>
              <h2 className='font-agh1 text-4xl font-bold'>
                <span>TRANQUILO,</span>
                <span className='mt-2 block'>VAMOS TE AJUDAR</span>
              </h2>
              <p className='font-agh3 mt-8'>
                Lembrou a senha? Volte para a tela de acesso.
              </p>
            </>
          )}
          <Botao onClick={() => setView('login')} className='mt-6'>
            ACESSAR
          </Botao>
        </div>
      </div>

      {/* ================================
          PAINEL: FORMULÁRIO DE CADASTRO
          ================================

          Posicionado à direita, contém o formulário de registro.
          Visível apenas na view 'register'.

          Callbacks:
          - onEmailExists: Abre modal quando email já existe
          - onRegisterSuccess: Abre modal de confirmação após cadastro bem-sucedido
      */}
      <div
        className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-all duration-700 ease-in-out ${
          view === 'register'
            ? 'pointer-events-auto z-20 translate-x-0'
            : 'pointer-events-none z-10 translate-x-full'
        }`}
        style={{ right: '0%' }}
      >
        <Logo className='absolute top-8 right-8 h-12 w-auto text-[#B33C8E]' />
        <div className='w-full max-w-md text-center'>
          <h2 className='text-4xl font-bold text-[#B33C8E]'>Criar Conta</h2>
          <p className='mt-3 text-gray-600'>
            Preencha os campos para iniciar sua jornada.
          </p>
          <RegisterForm
            onEmailExists={() => setEmailExistsModalOpen(true)}
            onRegisterSuccess={() => setConfirmEmailModalOpen(true)}
          />
        </div>
      </div>

      {/* ================================
          PAINEL: FORMULÁRIO DE RECUPERAÇÃO DE SENHA
          ================================

          Posicionado à direita, contém o formulário de recuperação.
          Visível apenas na view 'forgotPassword'.

          Callback:
          - onRecoverySent: Executado quando link de recuperação é enviado
      */}
      <div
        className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-all duration-700 ease-in-out ${
          view === 'forgotPassword'
            ? 'pointer-events-auto z-20 translate-x-0'
            : 'pointer-events-none z-10 translate-x-full'
        }`}
        style={{ right: '0%' }}
      >
        <Logo className='absolute top-8 right-8 h-12 w-auto text-[#B33C8E]' />
        <div className='w-full max-w-md text-center'>
          <h2 className='text-4xl font-bold text-[#B33C8E]'>
            Esqueceu a senha?
          </h2>
          <p className='mt-3 text-gray-600'>
            Para recuperar, informe seu e-mail de cadastro.
          </p>
          <ForgotPasswordForm onRecoverySent={handleRecoverySent} />
        </div>
      </div>

      {/* ================================
          SISTEMA DE MODAIS
          ================================

          Gerencia os diferentes popups que podem aparecer durante
          o fluxo de autenticação. Todos utilizam o componente Modal
          compartilhado para consistência visual.
      */}

      {/* Modal: Email já existe no sistema */}
      <Modal
        isOpen={isEmailExistsModalOpen}
        onClose={() => setEmailExistsModalOpen(false)}
      >
        <EmailExistsPopup
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToForgotPassword={handleNavigateToForgotPassword}
        />
      </Modal>

      {/* Modal: Confirmação de cadastro - verificar email */}
      <Modal
        isOpen={isConfirmEmailModalOpen}
        onClose={() => setConfirmEmailModalOpen(false)}
      >
        <ConfirmEmailPopup
          onNavigateToLogin={handleNavigateToLogin}
          onResendEmail={handleResendEmail}
        />
      </Modal>

      {/* Modal: Link de recuperação enviado */}
      <Modal
        isOpen={isRecoverySentModalOpen}
        onClose={() => setRecoverySentModalOpen(false)}
      >
        <RecoveryLinkSentPopup
          onNavigateToLogin={handleNavigateToLogin}
          onResendEmail={handleResendEmail}
        />
      </Modal>
    </div>
  )
}
