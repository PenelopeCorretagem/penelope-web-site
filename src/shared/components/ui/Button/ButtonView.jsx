import { useButtonViewModel } from '@shared/components/ui/Button/useButtonViewModel'
import { Link } from 'react-router-dom'

/**
 * Mapeamento de variantes de cor para classes Tailwind.
 */
const COLOR_VARIANTS = {
  pink: {
    base: 'bg-distac-primary text-default-light',
    hover: 'hover:bg-distac-primary hover:text-default-light',
    active: 'bg-distac-primary text-default-light',
  },
  brown: {
    base: 'bg-distac-secondary text-default-light',
    hover: 'hover:bg-distac-primary hover:text-default-light',
    active: 'bg-distac-primary text-default-light',
  },
  'soft-brown': {
    base: 'bg-distac-secondary-light text-default-light',
    hover: 'hover:bg-distac-primary hover:text-default-light',
    active: 'bg-distac-primary text-default-light',
  },
  white: {
    base: 'bg-default-light-muted text-default-dark',
    hover: 'hover:bg-distac-primary hover:text-default-light',
    active: 'bg-distac-primary text-default-light',
  },
  gray: {
    base: 'bg-default-dark-muted text-default-light',
    hover: 'hover:bg-distac-primary hover:text-default-light',
    active: 'bg-distac-primary text-default-light',
  },
  'soft-gray': {
    base: 'bg-default-dark-light text-default-light',
    hover: 'hover:bg-distac-primary hover:text-default-light',
    active: 'bg-distac-primary text-default-light',
  },
  'border-white': {
    base: 'border-2 border-default-light bg-transparent text-default-light',
    hover: 'hover:border-default-light hover:bg-default-light hover:text-distac-primary',
    active: 'border-default-light bg-default-light text-distac-primary',
  },
  transparent: {
    base: 'bg-transparent text-default-light',
    hover: 'hover:text-default-light',
    active: 'text-default-light',
  },
}

const WIDTH_VARIANTS = {
  full: 'w-full',
  fit: 'w-fit',
  square: 'w-10 h-10',
  medium: 'w-12 h-12',
  large: 'w-14 h-14',
}

const SHAPE_VARIANTS = {
  square: 'rounded-sm',
  circle: 'rounded-full aspect-square',
}

/**
 * Compõe as classes CSS do botão baseado nas props.
 * Esta é a responsabilidade da View: definir como o componente é exibido.
 */
function getButtonClasses({ color, active, disabled, width, shape, className }) {
  const classes = []

  // Classes base (layout e tipografia)
  classes.push(
    'inline-flex',
    'items-center',
    'justify-center',
    'font-title',
    'font-bold',
    'uppercase',
    'leading-none',
    'text-base',
    'md:text-xl',
    'transition-all',
    'duration-200'
  )

  // Gap interno
  classes.push('gap-[var(--gap-button)]', 'md:gap-[var(--gap-button-md)]')

  // Padding baseado na forma
  if (shape === 'circle') {
    classes.push('p-[var(--padding-button-y)]', 'md:p-[var(--padding-button-y-md)]')
  } else {
    classes.push('p-[var(--padding-button)]', 'md:p-[var(--padding-button-md)]')
  }

  // Cor (base, hover e active)
  const colorVariant = COLOR_VARIANTS[color] || COLOR_VARIANTS.pink
  if (active) {
    classes.push(colorVariant.active)
  } else {
    classes.push(colorVariant.base)
    if (!disabled) {
      classes.push(colorVariant.hover)
    }
  }

  // Largura
  classes.push(WIDTH_VARIANTS[width] || WIDTH_VARIANTS.full)

  // Forma
  classes.push(SHAPE_VARIANTS[shape] || SHAPE_VARIANTS.square)

  // Estados interativos
  if (disabled) {
    classes.push('cursor-not-allowed', 'pointer-events-none', 'opacity-50')
  } else {
    classes.push('hover:scale-105')
  }

  // Classes customizadas por último para permitir sobrescrita com !important
  if (className) {
    classes.push(className)
  }

  return classes.join(' ')
}

/**
 * ButtonView - Componente visual do botão.
 *
 * Renderiza um botão estilizado com base em seu estado e propriedades
 * definidas pelo ViewModel (`useButtonViewModel`).
 *
 * **Responsável por toda a lógica de estilização visual.**
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
  // ViewModel fornece apenas dados e comportamento
  const {
    type: buttonType,
    to: buttonTo,
    isLink,
    active: modelActive,
    disabled: modelDisabled,
    handleClick,
  } = useButtonViewModel(children, color, type, { onClick }, to)

  // View compõe os estilos visuais
  const buttonClasses = getButtonClasses({
    color,
    active: active || modelActive,
    disabled: disabled || modelDisabled,
    width,
    shape,
    className,
  })

  if (isLink && buttonTo) {
    return (
      <Link
        to={buttonTo}
        className={buttonClasses}
        onClick={handleClick}
        aria-pressed={active || modelActive}
        aria-disabled={disabled || modelDisabled}
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
        aria-pressed={active || modelActive}
        aria-disabled={disabled || modelDisabled}
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
      disabled={disabled || modelDisabled}
      aria-pressed={active || modelActive}
      title={title}
      {...props}
    >
      {children}
    </button>
  )
}
