import { ArrowUpAZ, ArrowDownAZ, ArrowUpDown } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

/**
 * SortButtonView - Botão para alternar ordenação crescente/decrescente
 *
 * RESPONSABILIDADES:
 * - Exibir estado atual da ordenação (ASC, DESC ou none)
 * - Alternar entre estados ao clicar
 * - Fornecer ícone visual apropriado
 */
export function SortButtonView({
  sortOrder = 'none', // 'ascending', 'descending', 'none'
  onSortChange,
  title = 'Ordenar',
  width = 'fit',
  shape = 'square',
  color = 'brown',
}) {
  const handleClick = () => {
    let newOrder = 'ascending'
    if (sortOrder === 'ascending') {
      newOrder = 'descending'
    } else if (sortOrder === 'descending') {
      newOrder = 'none'
    }
    onSortChange(newOrder)
  }

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'ascending':
        return <ArrowUpAZ size={16} />
      case 'descending':
        return <ArrowDownAZ size={16} />
      default:
        return <ArrowUpDown size={16} />
    }
  }

  const getButtonColor = () => {
    if (sortOrder !== 'none') return 'pink'
    return color
  }

  return (
    <ButtonView
      type="button"
      width={width}
      color={getButtonColor()}
      onClick={handleClick}
      shape={shape}
      title={title}
    >
      {getSortIcon()}
    </ButtonView>
  )
}
