import { ButtonView } from '@shared/components/ui/Button/ButtonView'

export function UserCard({ user, onEdit, onDelete, loading = false }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-default-light flex-shrink-0">
      <div>
        <span className="font-medium text-default-dark">
          {user.nomeCompleto || user.name}
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
          onClick={() => onEdit(user.id)}
          color="pink"
          disabled={loading}
        >
          Editar
        </ButtonView>
        <ButtonView
          type="button"
          width="fit"
          onClick={() => onDelete(user.id)}
          color="gray"
          disabled={loading}
        >
          Excluir
        </ButtonView>
      </div>
    </div>
  )
}
