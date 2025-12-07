import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllUsers, updateUser, deleteUser } from '@app/services/api/userApi'
import { UsersModel } from './UsersModel'
import { useRouter } from '@app/routes/useRouterViewModel'

export function useUsersViewModel() {
  const { navigateTo, generateRoute, getAllRoutes } = useRouter()
  const routes = getAllRoutes()
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
    console.log('Edit user:', userId) // Debug log
    const editRoute = generateRoute('ADMIN_USER_EDIT', { id: userId })
    console.log('Generated route:', editRoute) // Debug log
    navigateTo(editRoute)
  }, [navigateTo, generateRoute])

  const handleAdd = useCallback(() => {
    console.log('Add user') // Debug log
    navigateTo(routes.ADMIN_USER_ADD)
  }, [navigateTo, routes.ADMIN_USER_ADD])

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

  const handleSearchChange = useCallback((e) => {
    // Handle both event objects and direct values
    const value = e?.target?.value ?? e ?? ''
    setSearchTerm(value)
  }, [])

  const handleUserTypeFilterChange = useCallback((type) => {
    setUserTypeFilter(type)
  }, [])

  const handleSortOrderChange = useCallback(() => {
    setSortOrder(prev => {
      const newOrder = prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'
      console.log('Sort order changed from', prev, 'to', newOrder) // Debug
      return newOrder
    })
  }, [])

  const selectedUser = selectedUserId ? model.getUserById(selectedUserId) : null
  const userFormFields = model.getUserFormFields(selectedUser)

  const filteredUsers = useMemo(() => {
    console.log('Filtering users...', { searchTerm, userTypeFilter, sortOrder, usersCount: users.length }) // Debug
    model.setUsers(users)
    const filtered = model.filterUsers(searchTerm, userTypeFilter, sortOrder)
    console.log('Filtered result:', filtered.length, 'users') // Debug
    if (sortOrder !== 'none') {
      console.log('First few users after sorting:', filtered.slice(0, 3).map(u => u.nomeCompleto || u.name)) // Debug
    }
    return filtered
  }, [searchTerm, userTypeFilter, sortOrder, users, model])

  return {
    users: filteredUsers, // Use filteredUsers instead of original users array
    loading,
    error,
    alertConfig,
    searchTerm,
    userTypeFilter,
    sortOrder,
    handleEdit,
    handleAdd,
    handleDelete,
    handleCloseAlert,
    handleSearchChange,
    handleUserTypeFilterChange,
    handleSortOrderChange
  }
}
