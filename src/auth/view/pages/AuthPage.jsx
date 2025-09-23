import { useState } from "react";
import { ButtonView as Botao } from "../../../shared/view/components/ButtonView";
import { LogoView as Logo } from "../../../shared/view/components/LogoView";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPassword";
import { Modal } from "../../../shared/view/components/Modal";
import EmailExistsPopup from "./EmailExistsPopup";
import ConfirmEmailPopup from "./ConfirmEmailPopup";
import RecoveryLinkSentPopup from "./RecoveryLinkSentPopup";

/**
 * AuthPage
 * Componente de autenticação que exibe quatro painéis:
 * - Formulário de login (esquerda)
 * - Painel de marketing / convite para cadastro (direita)
 * - Formulário de cadastro (direita)
 * - Formulário de recuperação de senha (direita)
 *
 * Os painéis deslizam horizontalmente e também fazem fade (opacidade).
 * Apenas o painel ativo é interativo (pointer-events) e recebe maior z-index
 * para ficar acima dos demais.
 *
 * Estado local:
 * - view: 'login' | 'register' | 'forgotPassword' (controla qual painel aparece)
 * - isEmailExistsModalOpen, isConfirmEmailModalOpen: boolean (controlam modais)
 */
export default function AuthPage() {
  const [view, setView] = useState('login');
  const [isEmailExistsModalOpen, setEmailExistsModalOpen] = useState(false);
  const [isConfirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);
  const [isRecoverySentModalOpen, setRecoverySentModalOpen] = useState(false);

  const handleNavigateToLogin = () => {
    setEmailExistsModalOpen(false);
    setConfirmEmailModalOpen(false);
    setRecoverySentModalOpen(false)
    setView('login');
  };

  const handleNavigateToForgotPassword = () => {
    setEmailExistsModalOpen(false);
    setView('forgotPassword');
  };

  const handleResendEmail = () => {
    alert("E-mail de confirmação reenviado!");
  };

    const handleRecoverySent = () => {
    setRecoverySentModalOpen(true);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-100">

  {/* Painel: formulário de login */}
      <div
        className={`absolute top-0 left-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-transform transition-all duration-2000  ease-in-out
          ${view === 'login' ? "translate-x-0 z-20 opacity-100 pointer-events-auto" : "-translate-x-full z-0 opacity-0 pointer-events-none"}`}>
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold text-gray-800">Acessar Conta</h2>
          <p className="mt-3 text-gray-600">Utilize seu email e senha para entrar.</p>
          <LoginForm onForgotPasswordClick={() => setView('forgotPassword')} />
        </div>
      </div>

  {/* Painel direito: convite para cadastro (exibido na view de login) */}
      <div
        className={`absolute top-0 right-0 flex h-full w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white transition-transform transition-all duration-2000  ease-in-out
          ${view === 'login' ? "translate-x-0 z-20 opacity-100 pointer-events-auto" : "translate-x-full z-0 opacity-0 pointer-events-none"}`}
      >
        <Logo className="absolute top-8 right-8 h-12 w-auto text-white" />
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold font-agh1"><span>É NOVO</span><span className="block mt-2">POR AQUI?</span></h2>
          <p className="mt-8 font-agh3">Clique abaixo e conquiste a chave do seu sonho.</p>
          <Botao onClick={() => setView("register")} className="mt-6">CADASTRAR</Botao>
        </div>
      </div>

  {/* Painel esquerdo: texto para login/voltar (usado em register e forgotPassword) */}
      <div
        className={`absolute top-0 left-0 flex h-full w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white transition-transform transition-all duration-2000  ease-in-out
          ${view === 'register' || view === 'forgotPassword' ? "translate-x-0 z-20 opacity-100 pointer-events-auto" : "-translate-x-full z-0 opacity-0 pointer-events-none"}`}
      >
        <div className="w-full max-w-md text-center">
            {view === 'register' ? (
                <>
                    <h2 className="text-4xl font-bold font-agh1"><span>SEJA</span><span className="block mt-2">BEM-VINDO!</span></h2>
                    <p className="mt-8 font-agh3">Já tem uma conta? Faça login para continuar.</p>
                </>
            ) : (
                <>
                    <h2 className="text-4xl font-bold font-agh1"><span>TRANQUILO,</span><span className="block mt-2">VAMOS TE AJUDAR</span></h2>
                    <p className="mt-8 font-agh3">Lembrou a senha? Volte para a tela de acesso.</p>
                </>
            )}
            <Botao onClick={() => setView("login")} className="mt-6">ACESSAR</Botao>
        </div>
      </div>

  {/* Painel: formulário de cadastro */}
      <div
        className={`absolute top-0 right-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-transform transition-all duration-2000  ease-in-out
          ${view === 'register' ? "translate-x-0 z-20 opacity-100 pointer-events-auto" : "translate-x-full z-0 opacity-0 pointer-events-none"}`}
      >
        <Logo className="absolute top-8 right-8 h-12 w-auto text-[#B33C8E]" />
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold text-[#B33C8E]">Criar Conta</h2>
          <p className="mt-3 text-gray-600">Preencha os campos para iniciar sua jornada.</p>
          <RegisterForm onEmailExists={() => setEmailExistsModalOpen(true)} onRegisterSuccess={() => setConfirmEmailModalOpen(true)} />
        </div>
      </div>

  {/* Painel: formulário de 'esqueci a senha' */}
      <div
        className={`absolute top-0 right-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-transform transition-all duration-2000  ease-in-out
          ${view === 'forgotPassword' ? "translate-x-0 z-20 opacity-100 pointer-events-auto" : "translate-x-full z-0 opacity-0 pointer-events-none"}`}
      >
        <Logo className="absolute top-8 right-8 h-12 w-auto text-[#B33C8E]" />
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold text-[#B33C8E]">Esqueceu a senha?</h2>
          <p className="mt-3 text-gray-600">Para recuperar, informe seu e-mail de cadastro.</p>
          <ForgotPasswordForm onRecoverySent={handleRecoverySent} />
        </div>
      </div>

      {/* MODAIS */}
      <Modal isOpen={isEmailExistsModalOpen} onClose={() => setEmailExistsModalOpen(false)}>
        <EmailExistsPopup onNavigateToLogin={handleNavigateToLogin} onNavigateToForgotPassword={handleNavigateToForgotPassword} />
      </Modal>

      <Modal isOpen={isConfirmEmailModalOpen} onClose={() => setConfirmEmailModalOpen(false)}>
        <ConfirmEmailPopup onNavigateToLogin={handleNavigateToLogin} onResendEmail={handleResendEmail} />
      </Modal>

      <Modal isOpen={isRecoverySentModalOpen} onClose={() => setRecoverySentModalOpen(false)}>
        <RecoveryLinkSentPopup onNavigateToLogin={handleNavigateToLogin} onResendEmail={handleResendEmail} />
      </Modal>

    </div>
  );
}
