import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/ui/ErrorDisplay/ErrorDisplayView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function SignInForm() {

  const navigate = useNavigate()

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
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6 items-center'>
      <HeadingView level={2} color='black' className='text-center'>Acessar Conta</HeadingView>
      <TextView>Utilize seu email e senha para entrar.</TextView>

      <InputView
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type={'email'}
        placeholder="E-mail:"
        hasLabel={false}
        required={true}
      />

      <InputView
        id="password-login"
        name="senha"
        value={formData.senha}
        onChange={handleChange}
        type={'password'}
        placeholder="Senha:"
        hasLabel={false}
        required={true}
        showPasswordToggle={true}
      />

      <ErrorDisplayView
        messages={error ? [error] : []}
        position='inline'
        variant='prominent'
        className='mt-4'
      />

      <ButtonView type='submit' width='full'>
        Acessar
      </ButtonView>

      <TextView className='text-brand-gray flex gap-1 items-center justify-center'>
        Esqueceu a senha?
        <Link
          to='/esqueci-senha'
          className='font-semibold text-brand-pink hover:underline'
        >
          Redefinir senha
        </Link>
      </TextView>
    </form>
  )
}
