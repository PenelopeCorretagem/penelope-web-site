import React, { useState } from 'react';
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Formulário de login enviado!');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 space-y-6 text-left">
      <div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
      </div>

      {/* 1. Adicione a classe 'relative' a esta div que envolve o input e o botão */}
      <div className="relative">
        <input
          id="password-login"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          placeholder="Senha"
          // 2. Adicione padding à direita (pr-12) para dar espaço ao ícone
          className="w-full px-4 py-3 pr-12 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
        <button
          type="button"
          // 3. Este botão agora se posicionará corretamente dentro da div 'relative'
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div>
        <Botao
          type="submit"
          className="w-full"
          onClick={() => {}}
        >
          ACESSAR
        </Botao>
      </div>

 <p className="text-center text-sm text-gray-600 pt-2">
        Esqueceu a senha?{' '}
        {/* 4. Troque o 'span' por um componente 'Link' */}
        <Link to="/esqueci-a-senha" className="font-semibold text-[#B33C8E] hover:underline">
          Redefinir senha
        </Link>
      </p>
    </form>
  );
}
