import * as lucideIcons from 'lucide-react'

/**
 * lucideIconsUtil.js - Exporta dinamicamente todos os ícones do lucide-react
 * 
 * RESPONSABILIDADES:
 * - Fornecer lista completa e dinâmica de ícones do lucide-react (sem hardcoding)
 * - Permitir busca e filtro de ícones por nome
 * - Garantir que apenas componentes React (funções) válidas sejam considerados ícones
 */

/**
 * Cache interno para armazenar ícones já carregados
 */
let iconsCacheHolder = null

/**
 * Retorna array com TODOS os ícones disponíveis do lucide-react
 * Estratégia: pega TODAS as exportações em PascalCase que são funções.
 * Lucide-react segue convenção rigorosa: todos os ícones são nomeados em PascalCase,
 * e as únicas funções exportadas com esse padrão SÃO ícones.
 * 
 * @returns {string[]} Array ordenado com todos os nomes de ícones disponíveis
 */
export const getAllLucideIcons = () => {
  // Uso de cache para melhor performance
  if (iconsCacheHolder) {
    console.log(`✅ [lucideIconsUtil] Cache hit: ${iconsCacheHolder.length} ícones`)
    return iconsCacheHolder
  }

  // Simples e direto: pega todos os nomes que começam com maiúscula E são funções
  const allExportNames = Object.keys(lucideIcons)
  console.log(`📦 [lucideIconsUtil] Total de exports: ${allExportNames.length}`)
  
  const iconNames = allExportNames
    .filter(name => {
      // 1. Deve começar com letra maiúscula (PascalCase = padrão de ícones lucide)
      if (!/^[A-Z]/.test(name)) return false
      
      // 2. Lucide-react exporta ForwardRefExoticComponent, que são objetos com $$typeof
      const value = lucideIcons[name]
      if (!value || !value.$$typeof) return false
      
      // 3. Exclui alguns casos especiais que começa com maiúscula mas não é ícone
      if (['Fragment', 'createElement', 'default'].includes(name)) return false
      
      // 4. IMPORTANTE: Lucide exporta cada ícone 2x - uma versão normal e outra com sufixo "Icon"
      // Exemplo: "Home" e "HomeIcon" são o mesmo ícone
      // Vamos manter apenas a versão SEM sufixo "Icon" para evitar duplicatas
      if (name.endsWith('Icon')) return false
      
      return true
    })
    .sort()

  console.log(`✅ [lucideIconsUtil] Icons extraídos: ${iconNames.length}`)
  console.log(`📋 [lucideIconsUtil] Primeiros 10 ícones:`, iconNames.slice(0, 10))

  // DEBUG: Se retornar vazio, algo está errado
  if (iconNames.length === 0) {
    console.error('❌ [lucideIconsUtil] ERRO: Nenhum ícone foi carregado!')
  }

  iconsCacheHolder = iconNames
  return iconsCacheHolder
};

/**
 * Busca ícones por termo
 * @param {string} searchTerm - Termo para buscar
 * @returns {string[]} Array com ícones que correspondem ao termo
 */
export function searchIcons(searchTerm = '') {
  if (!searchTerm.trim()) return getAllLucideIcons()
  const term = searchTerm.toLowerCase()
  return getAllLucideIcons().filter(icon => icon.toLowerCase().includes(term))
}

/**
 * Valida se um ícone existe no lucide-react e pode ser renderizado
 * @param {string} iconName - Nome do ícone a validar
 * @returns {boolean} True se o ícone existe e é válido
 */
export function isValidIcon(iconName) {
  if (!iconName || typeof iconName !== 'string') return false
  
  // Verifica se o ícone está na lista de ícones válidos
  if (!getAllLucideIcons().includes(iconName)) return false
  
  // Dupla validação: verifica se realmente existe no objeto importado
  // Componentes Lucide são ForwardRefExoticComponent (typeof 'object', não 'function')
  const iconComponent = lucideIcons[iconName]
  return iconComponent && typeof iconComponent === 'object' && iconComponent.$$typeof
}
