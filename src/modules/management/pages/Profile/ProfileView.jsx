import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
import { useState } from 'react'

export function ProfileView() {
  const [formData, setFormData] = useState({
    firstName: 'João',
    lastName: 'Silva',
    cpf: '123.456.789-00',
    birthDate: '1990-01-01',
    monthlyIncome: '5000',
    phone: '(11) 99999-9999'
  })

  const profileFields = [
    {
      name: 'firstName',
      label: 'Nome',
      placeholder: 'Digite seu primeiro nome',
      required: true,
      defaultValue: formData.firstName
    },
    {
      name: 'lastName',
      label: 'Sobrenome',
      placeholder: 'Digite seu sobrenome',
      required: true,
      defaultValue: formData.lastName
    },
    {
      name: 'cpf',
      label: 'CPF',
      placeholder: 'Digite seu CPF (somente números)',
      required: true,
      defaultValue: formData.cpf
    },
    {
      name: 'birthDate',
      label: 'Data de Nascimento',
      type: 'date',
      placeholder: 'DD/MM/AAAA',
      required: true,
      defaultValue: formData.birthDate
    },
    {
      name: 'monthlyIncome',
      label: 'Renda Média Mensal',
      type: 'number',
      placeholder: 'Informe sua renda mensal aproximada',
      required: true,
      defaultValue: formData.monthlyIncome
    },
    {
      name: 'phone',
      label: 'Celular',
      placeholder: 'Digite seu número de celular com DDD',
      required: true,
      defaultValue: formData.phone
    }
  ]

  const handleSubmit = async (data) => {
    try {
      console.log('Dados enviados:', data)
      setFormData(data)
      return { success: true, message: 'Perfil atualizado com sucesso!' }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar perfil'
      }
    }
  }

  return (
    <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md'>
      <EditFormView
        title="MEU PERFIL"
        fields={profileFields}
        initialData={formData}
        onSubmit={handleSubmit}
        showDeleteButton={false}
      />
    </SectionView>
  )
}
