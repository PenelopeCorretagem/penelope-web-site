import { FormView } from '@shared/components/ui/Form/FormView'
import { sendContactMessage } from '@app/services/api/contactUsApi'

export function ContactFormView() {
  const fields = [
    {
      name: 'nome',
      label: 'Nome completo',
      placeholder: 'Digite seu nome',
      type: 'text',
      required: true,
      hasLabel: true,
    },
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'Digite seu e-mail',
      type: 'email',
      required: true,
      hasLabel: true,
      errorMessage: 'E-mail inválido',
    },
    {
      name: 'assunto',
      label: 'Assunto',
      placeholder: 'Qual é o motivo do contato?',
      type: 'text',
      required: true,
      hasLabel: true,
    },
    {
      name: 'mensagem',
      label: 'Mensagem',
      placeholder: 'Escreva sua mensagem...',
      type: 'textarea',
      required: true,
      hasLabel: true,
      rows: 6,
      validate: (value) => {
        if (value.trim().length < 10) throw new Error('A mensagem deve ter pelo menos 10 caracteres')
        return true
      },
    },
  ]

  const handleSubmit = async (formData) => {
    try {
      await sendContactMessage(formData)

      return {
        success: true,
        message: 'Mensagem enviada com sucesso!',
        reset: true,
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.'
      return { success: false, error: errorMessage }
    }
  }

  return (
    <FormView
      title=""
      subtitle="Envie sua mensagem e nossa equipe responderá o mais rápido possível."
      fields={fields}
      submitText="Enviar mensagem"
      submitWidth="full"
      onSubmit={handleSubmit}
    />
  )
}
