import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { FormView } from '@shared/components/ui/Form/FormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ArrowBackView } from '@shared/components/ui/ArrowBack/ArrowBackView'
import { useResetPasswordViewModel } from './useResetPasswordViewModel'

export function ResetPasswordView() {
  const {
    // Estado
    _isActive,
    currentResetType,

    // Handlers
    handleVerificationSubmit,
    handleNewPasswordSubmit,
    handleBackToLogin,

    // Configurações de estilo
    getContainerClasses,
    getVerificationPanelStyles,
    getNewPasswordPanelStyles,
    getToggleContainerClasses,
    getGradientClasses,
    getLeftPanelClasses,
    getRightPanelClasses,

    // Dados do modelo
    verificationFormConfig,
    newPasswordFormConfig,
    leftPanelContent,
    rightPanelContent
  } = useResetPasswordViewModel()

  const containerClasses = getContainerClasses()
  const toggleContainerClasses = getToggleContainerClasses()
  const gradientClasses = getGradientClasses()
  const leftPanelClasses = getLeftPanelClasses()
  const rightPanelClasses = getRightPanelClasses()

  const _isNewPasswordStep = currentResetType === 'new_password'

  return (
    <SectionView paddingClasses='' className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className={`${containerClasses.base} ${containerClasses.active}`}>

        {/* Verification Form */}
        <div
          className="absolute top-0 left-0 w-3/5 h-full bg-brand-white z-20 p-section md:p-section-md flex flex-col items-center justify-center"
          style={getVerificationPanelStyles()}
        >
          <div className="flex justify-start w-full">
            <ArrowBackView />
          </div>
          <div className="flex-1 flex flex-col w-full items-center justify-center gap-subsection md:gap-subsection-md">
            <FormView
              title={verificationFormConfig.title}
              subtitle={verificationFormConfig.subtitle}
              fields={verificationFormConfig.fields}
              submitText={verificationFormConfig.submitText}
              onSubmit={handleVerificationSubmit}
            />
            <TextView className='text-brand-dark-gray flex gap-1 items-center justify-center'>
              Lembrou a senha?
              <button
                onClick={handleBackToLogin}
                className='font-semibold text-brand-pink hover:underline bg-transparent border-none cursor-pointer'
              >
                Acessar
              </button>
            </TextView>
          </div>
        </div>

        {/* New Password Form */}
        <div
          className="absolute top-0 right-0 w-3/5 h-full bg-brand-white p-section md:p-section-md flex flex-col"
          style={getNewPasswordPanelStyles()}
        >
          <div className="flex justify-end">
            <LogoView colorScheme="pink" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full">
              <FormView
                title={newPasswordFormConfig.title}
                subtitle={newPasswordFormConfig.subtitle}
                fields={newPasswordFormConfig.fields}
                submitText={newPasswordFormConfig.submitText}
                onSubmit={handleNewPasswordSubmit}
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
              </div>
            </div>

            {/* Toggle Right Panel */}
            <div className={`${rightPanelClasses.base} ${rightPanelClasses.transform}`}>
              <div className="flex justify-end w-full">
                <LogoView colorScheme='white' />
              </div>
              <div className='w-full text-center flex-1 flex flex-col items-center justify-center gap-subsection md:gap-subsection-md'>
                <HeadingView level={1} className='text-brand-white'>
                  Quase lá!
                </HeadingView>
                <TextView className='text-brand-white'>
                  {rightPanelContent.subtitle}
                </TextView>

                <ButtonView
                  variant="border-white"
                  type="button"
                  width="fit"
                  onClick={handleBackToLogin}
                  className=""
                  aria-label="Voltar ao login"
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
