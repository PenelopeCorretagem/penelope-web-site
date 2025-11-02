/**
 * Adiciona o prefixo '!' dentro das variantes Tailwind (ex: md:, hover:, focus:) corretamente,
 * mas ignora classes que começam com o sinalizador '$'.
 *
 * @param {string|string[]|null|undefined} classes - Classes CSS como string, array ou valor falsy
 * @returns {string} String com todas as classes prefixadas corretamente com '!'
 *
 * @example
 * forceImportant('flex items-center md:p-0 hover:bg-red-500 ^p-4')
 * // '!flex !items-center md:!p-0 hover:!bg-red-500 p-4' ← ^p-4 foi ignorada
 */
export function forceImportant(classes) {
  if (!classes) return ''

  const classString = Array.isArray(classes) ? classes.join(' ') : String(classes)

  return classString
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(cls => {
      // Divide pelas variantes (ex: md:hover:p-4 -> ['md', 'hover', 'p-4'])
      const parts = cls.split(':')
      const last = parts.pop()

      // Se for marcado com '$', remove o marcador e não adiciona !
      if (last.startsWith('$')) {
        return [...parts, last.slice(1)].join(':')
      }

      // Se já tem '!', mantém; senão adiciona
      const importantLast = last.startsWith('!') ? last : `!${last}`

      return [...parts, importantLast].join(':')
    })
    .join(' ')
}

/**
 * Combina múltiplas strings de classes e força importância em todas,
 * respeitando o prefixo '$' (ignora força para essas classes).
 *
 * @param {...(string|string[]|null|undefined)} classGroups - Grupos de classes
 * @returns {string} String com todas as classes combinadas e prefixadas
 */
export function combineWithImportant(...classGroups) {
  const allClasses = classGroups
    .filter(Boolean)
    .map(group => Array.isArray(group) ? group.join(' ') : String(group))
    .join(' ')

  return forceImportant(allClasses)
}
