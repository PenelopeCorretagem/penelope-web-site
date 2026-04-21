import { useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { X } from 'lucide-react'
import { getAllLucideIcons, isValidIcon } from '@management/utils/lucideIconsUtil'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { SortButtonView } from '@shared/components/ui/SortButton/SortButtonView'
import { useIconPickerViewModel } from './useIconPickerViewModel'

/**
 * IconPickerView - Modal para seleção de ícones do lucide-react
 *
 * RESPONSABILIDADES:
 * - Exibir lista de ícones com filtros
 * - Permitir busca, ordenação e filtro por inicial
 * - Permitir seleção de ícone
 */
export function IconPickerView({ isOpen, onClose, onSelectIcon, currentIcon }) {
  const {
    filters,
    filteredIcons,
    availableInitials,
    handleFiltersChange,
    handleResetFilters,
  } = useIconPickerViewModel(isOpen)

  const availableIcons = useMemo(() => {
    return getAllLucideIcons()
  }, [])

  const renderIcon = (iconName, isSelected) => {
    if (!iconName) {
      return <span className="text-xs text-gray-400">?</span>
    }

    try {
      const Icon = LucideIcons[iconName]
      
      if (!Icon) {
        console.warn(`❌ Ícone "${iconName}" não existe em LucideIcons`)
        return <span className="text-xs text-gray-400">N/A</span>
      }
      
      // Lucide icons são ForwardRefExoticComponent (typeof 'object'), não funções
      // React consegue renderizá-los sem problema
      return <Icon size={24} strokeWidth={2} className={isSelected ? 'text-white' : 'text-default-dark'} />
    } catch (error) {
      console.error(`❌ Erro renderizando "${iconName}":`, error?.message || error)
      return <span className="text-xs text-red-500">Erro</span>
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-0 left-0 w-full h-full z-40 flex items-center justify-center">
      <div className=' bg-default-dark opacity-70 w-full h-full'></div>
      
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full h-[70vh] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-default-dark">Selecionar Ícone</h3>
          <ButtonView
            onClick={onClose}
            shape="square"
            width="fit"
            color="white"
            title="Fechar"
          >
            <X size={20} />
          </ButtonView>
        </div>

        {/* Search and Filters */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <InputView
                type="text"
                placeholder="Buscar ícone (ex: wifi, home, bell)..."
                value={filters.searchTerm}
                onChange={(value) => handleFiltersChange('searchTerm', value)}
                hasLabel={false}
                isActive={true}
              />
            </div>

            {/* Inicial Letter Filter */}
            <div className="w-full md:w-fit">
              <SelectView
                value={filters.initialLetter}
                name="initialLetter"
                id="initialLetter"
                options={[
                  { value: '', label: 'Todas as letras' },
                  ...availableInitials.map(letter => ({
                    value: letter,
                    label: letter,
                  })),
                ]}
                width="fit"
                variant="brown"
                shape="square"
                hasLabel={false}
                onChange={(e) => handleFiltersChange('initialLetter', e.target.value)}
              />
            </div>

            {/* Sort Button */}
            <div className="w-full md:w-fit">
              <SortButtonView
                sortOrder={filters.sortOrder === 'ascending' ? 'ascending' : filters.sortOrder === 'descending' ? 'descending' : 'none'}
                onSortChange={(newOrder) => handleFiltersChange('sortOrder', newOrder)}
                title="Ordenar A-Z"
                width="fit"
                shape="square"
                color="brown"
              />
            </div>
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4 h-full flex flex-col">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredIcons.map(iconName => (
              <button
                key={iconName}
                onClick={() => onSelectIcon(iconName)}
                className={`p-3 rounded-lg transition flex flex-col items-center justify-center gap-1 min-h-24 ${
                  currentIcon === iconName
                    ? 'bg-distac-primary text-white ring-2 ring-distac-primary'
                    : 'bg-slate-50 text-default-dark hover:bg-slate-100 border border-slate-200'
                }`}
                title={iconName}
              >
                <div className="flex items-center justify-center h-6">
                  {renderIcon(iconName, currentIcon === iconName)}
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center">{iconName}</span>
              </button>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="flex items-center justify-center flex-1">
              <p className="text-lg text-slate-400">Nenhum ícone encontrado com esses critérios.</p>
            </div>
          )}
        </div>

        {/* Footer com contagem */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-muted">
            {filteredIcons.length} de {availableIcons.length} ícones
          </span>
          <ButtonView
            onClick={onClose}
            width="fit"
          >
            Fechar
          </ButtonView>
        </div>
      </div>
    </div>
  )
}
