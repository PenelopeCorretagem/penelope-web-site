import { useState, useEffect, useCallback } from 'react'
import { getUserById, updateUser, deleteUser } from '@app/services/api/userApi'

export function useAccountViewModel() {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const accountFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Digite seu endereço de e-mail',
      required: true,
    },
    {
      name: 'currentPassword',
      type: 'password',
      label: 'Senha Atual',
      placeholder: 'Digite sua senha atual',
      required: true,
      showPasswordToggle: true,
    },
    {
      name: 'newPassword',
      type: 'password',
      label: 'Nova Senha',
      placeholder: 'Crie uma nova senha (deixe em branco para manter a atual)',
      required: false,
      showPasswordToggle: true,
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

      setFormData({
        email: user.email || '',
        currentPassword: '',
        newPassword: ''
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
        email: data.email,
      }

      if (data.newPassword && data.newPassword.trim() !== '') {
        updateData.senha = data.newPassword
      }

      await updateUser(userId, updateData)

      setFormData(prev => ({
        ...prev,
        email: data.email,
        currentPassword: '',
        newPassword: ''
      }))

      return {
        success: true,
        message: 'Dados de acesso atualizados com sucesso!'
      }
    } catch (err) {
      console.error('Erro ao atualizar dados de acesso:', err)
      return {
        success: false,
        error: err.message || 'Erro ao atualizar dados de acesso'
      }
    }
  }

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não encontrado')
      }

      const confirmed = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')
      if (!confirmed) return

      await deleteUser(userId)

      localStorage.removeItem('userId')

      window.location.href = '/'
    } catch (err) {
      console.error('Erro ao excluir conta:', err)
      alert(err.message || 'Erro ao excluir conta')
    }
  }

  return {
    accountFields,
    formData,
    isLoading,
    error,
    handleSubmit,
    handleDelete,
  }
}
