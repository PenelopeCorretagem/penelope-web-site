import { UserCard } from '../UserCard/UserCard'

export function UsersList({ users, onEdit, onDelete, loading = false }) {
  return (
    <div className="flex flex-col gap-card md:gap-card-md overflow-y-auto flex-1 p-4 bg-default-light-alt rounded-sm scrollbar-thin scrollbar-thumb-distac-secondary scrollbar-track-default-light-muted hover:scrollbar-thumb-distac-primary">
      <div className="flex flex-col gap-card md:gap-card-md overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-distac-secondary scrollbar-track-default-light-muted hover:scrollbar-thumb-distac-primary">
        {users.length === 0 ? (
          <div className="text-center text-default-dark-muted py-8">
            Nenhum usuário encontrado.
          </div>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>

  )
}
