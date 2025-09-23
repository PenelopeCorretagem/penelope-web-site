import React, { useState } from 'react';
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView';
import { Eye, EyeOff } from 'lucide-react';

// A anotação de tipo foi removida
export default function RegisterForm({ onEmailExists, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  // A anotação de tipo do 'event' foi removida
  const handleSubmit = (event) => {
    event.preventDefault();

    // Simulação de API
    if (email === 'teste@email.com') {
      onEmailExists();
      return;
    }

    // Simulação de sucesso
    onRegisterSuccess();
    console.log('Formulário de cadastro enviado com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 space-y-6 text-left">
      <div>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nome Completo"
          className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
      </div>
      <div>
        <input
          id="email-register"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
      </div>

      <div className="relative">
        <input
          id="password-register"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="Senha"
          className="w-full px-4 py-3 pr-12 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div>
        <Botao
          type="submit"
          className="w-full mt-4"
          onClick={() => {}}
        >
          CADASTRAR
        </Botao>
      </div>
    </form>
  );
}
