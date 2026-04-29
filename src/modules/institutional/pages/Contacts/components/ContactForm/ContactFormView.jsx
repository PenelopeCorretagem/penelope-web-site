import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormView } from '@shared/components/ui/Form/FormView'
import { sendContactMessage } from '@service-penelopec/contactUsService'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'

export function ContactFormView() {
  const [successAlertMessage, setSuccessAlertMessage] = useState('')
  const successAlertTimeoutRef = useRef(null)

  const fields = useMemo(() => ([
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
        if (value.trim().length < 10) {
          return 'A mensagem deve ter pelo menos 10 caracteres'
        }

        return true
      },
    },
  ]), [])

  const closeSuccessAlert = useCallback(() => {
    setSuccessAlertMessage('')

    if (successAlertTimeoutRef.current) {
      clearTimeout(successAlertTimeoutRef.current)
      successAlertTimeoutRef.current = null
    }
  }, [])

  const handleSubmit = useCallback(async (formData) => {
    try {
      await sendContactMessage(formData)

      setSuccessAlertMessage('Mensagem enviada com sucesso!')

      if (successAlertTimeoutRef.current) {
        clearTimeout(successAlertTimeoutRef.current)
      }

      successAlertTimeoutRef.current = setTimeout(() => {
        setSuccessAlertMessage('')
        successAlertTimeoutRef.current = null
      }, 2000)

      return {
        success: true,
        reset: true,
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.'
      return { success: false, error: errorMessage }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (successAlertTimeoutRef.current) {
        clearTimeout(successAlertTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <FormView
        key="contact-form"
        title=""
        subtitle="Envie sua mensagem e nossa equipe responderá o mais rápido possível."
        fields={fields}
        submitText="Enviar mensagem"
        submitWidth="full"
        onSubmit={handleSubmit}
      />

      <AlertView
        isVisible={Boolean(successAlertMessage)}
        type="success"
        message={successAlertMessage}
        hasCloseButton={false}
        actions={[]}
        onClose={closeSuccessAlert}
      />
    </>
  )
}
