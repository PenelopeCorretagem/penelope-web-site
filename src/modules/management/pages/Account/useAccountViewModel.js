import { useState, useEffect, useCallback } from 'react'
import { getUserById, updateUser, deleteUser } from '@app/services/api/userApi'
import { AccountModel } from './AccountModel'

export function useAccountViewModel() {
  const [model, setModel] = useState(new AccountModel())
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Usar os campos do model
  const accountFields = AccountModel.getFormFields()

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não encontrado')
      }

      const user = await getUserById(userId)
      const accountModel = AccountModel.fromApiData(user)

      setModel(accountModel)
      setFormData({
        email: accountModel.email, // Só o email é preenchido
        currentPassword: '', // Sempre vazio por segurança
        newPassword: '' // Sempre vazio por segurança
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
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não encontrado')
      }

      // Criar novo model com os dados atualizados
      const updatedModel = new AccountModel(data)

      // Validar dados
      const validation = updatedModel.validate()
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        throw new Error(`Dados inválidos: ${errorMessages}`)
      }

      // Converter para formato da API
      const updateData = updatedModel.toApiFormat()

      await updateUser(userId, updateData)

      // Atualizar model e limpar senhas por segurança
      updatedModel.clearPasswords()
      setModel(updatedModel)
      setFormData({
        email: data.email, // Manter email atualizado
        currentPassword: '', // Sempre limpar senhas por segurança
        newPassword: ''
      })

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
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não encontrado')
      }

      const confirmed = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')
      if (!confirmed) return

      await deleteUser(userId)

      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('token')

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
    model,
  }
}
