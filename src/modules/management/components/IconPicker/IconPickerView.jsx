import { useState, useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { X, Search } from 'lucide-react'
import { getAllLucideIcons, isValidIcon } from '@management/utils/lucideIconsUtil'

/**
 * IconPickerView - Modal para seleção de ícones do lucide-react
 *
 * RESPONSABILIDADES:
 * - Exibir lista completa de ícones do lucide-react
 * - Permitir busca/filtro de ícones
 * - Permitir seleção de ícone
 */
export function IconPickerView({ isOpen, onClose, onSelectIcon, currentIcon }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Usa lista completa de ícones do lucide
  const availableIcons = useMemo(() => {
    const icons = getAllLucideIcons()
    console.log('📦 Ícones carregados:', icons.length)
    return icons
  }, [])

  // Filtra ícones baseado no search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) {
      console.log(`🔍 [IconPicker] Sem filtro: ${availableIcons.length} ícones`)
      return availableIcons
    }

    const result = availableIcons.filter(icon =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    )
    console.log(`🔍 [IconPicker] Filtro "${searchTerm}": ${result.length} de ${availableIcons.length}`)
    return result
  }, [availableIcons, searchTerm])

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-default-dark">Selecionar Ícone</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar ícone (ex: wifi, home, bell)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-distac-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {console.log(`🎨 [IconPicker Grid] Renderizando ${filteredIcons.length} ícones`)}
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
            <div className="flex items-center justify-center h-full text-slate-500">
              Nenhum ícone encontrado
            </div>
          )}
        </div>

        {/* Footer com contagem */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-muted">
            {filteredIcons.length} de {availableIcons.length} ícones
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-distac-primary text-white rounded-md font-medium hover:bg-opacity-90 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
