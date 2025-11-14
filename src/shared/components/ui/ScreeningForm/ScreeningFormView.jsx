import ReactDOM from 'react-dom'
import { FormView } from '@shared/components/ui/Form/FormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { FaArrowLeft } from 'react-icons/fa'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

export function ScreeningFormView({ onClose }) {

  const fields = [
    // COLUNA 1
    {
      name: 'nome',
      label: '',
      placeholder: 'NOME:',
      type: 'text',
      required: true,
      hasLabel: true,
      column: 1,
    },
    {
      name: 'email',
      label: '',
      placeholder: 'Digite seu e-mail',
      type: 'email',
      required: true,
      hasLabel: true,
      errorMessage: 'E-mail inválido',
      column: 1,
    },
    {
      name: 'celular',
      label: '',
      placeholder: 'CELULAR:',
      type: 'tel',
      hasLabel: true,
      column: 1,
    },

    // COLUNA 2
    {
      name: 'sobrenome',
      label: '',
      placeholder: 'SOBRENOME:',
      type: 'text',
      required: true,
      hasLabel: true,
      column: 2,
    },
    {
      name: 'emailConfirm',
      label: '',
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
      label: '',
      placeholder: 'RENDA MÉDIA MENSAL:',
      type: 'renda',
      hasLabel: true,
      column: 2,
    },
  ]

  const handleSubmit = async (data) => {
    console.log('Dados enviados:', data)

    return {
      success: true,
      message: 'Formulário enviado com sucesso!',
      reset: true,
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-default-light rounded-lg shadow-2xl p-8 w-full max-w-6xl mx-4 border-2 border-distac-primary h-auto flex flex-col space-y-6">

        {/* Voltar */}
        <ButtonView
          shape='square'
          width='fit'
          onClick={onClose}
          className='!p-button-x'
          color='transparent'
          title='Voltar'
        >
          <FaArrowLeft className='text-distac-secondary text-3xl' aria-hidden='true' />
          <span className='sr-only'>Buscar</span>
        </ButtonView>

        <HeadingView
          level={4}
          className="text-center mb-10 text-distac-primary font-semibold w-full"
        >
          Formulário de Triagem
        </HeadingView>

        {/* 🔥 Grade com duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1 */}
          <div className="flex flex-col gap-6">
            <FormView
              fields={fields.filter(f => f.column === 1)}
              submitText=""
              onSubmit={() => {}}
            />
          </div>

          {/* Coluna 2 */}
          <div className="flex flex-col gap-6">
            <FormView
              fields={fields.filter(f => f.column === 2)}
              submitText=""
              onSubmit={() => {}}
            />
          </div>
        </div>

        {/* Botão final */}
        <div className='w-full flex justify-center'>
          <div className="mt-6 w-1/4">
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
