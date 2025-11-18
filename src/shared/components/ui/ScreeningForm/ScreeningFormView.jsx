import { useState } from 'react'
import ReactDOM from 'react-dom'
import { FormView } from '@shared/components/ui/Form/FormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { FaArrowLeft } from 'react-icons/fa'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { generateWhatsAppLink } from '@shared/utils/generateWhatsAppLinkUtil'

export function ScreeningFormView({ onClose }) {

  const [formData, setFormData] = useState({})

  const fields = [
    { name: 'nome', placeholder: 'NOME:', type: 'text', hasLabel: true, required: true, column: 1 },
    { name: 'email', placeholder: 'Digite seu e-mail', type: 'email', hasLabel: true, required: true, column: 1 },
    { name: 'celular', placeholder: 'CELULAR:', type: 'tel', hasLabel: true, column: 1 },

    { name: 'sobrenome', placeholder: 'SOBRENOME:', type: 'text', hasLabel: true, required: true, column: 2 },
    {
      name: 'emailConfirm',
      placeholder: 'E-MAIL:',
      type: 'email',
      hasLabel: true,
      required: true,
      validate: (value, allFields) => {
        if (value !== allFields.email) throw new Error('Os e-mails não coincidem')
        return true
      },
      column: 2,
    },
    { name: 'rendaMed', placeholder: 'RENDA MÉDIA MENSAL:', type: 'renda', hasLabel: true, column: 2 },
  ]

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const enviarWhatsApp = () => {
    const { nome, sobrenome, celular, email, rendaMed } = formData

    // Validação simples dos campos obrigatórios
    if (!nome || !sobrenome || !email) {
      window.alert('Por favor preencha os campos Nome, Sobrenome e E-mail antes de enviar.')
      return
    }

    const mensagem = [
      'Olá! Segue minha triagem:',
      `Nome: ${nome || ''}`,
      `Sobrenome: ${sobrenome || ''}`,
      `E-mail: ${email || ''}`,
      `Celular: ${celular || ''}`,
      `Renda média mensal: ${rendaMed || ''}`,
    ].join('\n')

    const numero = '5511999999999' // << coloque o número da empresa aqui

    const url = generateWhatsAppLink(numero, mensagem)

    window.open(url, '_blank')
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-default-light rounded-lg shadow-2xl p-16 w-full max-w-6xl mx-4 border-2 border-distac-primary flex flex-col space-y-6">

        <HeadingView
          level={4}
          className="flex justify-between items-center w-full mb-10 text-distac-primary font-semibold"
        >
          <ButtonView
            shape="square"
            width="fit"
            onClick={onClose}
            className="!p-button-x"
            color="transparent"
            title="Voltar"
          >
            <FaArrowLeft className="text-distac-secondary text-3xl" aria-hidden="true" />
            <span className="sr-only">Voltar</span>
          </ButtonView>

          Formulário de Triagem
          <LogoView className="text-distac-primary fill-current" />
        </HeadingView>

        {/* GRID 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Coluna 1 */}
          <FormView
            fields={fields.filter(f => f.column === 1)}
            onChange={handleFieldChange}
            submitText=""
          />

          {/* Coluna 2 */}
          <FormView
            fields={fields.filter(f => f.column === 2)}
            onChange={handleFieldChange}
            submitText=""
          />

        </div>

        {/* Botão final */}
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
