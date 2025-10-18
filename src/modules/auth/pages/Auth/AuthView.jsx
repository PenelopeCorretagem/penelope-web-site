import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { FormView } from '@shared/components/ui/Form/FormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ArrowBackView } from '@shared/components/ui/ArrowBack/ArrowBackView'
import { useAuthViewModel } from './useAuthViewModel'

export function AuthView() {
  const {
    // Estado
    isActive,
    isForgotPassword,

    // Handlers
    handleRegisterClick,
    handleLoginClick,
    handleForgotPasswordClick,
    handleBackToLogin,
    handleSubmit,
    handleForgotPasswordSubmit,

    // Configurações de estilo
    getContainerClasses,
    getSignInPanelStyles,
    getSignUpPanelStyles,
    getToggleContainerClasses,
    getGradientClasses,
    getLeftPanelClasses,
    getRightPanelClasses,

    // Dados do modelo
    signInFormConfig,
    signUpFormConfig,
    forgotPasswordFormConfig,
    leftPanelContent,
    rightPanelContent
  } = useAuthViewModel()

  const containerClasses = getContainerClasses()
  const toggleContainerClasses = getToggleContainerClasses()
  const gradientClasses = getGradientClasses()
  const leftPanelClasses = getLeftPanelClasses()
  const rightPanelClasses = getRightPanelClasses()

  return (
    <SectionView paddingClasses='' className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className={`${containerClasses.base} ${containerClasses.active}`}>

        {/* Sign In Form */}
        <div
          className="absolute top-0 left-0 w-3/5 h-full bg-brand-white z-20 p-section md:p-section-md flex flex-col items-center justify-center"
          style={getSignInPanelStyles()}
        >
          <div className="flex justify-start w-full">
            <ArrowBackView />
          </div>
          <div className="flex-1 flex flex-col w-full items-center justify-center gap-subsection md:gap-subsection-md">
            <FormView
              title={signInFormConfig.title}
              subtitle={signInFormConfig.subtitle}
              fields={signInFormConfig.fields}
              submitText={signInFormConfig.submitText}
              onSubmit={handleSubmit}
            />
            <TextView className='text-brand-dark-gray flex gap-1 items-center justify-center'>
              Esqueceu a senha?
              <button
                onClick={handleForgotPasswordClick}
                className='font-semibold text-brand-pink hover:underline bg-transparent border-none cursor-pointer'
              >
                Redefinir senha
              </button>
            </TextView>
          </div>
        </div>

        {/* Sign Up Form / Forgot Password Form */}
        <div
          className="absolute top-0 right-0 w-3/5 h-full bg-brand-white p-section md:p-section-md flex flex-col"
          style={getSignUpPanelStyles()}
        >
          <div className="flex justify-end">
            <LogoView colorScheme="pink" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            {isForgotPassword ? (
              <div className="w-full">
                <FormView
                  title={forgotPasswordFormConfig.title}
                  subtitle={forgotPasswordFormConfig.subtitle}
                  fields={forgotPasswordFormConfig.fields}
                  submitText={forgotPasswordFormConfig.submitText}
                  onSubmit={handleForgotPasswordSubmit}
                />
                <TextView className='text-brand-dark-gray flex gap-1 items-center justify-center mt-6'>
                  Lembrou a senha?
                  <button
                    onClick={handleBackToLogin}
                    className='font-semibold text-brand-pink hover:underline bg-transparent border-none cursor-pointer'
                  >
                    Acessar
                  </button>
                </TextView>
              </div>
            ) : (
              <FormView
                title={signUpFormConfig.title}
                subtitle={signUpFormConfig.subtitle}
                fields={signUpFormConfig.fields}
                submitText={signUpFormConfig.submitText}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>

        {/* Toggle Container */}
        <div className={`${toggleContainerClasses.base} ${toggleContainerClasses.transform}`}>
          <div className={`${gradientClasses.base} ${gradientClasses.transform}`}>

            {/* Toggle Left Panel */}
            <div className={`${leftPanelClasses.base} ${leftPanelClasses.transform}`}>
              <div className="flex justify-start w-full">
                <ArrowBackView className="text-brand-white hover:text-brand-black" />
              </div>
              <div className='w-full text-center flex-1 flex flex-col items-center justify-center gap-subsection md:gap-subsection-md'>
                <HeadingView level={1} className='text-brand-white'>
                  {leftPanelContent.title}
                </HeadingView>
                <TextView className='text-brand-white'>
                  {leftPanelContent.subtitle}
                </TextView>

                {leftPanelContent.description && (
                  <TextView className='text-brand-white'>
                    {leftPanelContent.description}
                  </TextView>
                )}

                {leftPanelContent.buttonText && (
                  <ButtonView
                    variant="border-white"
                    type="button"
                    width="fit"
                    onClick={leftPanelContent.buttonAction === 'register' ? handleRegisterClick : handleLoginClick}
                    className=""
                    aria-label={`Alternar para formulário de ${leftPanelContent.buttonAction}`}
                    aria-pressed={leftPanelContent.buttonAction === 'register' ? isActive : !isActive}
                  >
                    {leftPanelContent.buttonText}
                  </ButtonView>
                )}
              </div>
            </div>

            {/* Toggle Right Panel */}
            <div className={`${rightPanelClasses.base} ${rightPanelClasses.transform}`}>
              <div className="flex justify-end w-full">
                <LogoView colorScheme='white' />
              </div>
              <div className='w-full text-center flex-1 flex flex-col items-center justify-center gap-subsection md:gap-subsection-md'>
                <HeadingView level={1} className='text-brand-white'>
                  <span>É novo</span>
                  <span className='mt-2 block'>por aqui?</span>
                </HeadingView>
                <TextView className='text-brand-white'>
                  {rightPanelContent.subtitle}
                </TextView>

                <ButtonView
                  variant="border-white"
                  type="button"
                  width="fit"
                  onClick={handleRegisterClick}
                  className=""
                  aria-label="Alternar para formulário de cadastro"
                  aria-pressed={isActive}
                >
                  {rightPanelContent.buttonText}
                </ButtonView>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SectionView>
  )
}
