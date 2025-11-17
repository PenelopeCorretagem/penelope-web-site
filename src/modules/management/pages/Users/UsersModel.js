/**
 * Modelo de dados para gerenciamento de usuários
 */
export class UsersModel {
  constructor() {
    this.users = []
  }

  /**
   * Define a lista de usuários
   */
  setUsers(users) {
    this.users = users
  }

  /**
   * Retorna todos os usuários
   */
  getUsers() {
    return this.users
  }

  /**
   * Retorna um usuário por ID
   */
  getUserById(id) {
    return this.users.find(user => user.id === id)
  }

  /**
   * Adiciona um usuário à lista
   */
  addUser(user) {
    this.users.push(user)
  }

  /**
   * Atualiza um usuário na lista
   */
  updateUser(id, updatedUser) {
    const index = this.users.findIndex(user => user.id === id)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser }
    }
  }

  /**
   * Remove um usuário da lista
   */
  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id)
  }

  /**
   * Retorna a contagem total de usuários
   */
  getTotalCount() {
    return this.users.length
  }

  /**
   * Retorna os campos do formulário de usuário
   */
  getUserFormFields(user = null) {
    return [
      {
        name: 'nomeCompleto',
        label: 'Nome Completo',
        placeholder: 'Digite o nome completo',
        required: true,
        defaultValue: user?.nomeCompleto || ''
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Digite o email',
        required: true,
        defaultValue: user?.email || ''
      },
      {
        name: 'phone',
        label: 'Telefone',
        placeholder: '(00) 00000-0000',
        required: true,
        defaultValue: user?.phone || ''
      },
      {
        name: 'cpf',
        label: 'CPF',
        placeholder: '000.000.000-00',
        required: true,
        defaultValue: user?.cpf || ''
      },
      {
        name: 'dtNascimento',
        type: 'date',
        label: 'Data de Nascimento',
        placeholder: 'dd/mm/aaaa',
        required: false,
        defaultValue: user?.dtNascimento || ''
      },
      {
        name: 'accessLevel',
        type: 'select',
        label: 'Nível de Acesso',
        options: [
          { value: 'ADMINISTRADOR', label: 'Administrador' },
          { value: 'CLIENTE', label: 'Cliente' }
        ],
        required: true,
        defaultValue: user?.accessLevel || 'CLIENTE'
      },
      {
        name: 'creci',
        label: 'CRECI (opcional)',
        placeholder: 'Digite o CRECI',
        required: false,
        defaultValue: user?.creci || ''
      },
      {
        name: 'rendaMensal',
        type: 'number',
        label: 'Renda Mensal',
        placeholder: '0.00',
        required: false,
        defaultValue: user?.rendaMensal || 0
      }
    ]
  }

  /**
   * Filtra usuários por nome e tipo
   */
  filterUsers(searchTerm = '', userType = 'TODOS', sortOrder = 'none') {
    console.log('FilterUsers called with:', { searchTerm, userType, sortOrder, usersCount: this.users.length }) // Debug
    let filtered = [...this.users]

    // Filtro por nome ou email
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(user =>
        (user.nomeCompleto || user.name || '')?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por tipo de usuário
    if (userType !== 'TODOS') {
      filtered = filtered.filter(user => user.accessLevel === userType)
    }

    // Ordenação alfabética
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => {
        const nameA = (a.nomeCompleto || a.name || '').toLowerCase()
        const nameB = (b.nomeCompleto || b.name || '').toLowerCase()
        return nameA.localeCompare(nameB, 'pt-BR')
      })
      console.log('Sorted ASC:', filtered.slice(0, 3).map(u => u.nomeCompleto || u.name)) // Debug
    } else if (sortOrder === 'desc') {
      filtered = filtered.sort((a, b) => {
        const nameA = (a.nomeCompleto || a.name || '').toLowerCase()
        const nameB = (b.nomeCompleto || b.name || '').toLowerCase()
        return nameB.localeCompare(nameA, 'pt-BR')
      })
      console.log('Sorted DESC:', filtered.slice(0, 3).map(u => u.nomeCompleto || u.name)) // Debug
    }
    // Se sortOrder === 'none', mantém a ordem original

    console.log('Final filtered result:', filtered.length, 'users') // Debug
    return filtered
  }
}
