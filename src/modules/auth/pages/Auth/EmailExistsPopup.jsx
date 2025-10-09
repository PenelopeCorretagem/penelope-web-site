import { Link } from 'react-router-dom'

// 2. Remova a prop 'onNavigateToForgotPassword'
export default function EmailExistsPopup({ onNavigateToLogin }) {
  return (
    <div className='flex h-full flex-col items-center justify-center p-8 text-center text-gray-800'>
      <h2 className='font-poppins text-4xl font-bold'>
        O E-MAIL INFORMADO JÁ ESTÁ CADASTRADO NO NOSSO SISTEMA.
      </h2>
      <div className='mt-8 text-base'>
        <p>
          ESQUECEU A SENHA? {/* 3. Use o Link para navegar */}
          <Link
            to='/esqueci-a-senha'
            className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
          >
            REDEFINIR SENHA
          </Link>
        </p>
        <p className='mt-4'>
          LEMBROU?{' '}
          <span
            className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
            onClick={onNavigateToLogin}
          >
            ACESSAR
          </span>
        </p>
      </div>
    </div>
  )
}
