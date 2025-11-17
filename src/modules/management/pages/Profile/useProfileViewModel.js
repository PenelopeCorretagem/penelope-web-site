import { useState, useEffect, useCallback } from 'react'
import { getUserById, updateUser } from '@app/services/api/userApi'
import { ProfileModel } from './ProfileModel'
import { formatCurrencyForDisplay } from '@shared/utils/formatCurrencyUtil'

export function useProfileViewModel(targetUserId = null) {
  const [model, setModel] = useState(new ProfileModel())
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    creci: '',
    cpf: '',
    dateBirth: '',
    monthlyIncome: '',
    accessLevel: 'CLIENTE'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Determinar se está editando próprio perfil e se o usuário atual é admin
  const currentUserId = sessionStorage.getItem('userId')
  const userIdToEdit = targetUserId || currentUserId
  const isEditingOwnProfile = !targetUserId || targetUserId === currentUserId
  const currentUserIsAdmin = currentUser?.accessLevel === 'ADMINISTRADOR'

  // Usar os campos do model com configuração baseada no contexto
  const profileFields = ProfileModel.getFormFields(isEditingOwnProfile, currentUserIsAdmin)

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!userIdToEdit) {
        throw new Error('Usuário não encontrado')
      }

      // Carregar dados do usuário atual para verificar permissões
      const currentUserData = await getUserById(currentUserId)
      setCurrentUser(currentUserData)

      // Carregar dados do usuário a ser editado
      const user = await getUserById(userIdToEdit)
      const profileModel = ProfileModel.fromApiData(user)

      setModel(profileModel)
      setFormData({
        name: profileModel.name,
        phone: profileModel.phone,
        creci: profileModel.creci,
        cpf: profileModel.cpf,
        dateBirth: profileModel.dateBirth,
        // Formatar renda mensal para exibição
        monthlyIncome: formatCurrencyForDisplay(profileModel.monthlyIncome),
        // Para select, usar valor direto
        accessLevel: profileModel.accessLevel
      })
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err)
      setError(err.message || 'Erro ao carregar dados do usuário')
    } finally {
      setIsLoading(false)
    }
  }, [userIdToEdit, currentUserId])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const handleSubmit = async (data) => {
    try {
      if (!userIdToEdit) {
        throw new Error('Usuário não encontrado')
      }

      // Usar dados diretos do select
      const processedData = {
        ...data
      }

      // Criar novo model com os dados atualizados
      const updatedModel = new ProfileModel(processedData)

      // Validar dados
      const validation = updatedModel.validate(isEditingOwnProfile, currentUserIsAdmin)
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        throw new Error(`Dados inválidos: ${errorMessages}`)
      }

      // Converter para formato da API
      const updateData = updatedModel.toApiFormat()

      await updateUser(userIdToEdit, updateData)

      setModel(updatedModel)
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
    model,
    isEditingOwnProfile,
    currentUserIsAdmin
  }
}
