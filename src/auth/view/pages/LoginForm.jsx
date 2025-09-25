import React, { useState } from 'react'
import { ButtonView as Botao } from '../../../shared/view/components/ButtonView'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom' // O useNavigate será mantido para o redirecionamento pós-login

// 1. O componente recebe 'onForgotPasswordClick' em vez de 'onOpenModal'
export default function LoginForm({ onForgotPasswordClick }) {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  })
  const [error, setError] = useState('')

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8081/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login bem-sucedido, token recebido:', data.token)
        localStorage.setItem('jwtToken', data.token)
        alert('Login bem-sucedido!')
        navigate('/home') // Redireciona após o sucesso
      } else {
        console.error('Falha no login')
        setError('E-mail ou senha inválidos.')
      }
    } catch (err) {
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
          className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className='text-center text-sm text-red-500'>{error}</p>}

      <div>
        <Botao type='submit' className='w-full' onClick={() => {}}>
          ACESSAR
        </Botao>
      </div>

      <p className='pt-2 text-center text-sm text-gray-600'>
        Esqueceu a senha?{' '}
        {/* 2. Trocamos o Link de volta para um span com onClick */}
        <span
          className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
          onClick={onForgotPasswordClick}
        >
          Redefinir senha
        </span>
      </p>
    </form>
  )
}
