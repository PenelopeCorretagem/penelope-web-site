import { FormView } from '@shared/components/ui/Form/FormView'

export function ContactFormView() {
  const fields = [
    {
      name: 'name',
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
      name: 'subject',
      label: 'Assunto',
      placeholder: 'Qual é o motivo do contato?',
      type: 'text',
      required: true,
      hasLabel: true,
    },
    {
      name: 'message',
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
      const response = await fetch('https://sua-api.com/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'contato@penelope.com.br',
          subject: `Novo contato: ${formData.subject}`,
          message: `
          Nome: ${formData.name}
          E-mail: ${formData.email}
          Mensagem: ${formData.message}
        `,
        }),
      })

      if (!response.ok) throw new Error('Falha ao enviar o e-mail')

      return {
        success: true,
        message: 'Mensagem enviada com sucesso! Verifique seu e-mail em breve.',
        reset: true,
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error)
      return { success: false, error: 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.' }
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
