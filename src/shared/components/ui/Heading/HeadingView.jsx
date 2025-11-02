import { useHeadingFactory } from './useHeadingViewModel'

/**
 * HeadingView component dynamically renders a semantic heading element (h1–h6)
 * with theme-based styling and accessibility attributes.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The text content or elements to be displayed inside the heading.
 * @param {number} [props.level=1] - The heading level (1–6), which determines the rendered tag (e.g., <h1>, <h2>).
 * @param {string} [props.className=''] - Additional CSS class names for custom styling.
 * @param {Object} [props.style={}] - Inline style object for additional customizations.
 * @param {Object} [props.props] - Any other valid HTML attributes to be spread onto the heading element.
 *
 * @returns {JSX.Element | null} - Returns a styled heading element if content exists, otherwise null.
 *
 * @example
 * <HeadingView level={2} color="primary" className="mb-4">
 *   Section Title
 * </HeadingView>
 */

export function HeadingView({
  children,
  level = 1,
  className = '',
  style = {},
  ...props
}) {
  const {
    componentTag,
    finalClassName,
    hasContent,
  } = useHeadingFactory({
    level,
    children,
    className,
  })

  if (!hasContent && !children) {
    return null
  }

  const Component = componentTag

  return (
    <Component
      className={`${finalClassName} ${className}`}
      style={style}
      role="heading"
      aria-level={level}
      {...props}
    >
      {children}
    </Component>
  )
}
