import { useButtonViewModel } from '@shared/components/ui/Button/useButtonViewModel'
import { Link } from 'react-router-dom'

/**
 * ButtonView - Componente visual do botão.
 *
 * Renderiza um botão estilizado com base em seu estado e propriedades
 * definidas pelo ViewModel (`useButtonViewModel`).
 *
 * Suporta três variações:
 * - **Botão normal:** usa `<button>`;
 * - **Link interno:** usa `<Link>` (React Router);
 * - **Link externo:** usa `<a>`.
 *
 * Implementa a camada **View** do padrão **MVVM (Model–View–ViewModel)**.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {string|JSX.Element} [props.children=''] - Conteúdo do botão.
 * @param {string} [props.color='pink'] - Cor visual.
 * @param {string} [props.type='button'] - Tipo (button, submit, reset, link).
 * @param {string|null} [props.to=null] - Caminho interno (para `<Link>`).
 * @param {string|null} [props.href=null] - URL externa (para `<a>`).
 * @param {string} [props.width='full'] - Largura (full, auto, etc.).
 * @param {string} [props.shape='square'] - Formato visual.
 * @param {string} [props.className=''] - Classes CSS adicionais.
 * @param {Function} [props.onClick] - Função de callback ao clicar.
 * @param {boolean} [props.disabled=false] - Define se está desabilitado.
 * @param {boolean} [props.active=false] - Define se está ativo.
 * @param {string} [props.title] - Texto alternativo (tooltip/acessibilidade).
 * @returns {JSX.Element|null} Elemento JSX do botão.
 */
export function ButtonView({
  children = '',
  color = 'pink',
  type = 'button',
  to = null,
  href = null,
  width = 'full',
  shape = 'square',
  className = '',
  onClick,
  disabled = false,
  active = false,
  title,
  ...props
}) {
  const {
    type: buttonType,
    to: buttonTo,
    isLink,
    handleClick,
    getButtonClasses,
  } = useButtonViewModel(children, color, type, { onClick }, to)

  const buttonClasses = getButtonClasses(width, shape, className, disabled, active)

  if (isLink && buttonTo) {
    return (
      <Link
        to={buttonTo}
        className={buttonClasses}
        onClick={handleClick}
        aria-pressed={active}
        aria-disabled={disabled}
        role="button"
        title={title}
        {...props}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={handleClick}
        aria-pressed={active}
        aria-disabled={disabled}
        title={title}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={buttonType}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={active}
      title={title}
      {...props}
    >
      {children}
    </button>
  )
}
