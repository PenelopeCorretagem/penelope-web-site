import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView';
import { LogoView as Logo } from '../../../shared/view/components/LogoView';


export default function VerificationCodePage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setCode(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (event) => {
  event.preventDefault();
    console.log('Verificando o código:', code);
    // Em um caso real, você validaria o código com a API.
    // Se o código for válido, navegue para a próxima página.
    navigate('/nova-senha');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* PAINEL ESQUERDO (TEXTO) */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white">
        <div className="w-full max-w-lg text-center">
          <h2 className="text-4xl font-bold font-agh1 flex flex-col items-center">
            <span>PRIMEIRO,</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed">
            INFORME O CÓDIGO DE VERIFICAÇÃO QUE VOCÊ RECEBEU EM SEU E-MAIL E EM SEQUÊNCIA CLIQUE EM “VERIFICAR”.
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO (FORMULÁRIO) */}
      {/* 2. Adicione a classe 'relative' aqui */}
      <div className="relative flex w-1/2 flex-col items-center justify-center bg-white p-10">

        {/* 3. Adicione a Logo no canto superior direito com a cor rosa */}
        <Logo className="absolute top-8 right-8 h-12 w-auto text-white" />

        <div className="w-full max-w-md text-center flex flex-col space-y-12">

          <div>
            <h2 className="text-4xl font-bold text-[#B33C8E]">REDEFINIR SENHA</h2>
            <p className="mt-4 text-gray-600">
              Para recuperar sua senha, por favor, informe seu e-mail de cadastro.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <input
                id="verification-code"
                name="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="CÓDIGO DE VERIFICAÇÃO"
                className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
              />
              <Botao type="submit" className="w-full" variant="destac" onClick={() => {}}>
                VERIFICAR
              </Botao>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
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
