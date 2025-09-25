import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView';

export default function PasswordChangedPopup() {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    // A função de navegação agora é controlada aqui dentro
    navigate('/auth');
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-800">
      <h2 className="font-poppins text-4xl font-bold">
        Senha alterada com sucesso!
      </h2>
      <div className="mt-8">
        <Botao variant="destac" onClick={handleNavigateToLogin}>
          IR PARA O LOGIN
        </Botao>
      </div>
    </div>
  );
}
