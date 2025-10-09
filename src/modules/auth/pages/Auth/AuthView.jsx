import { useState } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { SingInForm } from '@auth/components/ui/SingInForm/SingInForm'
import { SingUpForm } from '@auth/components/ui/SingUpForm/SingUpForm'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'

export function AuthView() {
  const [isActive, setIsActive] = useState(false)

  // ✅ Estados dos modais que faltavam
  const [_emailExistsModalOpen, setEmailExistsModalOpen] = useState(false)
  const [_confirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false)

  const handleRegisterClick = () => {
    setIsActive(true)
  }

  const handleLoginClick = () => {
    setIsActive(false)
  }

  const handleForgotPassword = () => {
    // TODO: Implementar esqueci senha
  }

  return (
    <SectionView paddingClasses='' className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className={`
        relative w-full h-full bg-brand-white  overflow-hidden
        transition-all duration-700 ease-in-out
        ${isActive ? 'active' : ''}
      `}
      >

        {/* Sign In Form */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full bg-brand-white transition-all duration-700 ease-in-out z-20 p-section md:p-section-md flex flex-col items-center justify-between"
          style={{
            transform: isActive ? 'translateX(100%)' : 'translateX(0%)',
            opacity: isActive ? 0 : 1,
            pointerEvents: isActive ? 'none' : 'auto'
          }}
        >
          <div className='w-full max-w-md text-center h-full flex flex-col justify-center items-center px-8'>
            <HeadingView level={2} color='black'>Acessar Conta</HeadingView>
            <TextView>Utilize seu email e senha para entrar.</TextView>
            <SingInForm onForgotPasswordClick={handleForgotPassword} />
          </div>

        </div>

        {/* Sign Up Form */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-brand-white transition-all duration-700 ease-in-out p-section md:p-section-md flex flex-col items-center justify-between"
          style={{
            transform: isActive ? 'translateX(0%)' : 'translateX(-100%)',
            opacity: isActive ? 1 : 0,
            zIndex: isActive ? 50 : 10
          }}
        >
          <div className='w-full flex justify-end'><LogoView colorScheme='pink' /></div>
          <div className='w-full max-w-md text-center h-full flex flex-col justify-center items-center px-8'>
            <HeadingView level={2} color='pink'>Criar Conta</HeadingView>
            <TextView>Preencha os campos para iniciar sua jornada.</TextView>
            <SingUpForm
              onEmailExists={() => setEmailExistsModalOpen(true)}
              onRegisterSuccess={() => setConfirmEmailModalOpen(true)}
            />
          </div>
        </div>

        {/* Toggle Container */}
        <div className={`
          absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-[1000]
          transition-all duration-700 ease-in-out
          ${isActive
          ? 'transform -translate-x-full' : ''
          }
        `}
        >
          <div className={`
            bg-brand-gradient h-full
            relative -left-full w-[200%] transform
            transition-all duration-700 ease-in-out
            ${isActive ? 'translate-x-1/2' : 'translate-x-0'}
          `}
          >

            {/* Toggle Left Panel */}
            <div className={`
              absolute w-1/2 h-full p-section md:p-section-md flex flex-col items-center justify-between text-center top-0
              transition-all duration-700 ease-in-out
              ${isActive ? 'transform translate-x-0' : 'transform -translate-x-[200%]'}
            `}
            >
              <div className='w-full max-w-md text-center'>
                {/* Conteúdo condicional baseado na view ativa */}

                <h2 className='font-agh1 text-4xl font-bold'>
                  <span>SEJA</span>
                  <span className='mt-2 block'>BEM-VINDO!</span>
                </h2>
                <p className='font-agh3 mt-8'>
                  Já tem uma conta? Faça login para continuar.
                </p>

                <ButtonView
                  text="Entrar"
                  variant="white"
                  type="button"
                  width="fit"
                  onClick={handleLoginClick}
                  className="bg-transparent border-2 border-white text-white px-12 py-3 text-xs font-semibold tracking-wider uppercase hover:bg-brand-white hover:text-purple-800 transition-all duration-300"
                  aria-label="Alternar para formulário de login"
                  aria-pressed={!isActive}
                />
              </div>

            </div>

            {/* Toggle Right Panel */}
            <div className={`
              absolute right-0 w-1/2 h-fullp-section md:p-section-md flex flex-col items-center justify-between text-center top-0
              transition-all duration-700 ease-in-out
              ${isActive ? 'transform translate-x-[200%]' : 'transform translate-x-0'}
            `}
            >

              <div className='w-full flex justify-end'><LogoView colorScheme='white' /></div>
              <div className='w-full max-w-md text-center'>
                <h2 className='font-agh1 text-4xl font-bold'>
                  <span>É NOVO</span>
                  <span className='mt-2 block'>POR AQUI?</span>
                </h2>
                <p className='font-agh3 mt-8'>
                  Clique abaixo e conquiste a chave do seu sonho.
                </p>
                <ButtonView
                  text="Cadastrar"
                  variant="white"
                  type="button"
                  width="fit"
                  onClick={handleRegisterClick}
                  className="bg-transparent border-2 border-white text-white px-12 py-3 text-xs font-semibold tracking-wider uppercase hover:bg-brand-white hover:text-purple-800 transition-all duration-300"
                  aria-label="Alternar para formulário de cadastro"
                  aria-pressed={isActive}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </SectionView>
  )
}
