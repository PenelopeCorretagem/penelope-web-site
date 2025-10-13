import { useState } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/ui/ErrorDisplay/ErrorDisplayView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { InputView } from '@shared/components/ui/Input/InputView'

export function SignUpForm({ onEmailExists, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    nomeCompleto: '',
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
      const response = await fetch('http://localhost:8081/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Cadastro realizado com sucesso:', data)
        onRegisterSuccess()
      } else {
        const errorData = await response.json()
        console.error('Erro no cadastro:', errorData)

        if (response.status === 409) {
          onEmailExists()
        } else {
          const errorMessage = Object.values(errorData).join(', ')
          setError(errorMessage)
          alert(`Erro: ${errorMessage}`)
        }
      }
    } catch (err) {
      console.error('Falha na comunicação com a API:', err)
      setError(
        'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
      )
      alert('Não foi possível conectar ao servidor.')
    }
  }

  // O return deve vir DEPOIS da definição de todas as suas funções e estados
  return (
    <form onSubmit={handleSubmit} className='mt-8 w-full space-y-6 text-left'>

      <InputView
        id="name-register"
        name="nomeCompleto"
        value={formData.nomeCompleto}
        onChange={handleChange}
        type={'text'}
        placeholder="Nome Completo:"
        hasLabel={false}
        required={true}
        showPasswordToggle={false}
      />

      <InputView
        id="email-register"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type={'email'}
        placeholder="E-mail:"
        hasLabel={false}
        required={true}
        showPasswordToggle={true}
      />

      <InputView
        id="password-register"
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
        Cadastrar
      </ButtonView>

    </form>
  )
}
