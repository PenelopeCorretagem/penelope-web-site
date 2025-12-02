// ScreeningFormView.jsx

import ReactDOM from 'react-dom'
import { FaTimes } from 'react-icons/fa'
import { FormView } from '@shared/components/ui/Form/FormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'

import { useScreeningFormViewModel } from './useScreeningFormViewModel'

export function ScreeningFormView({ onClose, property = null }) {

  const {
    fieldsColumn1,
    fieldsColumn2,
    handleFieldChange,
    enviarWhatsApp
  } = useScreeningFormViewModel(property)

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-default-light rounded-lg shadow-2xl p-16 w-full max-w-6xl mx-4 border-2 border-distac-primary flex flex-col space-y-6">

        <HeadingView
          level={4}
          className="grid grid-cols-3 items-center w-full mb-10 text-distac-primary font-semibold"
        >
          <div></div>

          <div className="text-center">Formulário de Triagem</div>

          <div className="flex justify-end">
            <ButtonView
              shape="square"
              width="fit"
              onClick={onClose}
              className="!p-button-x"
              color="transparent"
              title="Fechar"
            >
              <FaTimes className="text-distac-secondary text-3xl" aria-hidden="true" />
              <span className="sr-only">Fechar</span>
            </ButtonView>
          </div>

        </HeadingView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormView
            fields={fieldsColumn1}
            onChange={handleFieldChange}
            submitText=""
          />

          <FormView
            fields={fieldsColumn2}
            onChange={handleFieldChange}
            submitText=""
          />
        </div>

        <div className="w-full flex justify-center mt-6">
          <ButtonView
            width="full"
            onClick={enviarWhatsApp}
            className="w-1/3"
          >
            Enviar pelo WhatsApp
          </ButtonView>
        </div>

      </div>
    </div>,
    document.body
  )
}
