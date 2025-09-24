import React from 'react';

export default function RecoveryLinkSentPopup({ onNavigateToLogin, onResendEmail }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-800">

      <h2 className="font-poppins text-4xl font-bold">
        Você receberá em breve uma mensagem com as instruções para redefinir sua senha.
      </h2>

      <div className="mt-8 text-base">
        <p>
          NÃO RECEBEU O E-MAIL?{' '}
          <span
            className="font-semibold text-[#B33C8E] hover:underline cursor-pointer"
            onClick={onResendEmail}
          >
            REENVIAR
          </span>
        </p>
        <p className="mt-4">
          JÁ REDEFINIU A SENHA?{' '}
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
