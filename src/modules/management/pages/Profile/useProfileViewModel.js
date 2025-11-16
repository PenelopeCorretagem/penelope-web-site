import { useState, useEffect, useCallback } from 'react'
import { getUserById, updateUser } from '@app/services/api/userApi'

export function useProfileViewModel() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    birthDate: '',
    monthlyIncome: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const profileFields = [
    {
      name: 'firstName',
      label: 'Nome',
      placeholder: 'Digite seu primeiro nome',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Sobrenome',
      placeholder: 'Digite seu sobrenome',
      required: true,
    },
    {
      name: 'cpf',
      label: 'CPF',
      placeholder: 'Digite seu CPF (somente números)',
      required: true,
    },
    {
      name: 'birthDate',
      label: 'Data de Nascimento',
      type: 'date',
      placeholder: 'DD/MM/AAAA',
      required: true,
    },
    {
      name: 'monthlyIncome',
      label: 'Renda Média Mensal',
      type: 'number',
      placeholder: 'Informe sua renda mensal aproximada',
      required: true,
    },
    {
      name: 'phone',
      label: 'Celular',
      placeholder: 'Digite seu número de celular com DDD',
      required: true,
    }
  ]

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não encontrado')
      }

      const user = await getUserById(userId)

      const nameParts = user.nomeCompleto?.split(' ') || []
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        cpf: user.cpf || '',
        birthDate: user.dtNascimento || '',
        monthlyIncome: user.rendaMensal?.toString() || '',
        phone: user.phone || ''
      })
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err)
      setError(err.message || 'Erro ao carregar dados do usuário')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const handleSubmit = async (data) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não encontrado')
      }

      const updateData = {
        nomeCompleto: `${data.firstName} ${data.lastName}`.trim(),
        cpf: data.cpf,
        dtNascimento: data.birthDate,
        rendaMensal: parseFloat(data.monthlyIncome),
        phone: data.phone
      }

      await updateUser(userId, updateData)

      setFormData(data)

      return {
        success: true,
        message: 'Perfil atualizado com sucesso!'
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      return {
        success: false,
        error: err.message || 'Erro ao atualizar perfil'
      }
    }
  }

  return {
    profileFields,
    formData,
    isLoading,
    error,
    handleSubmit,
  }
}
