import { Link } from 'react-router-dom'
import { ButtonView as Botao } from '@shared/view/components/ButtonView'
import { LogoView as Logo } from '@shared/view/components/LogoView'
import { Modal } from '@shared/view/components/Modal'
import PasswordChangedPopup from './PasswordChangedPopup'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function CreateNewPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }
    console.log('Nova senha definida:', newPassword)
    // Em um caso real, aqui você chamaria a API para salvar a nova senha.
    // Após o sucesso da API, abra o modal.
    setSuccessModalOpen(true)
  }

  return (
    <div className='flex h-screen w-full overflow-hidden'>
      {/* PAINEL ESQUERDO (TEXTO) */}
      <div className='flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#B33C8E] to-[#36221D] p-10 text-white'>
        <div className='w-full max-w-lg text-center'>
          <h2 className='font-agh1 flex flex-col items-center text-4xl font-bold'>
            <span>AGORA,</span>
          </h2>
          <p className='mt-6 text-lg leading-relaxed'>
            VAMOS TE AJUDAR, INFORME SUA NOVA SENHA E CLIQUE NO BOTÃO “REDEFINIR
            SENHA”.
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO (FORMULÁRIO) */}
      <div className='relative flex w-1/2 flex-col items-center justify-center bg-white p-10'>
        <Logo className='absolute top-8 right-8 h-12 w-auto text-[#B33C8E]' />
        <div className='w-full max-w-md text-center'>
          <h2 className='mb-8 text-4xl font-bold text-[#B33C8E]'>
            REDEFINIR SENHA
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='relative'>
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder='NOVA SENHA'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className='w-full rounded-md bg-[#E9BEDC] px-4 py-3 pr-12 text-black placeholder:text-black focus:ring-2 focus:ring-[#B33C8E] focus:outline-none'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600'
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='CONFIRMAÇÃO SENHA'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className='w-full rounded-md bg-[#E9BEDC] px-4 py-3 pr-12 text-black placeholder:text-black focus:ring-2 focus:ring-[#B33C8E] focus:outline-none'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Botao
              type='submit'
              className='w-full'
              variant='destac'
              onClick={() => {}}
            >
              REDEFINIR SENHA
            </Botao>
          </form>

          <p className='mt-8 text-center text-sm text-gray-600'>
            LEMBROU A SENHA?{' '}
            <Link
              to='/auth'
              className='font-semibold text-[#B33C8E] hover:underline'
            >
              ACESSAR
            </Link>
          </p>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      >
        <PasswordChangedPopup />
      </Modal>
    </div>
  )
}
