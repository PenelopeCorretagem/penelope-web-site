// useScreeningFormViewModel.js

import { useState } from 'react'
import { ScreeningFormModel } from './ScreeningFormModel'
import { generateWhatsAppLink } from '@shared/utils/generateWhatsAppLinkUtil'

export function useScreeningFormViewModel(property) {

  const [formData, setFormData] = useState(ScreeningFormModel.defaultFormData)

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const enviarWhatsApp = () => {
    const { nome, sobrenome, cpf, celular, email, rendaMed } = formData

    // Validação simples dos campos obrigatórios
    if (!nome || !sobrenome || !email || !cpf) {
      window.alert('Por favor preencha os campos Nome, Sobrenome, Cpf e E-mail antes de enviar.')
      return
    }

    let propertyInfo = ''
    if (property && property.title) {
      propertyInfo = `Imóvel: ${property.title}\n\n`
    }

    const mensagem = [
      'Olá! Segue minha triagem:',
      propertyInfo,
      `Nome: ${nome || ''} ${sobrenome || ''}`,
      `Cpf: ${cpf || ''}`,
      `E-mail: ${email || ''}`,
      `Celular: ${celular || ''}`,
      `Renda média mensal: ${rendaMed || ''}`
    ].join('\n')

    const numero = '5511985600810'
    const url = generateWhatsAppLink(numero, mensagem)

    window.open(url, '_blank')
  }

  const fieldsColumn1 = ScreeningFormModel.fields.filter(f => f.column === 1)
  const fieldsColumn2 = ScreeningFormModel.fields.filter(f => f.column === 2)

  return {
    formData,
    fieldsColumn1,
    fieldsColumn2,
    handleFieldChange,
    enviarWhatsApp
  }
}
