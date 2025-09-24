import React, { useState } from 'react';
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * LoginForm
 * Componente de formulário de login.
 *
 * Responsabilidades:
 * - coletar email e senha do usuário
 * - enviar requisição POST para /api/v1/login
 * - armazenar o token JWT no localStorage em caso de sucesso
 * - redirecionar o usuário para a rota '/home'
 * - exibir mensagens de erro em caso de falha de autenticação ou problema de conexão
 *
 * Estado local:
 * - formData: { email, senha }
 * - showPassword: boolean (mostrar/ocultar senha)
 * - error: string (mensagem de erro exibida ao usuário)
 *
 * Efeitos colaterais:
 * - chamada fetch ao backend
 * - escrita em localStorage (jwtToken)
 */
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 2. Inicialize o hook de navegação

  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');

  // Atualiza os campos do formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      const response = await fetch('http://localhost:8081/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido, token recebido:', data.token);

          // Armazena o token no localStorage
        localStorage.setItem('jwtToken', data.token);

        alert('Login bem-sucedido!');

  // Redireciona o usuário para a página principal
  navigate('/home');

      } else {
        // Se o login falhar (403 Forbidden, etc.)
        console.error('Falha no login');
        setError('E-mail ou senha inválidos.');
      }
    } catch (err) {
      // Erro de rede
      console.error('Falha na comunicação com a API:', err);
      setError('Não foi possível conectar ao servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 space-y-6 text-left">
      <div>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
      </div>

      <div className="relative">
        <input
          id="password-login"
          name="senha"
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          className="w-full px-4 py-3 pr-12 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Mensagem de erro (quando existir) */}
      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <div>
        <Botao type="submit" className="w-full">
          ACESSAR
        </Botao>
      </div>

      <p className="text-center text-sm text-gray-600 pt-2">
        Esqueceu a senha?{' '}
        <Link to="/esqueci-a-senha" className="font-semibold text-[#B33C8E] hover:underline">
          Redefinir senha
        </Link>
      </p>
    </form>
  );
}
