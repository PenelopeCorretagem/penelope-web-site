import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ButtonView as Botao } from '../../../../src/shared/view/components/ButtonView';
import { LogoView as Logo } from '../../../../src/shared/view/components/LogoView';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Solicitação de recuperação de senha para o e-mail:', email);
    alert('Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* PAINEL ESQUERDO (TEXTO) */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white">
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-bold font-agh1 flex flex-col items-center">
            <span>TRANQUILO,</span>
          </h2>
          <p className="mt-6 text-lg">
            VAMOS TE AJUDAR, INFORME OS DADOS NECESSÁRIOS PARA RECUPERAR A SENHA.
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO (FORMULÁRIO) */}
      <div className="relative flex w-1/2 flex-col items-center justify-center bg-white p-10"> {/* 2. Adicione a classe 'relative' */}

        {/* 3. Adicione a Logo no canto superior direito */}
        <Logo className="absolute top-8 right-8 h-12 w-auto text-[#B33C8E]" />

        <div className="w-full max-w-md text-left">
          <h2 className="text-4xl font-bold text-[#B33C8E] mb-4">ESQUECEU A SENHA?</h2>
          <p className="mb-8 text-gray-600">
            Para recuperar sua senha, por favor, informe seu e-mail de cadastro.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
            />
            {/* 4. Adicione a prop variant="destac" ao botão */}
            <Botao type="submit" className="w-full" variant="default" onClick={() => {}}>
              RECUPERAR SENHA
            </Botao>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            LEMBROU A SENHA?{' '}
            <Link to="/auth" className="font-semibold text-[#B33C8E] hover:underline">
              ACESSAR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
