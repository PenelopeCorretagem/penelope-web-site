import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/ui/ErrorDisplay/ErrorDisplayView'

export function SingInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate() // 2. Inicialize o hook de navegação

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  })
  const [error, setError] = useState('')

  // Atualiza os campos do formulário
  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('') // Limpa erros anteriores

    try {
      const response = await fetch('http://localhost:8081/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login bem-sucedido, token recebido:', data.token)

        // Armazena o token no localStorage
        localStorage.setItem('jwtToken', data.token)

        alert('Login bem-sucedido!')

        // Redireciona o usuário para a página principal
        navigate('/home')
      } else {
        // Se o login falhar (403 Forbidden, etc.)
        console.error('Falha no login')
        setError('E-mail ou senha inválidos.')
      }
    } catch (err) {
      // Erro de rede
      console.error('Falha na comunicação com a API:', err)
      setError('Não foi possível conectar ao servidor.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mt-8 w-full space-y-6 text-left'>
      <div>
        <input
          id='email'
          name='email'
          type='email'
          required
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-full rounded-md bg-[#E9BEDC] px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-[#B33C8E] focus:outline-none'
        />
      </div>

      <div className='relative'>
        <input
          id='password-login'
          name='senha'
          type={showPassword ? 'text' : 'password'}
          required
          placeholder='Senha'
          value={formData.senha}
          onChange={handleChange}
          className='w-full rounded-md bg-[#E9BEDC] px-4 py-3 pr-12 text-black placeholder:text-black focus:ring-2 focus:ring-[#B33C8E] focus:outline-none'
        />
        <button
          type='button'
          className='absolute inset-y-0 right-0 flex items-center pr-3'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Mensagem de erro */}
      <ErrorDisplayView
        messages={error ? [error] : []}
        position='inline'
        variant='prominent'
        className='mt-4'
      />

      <div>
        <ButtonView type='submit' className='w-full'>
          ACESSAR
        </ButtonView>
      </div>

      <p className='pt-2 text-center text-sm text-gray-600'>
        Esqueceu a senha?{' '}
        <Link
          to='/esqueci-a-senha'
          className='font-semibold text-[#B33C8E] hover:underline'
        >
          Redefinir senha
        </Link>
      </p>
    </form>
  )
}
