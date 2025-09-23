import React from 'react';
import { Link } from 'react-router-dom';

// 2. Remova a prop 'onNavigateToForgotPassword'
export default function EmailExistsPopup({ onNavigateToLogin }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-800">
      <h2 className="font-poppins text-4xl font-bold">
        O E-MAIL INFORMADO JÁ ESTÁ CADASTRADO NO NOSSO SISTEMA.
      </h2>
      <div className="mt-8 text-base">
        <p>
          ESQUECEU A SENHA?{' '}
          {/* 3. Use o Link para navegar */}
          <Link to="/esqueci-a-senha" className="font-semibold text-[#B33C8E] hover:underline cursor-pointer">
            REDEFINIR SENHA
          </Link>
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
