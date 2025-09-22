import React from 'react';

type EmailExistsPopupProps = {
  onNavigateToLogin: () => void;
  onNavigateToForgotPassword: () => void;
};

export default function EmailExistsPopup({ onNavigateToLogin, onNavigateToForgotPassword }: EmailExistsPopupProps) {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-800">

      <h2 className="font-poppins text-9x1 font-bold">
        O E-MAIL INFORMADO JÁ ESTÁ CADASTRADO NO NOSSO SISTEMA.
      </h2>

      <div className="mt-8 text-base">
        <p>
          ESQUECEU A SENHA?{' '}
          <span
            className="font-semibold text-[#B33C8E] hover:underline cursor-pointer"
            onClick={onNavigateToForgotPassword}
          >
            REDEFINIR SENHA
          </span>
        </p>
        <p className="mt-4">
          LEMBROU?{' '}
          <span
            className="font-semibold text-[#B33C8E] hover:underline cursor-pointer"
            onClick={onNavigateToLogin}
          >
            ACESSAR
          </span>
        </p>
      </div>

    </div>
  );
}
