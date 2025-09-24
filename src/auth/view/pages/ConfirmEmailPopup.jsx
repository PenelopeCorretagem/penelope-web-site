import React from 'react';

// As anotações de tipo foram removidas
export default function ConfirmEmailPopup({ onNavigateToLogin, onResendEmail }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-800">

      {/* Mensagem principal de sucesso */}
      <h2 className="font-poppins text-4xl font-bold">
        Enviamos um e-mail de confirmação, por favor, valide seu cadastro!
      </h2>

      {/* Ações para o usuário */}
      <div className="mt-8 text-base">
        <p>
          NÃO RECEBEU O E-MAIL?{' '}
          <span
            className="font-semibold text-[#B33C8E] hover:underline cursor-pointer"
            onClick={onResendEmail} // Aciona a função de reenviar
          >
            REENVIAR
          </span>
        </p>
        <p className="mt-4">
          JÁ CONFIRMOU?{' '}
          <span
            className="font-semibold text-[#B33C8E] hover:underline cursor-pointer"
            onClick={onNavigateToLogin} // Leva o usuário para a tela de login
          >
            ACESSAR
          </span>
        </p>
      </div>

    </div>
  );
}
