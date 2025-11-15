import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { useUsersViewModel } from './useUsersViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { ArrowUpAZ, ArrowDownAZ, ArrowUpDown } from 'lucide-react'

export function UsersView() {
  const {
    users,
    loading,
    error,
    isEditing,
    selectedUser,
    userFormFields,
    alertConfig,
    searchTerm,
    userTypeFilter,
    sortOrder,
    handleEdit,
    handleAdd,
    handleCancel,
    handleSubmit,
    handleDelete,
    handleCloseAlert,
    handleSearchChange,
    handleUserTypeFilterChange,
    handleSortOrderChange
  } = useUsersViewModel()

  const headerHeight = useHeaderHeight()

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <ArrowUpAZ size={20} />
    if (sortOrder === 'desc') return <ArrowDownAZ size={20} />
    return <ArrowUpDown size={20} />
  }

  if (loading && !isEditing) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView
          className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]"
        >
          Carregando usuários...
        </SectionView>
      </div>
    )
  }

  if (error && !isEditing) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView
          className="flex items-center justify-center text-red-500 min-h-[calc(100vh-var(--header-height))]"
        >
          {error}
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <SectionView
        className="flex flex-col subsection h-[calc(100vh-var(--header-height))] min-h-[calc(100vh-var(--header-height))]  max-h-[calc(100vh-var(--header-height))] overflow-hidden !gap-subsection md:!gap-subsection-md"
      >
        <HeadingView level={2} className="text-distac-primary flex-shrink-0">
          GERENCIAR USUÁRIOS
        </HeadingView>

        {!isEditing ? (
          <>
            <div className="flex flex-col gap-card md:gap-card-md flex-shrink-0">
              <div className="flex flex-col md:flex-row gap-card md:gap-card-md">
                <div className="flex-1">
                  <InputView
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    hasLabel={false}
                    isActive={true}
                  />
                </div>
                <div className="w-full md:w-64">
                  <SelectView
                    value={userTypeFilter}
                    onChange={(e) => handleUserTypeFilterChange(e.target.value)}
                    options={[
                      { value: 'TODOS', label: 'Todos os usuários' },
                      { value: 'ADMINISTRADOR', label: 'Administradores' },
                      { value: 'CLIENTE', label: 'Clientes' }
                    ]}
                    width="full"
                    variant="brown"
                    shape="square"
                  />
                </div>
                <div className="w-full md:w-fit">
                  <button
                    type="button"
                    onClick={handleSortOrderChange}
                    className={`
                      flex items-center justify-center
                      w-12 h-12 p-2
                      rounded-sm
                      font-bold uppercase
                      transition-all duration-200
                      ${sortOrder !== 'none'
                      ? 'bg-distac-primary text-default-light'
                      : 'bg-distac-secondary text-default-light hover:bg-distac-primary'
                      }
                    `}
                    title={sortOrder === 'asc' ? 'Ordenação crescente (A → Z)' : sortOrder === 'desc' ? 'Ordenação decrescente (Z → A)' : 'Sem ordenação'}
                  >
                    {getSortIcon()}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-card md:gap-card-md overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-distac-secondary scrollbar-track-default-light-muted hover:scrollbar-thumb-distac-primary">
              {users.length === 0 ? (
                <div className="text-center text-default-dark-muted py-8">
                  Nenhum usuário encontrado.
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-default-dark-muted rounded-lg bg-default-light flex-shrink-0"
                  >
                    <div>
                      <span className="font-medium text-default-dark">
                        {user.nomeCompleto}
                      </span>
                      <p className="text-sm text-default-dark-muted">{user.email}</p>
                      <p className="text-xs text-default-dark-muted">
                        {user.accessLevel === 'ADMINISTRADOR' ? 'Administrador' : 'Cliente'}
                        {user.creci && ` • CRECI: ${user.creci}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <ButtonView
                        type="button"
                        width="fit"
                        onClick={() => handleEdit(user.id)}
                        color="pink"
                        disabled={loading}
                      >
                        Editar
                      </ButtonView>
                      <ButtonView
                        type="button"
                        width="fit"
                        onClick={() => handleDelete(user.id)}
                        color="gray"
                        disabled={loading}
                      >
                        Excluir
                      </ButtonView>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-shrink-0">
              <ButtonView
                type="button"
                width="fit"
                onClick={handleAdd}
                color="pink"
              >
                ADICIONAR USUÁRIO
              </ButtonView>
            </div>
          </>
        ) : (
          <EditFormView
            title={selectedUser ? 'EDITAR USUÁRIO' : 'ADICIONAR USUÁRIO'}
            fields={userFormFields}
            initialData={selectedUser || {}}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
            showDeleteButton={false}
          />
        )}

        <AlertView
          isVisible={!!alertConfig}
          type={alertConfig?.type}
          message={alertConfig?.message}
          onClose={handleCloseAlert}
        />
      </SectionView>
    </div>
  )
}
