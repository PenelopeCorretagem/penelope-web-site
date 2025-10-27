import { getTextThemeClasses } from '@shared/styles/theme'

/**
 * TextView component renders styled text content using theme-based classes.
 * Supports both span and p elements based on the 'as' prop.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The text content or elements to be displayed.
 * @param {string} [props.className=''] - Optional CSS class names to extend or override theme styles.
 * @param {'p' | 'span'} [props.as='p'] - HTML element type to render (p or span).
 *
 * @returns {JSX.Element | null} - Returns a styled element if content exists, otherwise null.
 *
 * @example
 * <TextView className="text-lg text-gray-600">Lorem ipsum dolor sit amet.</TextView>
 * <TextView as="span" className="text-sm font-bold">Inline text</TextView>
 */
export function TextView({ children, className = '', as = 'p' }) {
  if (!children) return null

  const finalClassName = getTextThemeClasses({ className })
  const Component = as === 'span' ? 'span' : 'p'

  return <Component className={finalClassName}>{children}</Component>
}
