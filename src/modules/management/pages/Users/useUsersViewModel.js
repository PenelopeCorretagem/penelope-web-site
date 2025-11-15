import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllUsers, updateUser, deleteUser } from '@app/services/api/userApi'
import { UsersModel } from './UsersModel'

export const useUsersViewModel = () => {
  const model = useMemo(() => new UsersModel(), [])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [alertConfig, setAlertConfig] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('TODOS')
  const [sortOrder, setSortOrder] = useState('none')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const usersData = await getAllUsers()
      model.setUsers(usersData)
      setUsers(usersData)
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setError('Não foi possível carregar os usuários. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = useCallback((userId) => {
    setSelectedUserId(userId)
    setIsEditing(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedUserId(null)
    setIsEditing(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setSelectedUserId(null)
  }, [])

  const handleSubmit = useCallback(async (formData) => {
    try {
      setLoading(true)

      if (selectedUserId) {
        // Atualizar usuário existente
        const updatedUser = await updateUser(selectedUserId, formData)
        model.updateUser(selectedUserId, updatedUser)
        setUsers([...model.getUsers()])

        setAlertConfig({
          type: 'success',
          message: 'Usuário atualizado com sucesso!'
        })
      } else {
        // Criar novo usuário não está disponível nesta tela
        // Usuários são criados via registro
        setAlertConfig({
          type: 'info',
          message: 'Novos usuários devem ser criados através do registro.'
        })
      }

      setIsEditing(false)
      setSelectedUserId(null)

      return { success: true }
    } catch (err) {
      console.error('Erro ao salvar usuário:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao salvar usuário'

      setAlertConfig({
        type: 'error',
        message: errorMessage
      })

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }, [selectedUserId, model])

  const handleDelete = useCallback(async (userId) => {
    try {
      setLoading(true)
      await deleteUser(userId)
      model.removeUser(userId)
      setUsers([...model.getUsers()])

      setAlertConfig({
        type: 'success',
        message: 'Usuário excluído com sucesso!'
      })
    } catch (err) {
      console.error('Erro ao excluir usuário:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao excluir usuário'

      setAlertConfig({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }, [model])

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  const handleUserTypeFilterChange = useCallback((type) => {
    setUserTypeFilter(type)
  }, [])

  const handleSortOrderChange = useCallback(() => {
    setSortOrder(prev => {
      if (prev === 'none') return 'asc'
      if (prev === 'asc') return 'desc'
      return 'none'
    })
  }, [])

  const selectedUser = selectedUserId ? model.getUserById(selectedUserId) : null
  const userFormFields = model.getUserFormFields(selectedUser)
  const filteredUsers = useMemo(
    () => model.filterUsers(searchTerm, userTypeFilter, sortOrder),
    [users, searchTerm, userTypeFilter, sortOrder, model]
  )

  return {
    users: filteredUsers,
    loading,
    error,
    isEditing,
    selectedUser,
    userFormFields,
    alertConfig,
    searchTerm,
    userTypeFilter,
    sortOrder,
    totalCount: model.getTotalCount(),
    handleEdit,
    handleAdd,
    handleCancel,
    handleSubmit,
    handleDelete,
    handleCloseAlert,
    handleSearchChange,
    handleUserTypeFilterChange,
    handleSortOrderChange
  }
}
