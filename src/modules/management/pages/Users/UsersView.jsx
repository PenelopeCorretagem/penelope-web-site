import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { useUsersViewModel } from './useUsersViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { UsersList } from '@management/components/UsersList/UsersList'
import { ArrowUpAZ, ArrowDownAZ, ArrowUpDown } from 'lucide-react'

export function UsersView() {
  const {
    users,
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
  } = useUsersViewModel()

  const headerHeight = useHeaderHeight()

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <ArrowUpAZ size={16} />
    if (sortOrder === 'desc') return <ArrowDownAZ size={16} />
    return <ArrowUpDown size={16} />
  }

  if (loading) {
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

  if (error) {
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
          Usuários
        </HeadingView>

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
                name="userTypeFilter"
                id="userTypeFilter"
                options={[
                  { value: 'TODOS', label: 'Todos os usuários' },
                  { value: 'ADMINISTRADOR', label: 'Administradores' },
                  { value: 'CLIENTE', label: 'Clientes' }
                ]}
                width="full"
                variant="brown"
                shape="square"
                hasLabel={false}
                onChange={(e) => handleUserTypeFilterChange(e.target.value)}
              />
            </div>
            <div className="w-full md:w-fit">
              <ButtonView
                type="button"
                width="fit"
                color={sortOrder !== 'none' ? 'pink' : 'brown'}
                onClick={handleSortOrderChange}
                shape="square"
                title={sortOrder === 'asc' ? 'Ordenação crescente (A → Z)' : sortOrder === 'desc' ? 'Ordenação decrescente (Z → A)' : 'Sem ordenação'}
              >
                {getSortIcon()}
              </ButtonView>
            </div>
          </div>
        </div>

        <UsersList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

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
