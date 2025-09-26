/**
 * Text - Componente base para textos
 * Aplica estilos padrão de texto com responsividade
 * @param {Node} children - Conteúdo do texto
 * @param {string} className - Classes CSS adicionais
 */
export function Text({ children, className }) {
  return (
    <p
      className={`font-default-family text-brand-black text-[12px] leading-none md:text-[16px] ${className}`}
    >
      {children}
    </p>
  )
}
