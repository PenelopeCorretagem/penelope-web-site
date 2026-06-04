import * as LucideIcons from 'lucide-react'
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { isValidIcon } from '@shared/utils/lucideIcons/lucideIconsUtil'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

/**
 * AmenitiesTableView.jsx
 * Componente de apresentação da tabela de resultados de amenities.
 */

const getIconElement = (iconName) => {
  if (!isValidIcon(iconName)) {
    return <span className="text-xs text-gray-400">Sem ícone</span>
  }

  try {
    const Icon = LucideIcons[iconName]
    return <Icon size={20} className="text-white" />
  } catch {
    return <span className="text-xs text-gray-400">Erro</span>
  }
}

export function AmenitiesTableView({
  amenities = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalElements = 0,
  onEdit,
  onDelete,
  onPreviousPage,
  onNextPage,
}) {
  const showSkeleton = useMinLoadingTime(loading && amenities.length === 0);
  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-default-light rounded-lg shadow min-h-0">
      {showSkeleton ? (
        <div className="flex-1 flex flex-col p-4 space-y-4">
           {/* Header Skeleton */}
           <SkeletonView className="h-10 w-full" />
           {/* Rows Skeleton */}
           <SkeletonView className="h-12 w-full" />
           <SkeletonView className="h-12 w-full" />
           <SkeletonView className="h-12 w-full" />
           <SkeletonView className="h-12 w-full" />
           <SkeletonView className="h-12 w-full" />
        </div>
      ) : (
        <>
          <div className="bg-default-light border-b border-default-light-muted">
            <div className="overflow-y-scroll invisible">
              <table className="w-full table-fixed visible bg-default-light">
                <colgroup>
                  <col className="w-[100px]" />
                  <col className="w-auto" />
                  <col className="w-[160px]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark border-r border-default-light-muted uppercase">
                      Ícone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark border-r border-default-light-muted uppercase">
                      Diferencial
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-default-dark uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <div className="overflow-y-scroll flex-1 min-h-0">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[100px]" />
                <col className="w-auto" />
                <col className="w-[160px]" />
              </colgroup>
              <tbody className="divide-y divide-default-light-muted">
                {amenities.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-muted">
                      Nenhum diferencial cadastrado. Clique em 'Adicionar Diferencial' para começar.
                    </td>
                  </tr>
                ) : (
                  amenities.map((amenity) => (
                    <tr key={amenity.id} className="hover:bg-default-light transition">
                      <td className="px-6 py-3 text-default-dark border-r border-default-light-muted flex items-center justify-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-distac-primary">
                          {getIconElement(amenity.icon)}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-default-dark font-medium border-r border-default-light-muted">
                        {amenity.description}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ButtonView
                            onClick={() => onEdit(amenity)}
                            shape="square"
                            width="fit"
                            color="pink"
                            title="Editar"
                            disabled={loading}
                          >
                            <Edit2 size={18} />
                          </ButtonView>
                          <ButtonView
                            onClick={() => onDelete(amenity.id)}
                            shape="square"
                            width="fit"
                            color="pink"
                            title="Deletar"
                            disabled={loading}
                          >
                            <Trash2 size={18} />
                          </ButtonView>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex-shrink-0 border-t border-default-light-muted bg-default-light px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-muted">
                Página <span className="font-semibold text-default-dark">{currentPage}</span> de{' '}
                <span className="font-semibold text-default-dark">{totalPages}</span>
                {totalElements > 0 && (
                  <span className="ml-2 text-xs">
                    ({totalElements} {totalElements === 1 ? 'item' : 'itens'})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 px-4">
                <ButtonView
                  onClick={onPreviousPage}
                  disabled={currentPage === 1 || loading}
                  shape="square"
                  width="fit"
                  color="gray"
                  title="Página anterior"
                >
                  <ChevronLeft size={18} />
                </ButtonView>
                <ButtonView
                  onClick={onNextPage}
                  disabled={currentPage === totalPages || loading}
                  shape="square"
                  width="fit"
                  color="gray"
                  title="Próxima página"
                >
                  <ChevronRight size={18} />
                </ButtonView>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
