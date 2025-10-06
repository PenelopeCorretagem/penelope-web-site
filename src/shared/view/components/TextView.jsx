/**
 * Text - Componente base para textos
 * Aplica estilos padrão de texto com responsividade
 * @param {Node} children - Conteúdo do texto
 * @param {string} className - Classes CSS adicionais
 */
export function TextView({ children, color = 'black', className }) {

  const textColors = {
    black: 'text-brand-black',
    white: 'text-brand-white',
  }

  const ensureTextColor = textColor => {
    const textColorValue = String(textColor).trim()

    if (!Object.keys(textColors).includes(textColorValue)) {
      throw new Error(`Cor inválida: ${textColor}`)
    }

    return textColors[textColorValue]
  }

  return (
    <p
      className={`font-default-family ${ensureTextColor(color)} text-[12px] leading-none md:text-[16px] ${className}`}
    >
      {children}
    </p>
  )
}
