import React, { useState } from 'react';
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm({ onEmailExists, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cadastro realizado com sucesso:', data);
        onRegisterSuccess();
      } else {
        const errorData = await response.json();
        console.error('Erro no cadastro:', errorData);

        if (response.status === 409) {
          onEmailExists();
        } else {
          const errorMessage = Object.values(errorData).join(', ');
          setError(errorMessage);
          alert(`Erro: ${errorMessage}`);
        }
      }
    } catch (err) {
      console.error('Falha na comunicação com a API:', err);
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
      alert('Não foi possível conectar ao servidor.');
    }
  };

  // O return deve vir DEPOIS da definição de todas as suas funções e estados
  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 space-y-6 text-left">
      <div>
        <input
          id="name"
          name="nomeCompleto" // Corrigido para 'nomeCompleto'
          type="text"
          required
          placeholder="Nome Completo"
          value={formData.nomeCompleto} // Conectado ao estado
          onChange={handleChange} // Usa a função genérica
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
          value={formData.email} // Conectado ao estado
          onChange={handleChange} // Usa a função genérica
          className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
      </div>
      <div className="relative">
        <input
          id="password-register"
          name="senha" // Corrigido para 'senha'
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="Senha"
          value={formData.senha} // Conectado ao estado
          onChange={handleChange} // Usa a função genérica
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
