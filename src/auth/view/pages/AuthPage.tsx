import { useState } from "react";
// Seus componentes customizados importados
import { ButtonView as Botao } from "../../../../src/shared/view/components/ButtonView";
import {LogoView as Logo} from "../../../../src/shared/view/components/LogoView";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import { Modal } from "../../../../src/shared/view/components/Modal";
import ForgotPasswordForm from "../pages/ForgotPassword";
import EmailExistsPopup from "./EmailExistsPopup";
import ConfirmEmailPopup from "./ConfirmEmailPopup";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailExistsModalOpen, setEmailExistsModalOpen] = useState(false);
  const [isConfirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);


  // Função para o link "ACESSAR" do pop-up
  const handleNavigateToLogin = () => {
    setEmailExistsModalOpen(false); // Fecha o pop-up atual
    setConfirmEmailModalOpen(false);
    setIsLogin(true); // Mostra a tela de login
  };

  // Função para o link "REDEFINIR SENHA" do pop-up
  const handleNavigateToForgotPassword = () => {
    setEmailExistsModalOpen(false); // Fecha o pop-up atual
  };

    // Função para simular o reenvio de e-mail
  const handleResendEmail = () => {
    // Na vida real, aqui você faria uma chamada de API
    console.log('Simulando reenvio de e-mail...');
    alert('E-mail de confirmação reenviado!'); // Feedback simples para o usuário
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-100">

      {/* PAINEL DE FORMULÁRIO DE LOGIN (Lado Esquerdo Inicial) */}
      <div
        className={`
          relative
          absolute top-0 left-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10
          transition-transform duration-700 ease-in-out
          ${isLogin ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold text-gray-800">Acessar Conta</h2>
          <p className="mt-3 text-gray-600">
            Utilize seu email e senha para entrar.
          </p>
          <LoginForm />
        </div>
      </div>

      {/* PAINEL DE TEXTO PARA CADASTRO (Lado Direito Inicial) */}
      <div
        className={`
          absolute top-0 right-0 flex h-full w-1/2 flex-col items-center justify-center
          bg-gradient-to-b from-[#B33C8E] to-[#36221D] p-10 text-white
          transition-transform duration-700 ease-in-out
          ${isLogin ? "translate-x-0" : "translate-x-full"}
        `}
      >

        <Logo className="absolute top-8 right-8 h-12 w-auto text-white" />

        <div className="w-full max-w-md text-center">
          {/* TÍTULO ESTILIZADO E DIVIDIDO */}
          <h2 className="text-4xl font-bold w-[400px] mx-auto flex flex-col items-center font-agh1">
            <span>É NOVO</span>
            <span>POR AQUI?</span>
          </h2>

          {/* PARÁGRAFO ESTILIZADO E DIVIDIDO COM ESPAÇAMENTO */}
          <p className="mt-[50px] w-[439px] h-[130px] mx-auto flex flex-col items-center justify-center">
            <span className="font-agh3">Então, clique no botão abaixo</span>
            <span className="font-agh3">e conquiste a chave do seu sonho.</span>
          </p>

          <Botao
            onClick={() => setIsLogin(false)}
            className="mt-6"
          >
            CADASTRAR
          </Botao>
        </div>
      </div>

      {/* PAINEL DE TEXTO PARA LOGIN (Aparece no Lado Esquerdo) */}
    <div
      className={`
        absolute top-0 left-0 flex h-full w-1/2 flex-col items-center justify-center
        bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white
        transition-transform duration-700 ease-in-out
        ${isLogin ? "-translate-x-full" : "translate-x-0"}
      `}
    >
      <div className="w-full max-w-md text-center">

        <h2 className="text-4xl font-bold w-[400px] mx-auto flex flex-col items-center font-agh1">
          <span>SEJA</span>
          <span>BEM-VINDO!</span>
        </h2>

        <p className="mt-[50px] w-[439px] h-[130px] mx-auto flex flex-col items-center justify-center">
          <span className="font-agh2">Já tem uma conta?</span>
          <span className="font-agh3">Faça login para continuar.</span>
        </p>

        <Botao
          onClick={() => setIsLogin(true)}
          className="mt-6">ACESSAR
        </Botao>
      </div>
    </div>

    {/* PAINEL DE FORMULÁRIO DE CADASTRO (Aparece no Lado Direito) */}
      <div
        className={`
          relative
          absolute top-0 right-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10
          transition-transform duration-700 ease-in-out
          ${isLogin ? "translate-x-full" : "translate-x-0"}
        `}
      >
        <Logo className="absolute top-8 right-8 h-12 w-auto text-[#B33C8E]" />
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold text-[#B33C8E]">Criar Conta</h2>
          <p className="mt-3 text-gray-600">
            Preencha os campos para iniciar sua jornada.
          </p>
          <RegisterForm
            onEmailExists={() => setEmailExistsModalOpen(true)}
            onRegisterSuccess={() => setConfirmEmailModalOpen(true)}
          />
        </div>
      </div>

       {/* ===== MODAIS RENDERIZADOS AQUI (POR CIMA DE TUDO) ===== */}

       {/* Modal de E-mail Existente */}
      <Modal isOpen={isEmailExistsModalOpen} onClose={() => setEmailExistsModalOpen(false)}>
        <EmailExistsPopup
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToForgotPassword={handleNavigateToForgotPassword}
        />
      </Modal>

      {/* Modal de Confirmação de E-mail */}
      <Modal isOpen={isConfirmEmailModalOpen} onClose={() => setConfirmEmailModalOpen(false)}>
        <ConfirmEmailPopup
          onNavigateToLogin={handleNavigateToLogin}
          onResendEmail={handleResendEmail}
        />
      </Modal>
    </div>
  );
}
