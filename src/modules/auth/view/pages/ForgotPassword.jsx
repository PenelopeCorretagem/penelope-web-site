import { ButtonView as Botao } from '@shared/view/components/ButtonView'
import { useState } from 'react'

export default function ForgotPasswordForm({ onRecoverySent }) {
  const [email, setEmail] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    console.log('Solicitação de recuperação de senha para o e-mail:', email)

    onRecoverySent()
  }

  return (
    <div className='flex h-full flex-col p-8 text-center'>
      <p className='mb-8 text-gray-600'>
        Digite seu e-mail abaixo e enviaremos um link para você redefinir sua
        senha.
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col gap-15'>
        <input
          type='email'
          placeholder='Seu e-mail'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className='w-full rounded-md bg-[#E9BEDC] px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-[#B33C8E] focus:outline-none'
        />
        <div className='mt-auto flex justify-center gap-6'>
          <Botao type='submit' variant='destac' onClick={() => {}}>
            RECUPERAR SENHA
          </Botao>
        </div>
      </form>
    </div>
  )
}
