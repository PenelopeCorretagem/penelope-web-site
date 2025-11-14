import ReactDOM from 'react-dom'
import { useCallback } from 'react'

import { FormView } from '@shared/components/ui/Form/FormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'

import { FaArrowLeft } from 'react-icons/fa'

export function ScreeningFormView({ onClose }) {
  /* ----------------------------------------------
   * Campos do formulário
   * ---------------------------------------------- */
  const fields = [
    // Coluna 1
    {
      name: 'nome',
      placeholder: 'NOME:',
      type: 'text',
      required: true,
      hasLabel: true,
      column: 1,
    },
    {
      name: 'email',
      placeholder: 'Digite seu e-mail',
      type: 'email',
      required: true,
      hasLabel: true,
      errorMessage: 'E-mail inválido',
      column: 1,
    },
    {
      name: 'celular',
      placeholder: 'CELULAR:',
      type: 'tel',
      hasLabel: true,
      column: 1,
    },

    // Coluna 2
    {
      name: 'sobrenome',
      placeholder: 'SOBRENOME:',
      type: 'text',
      required: true,
      hasLabel: true,
      column: 2,
    },
    {
      name: 'emailConfirm',
      placeholder: 'E-MAIL:',
      type: 'email',
      required: true,
      hasLabel: true,
      validate: (value, allFields) => {
        if (value !== allFields.email) {
          throw new Error('Os e-mails não coincidem')
        }
        return true
      },
      column: 2,
    },
    {
      name: 'rendaMed',
      placeholder: 'RENDA MÉDIA MENSAL:',
      type: 'text',
      hasLabel: true,
      column: 2,
    },
  ]

  /* ----------------------------------------------
   * Submit final
   * ---------------------------------------------- */
  const handleSubmit = useCallback(async (data) => {
    console.log('Dados enviados:', data)

    return {
      success: true,
      message: 'Formulário enviado com sucesso!',
      reset: true,
    }
  }, [])

  /* ----------------------------------------------
   * Render
   * ---------------------------------------------- */
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-default-light rounded-lg shadow-2xl p-16 pb-18 w-full max-w-6xl mx-4 border-2 border-distac-primary flex flex-col space-y-10">

        {/* Header */}
        <HeadingView
          level={4}
          className="flex justify-between items-center w-full text-distac-primary font-semibold"
        >
          {/* Botão de voltar */}
          <ButtonView
            shape="square"
            width="fit"
            onClick={onClose}
            color="transparent"
            className="!p-button-x"
            title="Voltar"
          >
            <FaArrowLeft className="text-distac-secondary text-3xl" aria-hidden="true" />
            <span className="sr-only">Voltar</span>
          </ButtonView>

          Formulário de Triagem

          <LogoView className="text-distac-primary fill-current" />
        </HeadingView>

        {/* Formulários em duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Coluna 1 */}
          <FormView
            fields={fields.filter(f => f.column === 1)}
            submitText=""
            onSubmit={() => {}}
          />

          {/* Coluna 2 */}
          <FormView
            fields={fields.filter(f => f.column === 2)}
            submitText=""
            onSubmit={() => {}}
          />

        </div>

        {/* Botão final */}
        <div className="w-full flex justify-center">
          <div className="mt-6 w-full md:w-1/3">
            <FormView
              fields={[]}
              submitText="Enviar formulário"
              submitWidth="full"
              onSubmit={handleSubmit}
            />
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}
