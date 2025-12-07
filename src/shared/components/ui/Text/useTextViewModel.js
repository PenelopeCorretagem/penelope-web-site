import { useState } from 'react'
import { TextModel } from './TextModel'

/**
 * Custom React hook to manage text content and its styling.
 *
 * @param {Object} [options] - Optional parameters for configuring the hook.
 * @param {string} [options.children=''] - The text content to be displayed.
 * @param {string} [options.className=''] - Additional CSS class names for styling the text.
 * @param {'p' | 'span'} [options.as='p'] - HTML element type to render.
 *
 * @returns {Object} - Returns an object containing:
 *   @property {boolean} hasContent - Indicates if the text content is not empty.
 *   @property {string} className - The CSS class names for the text element.
 *   @property {string} elementType - The HTML element type ('p' or 'span').
 *   @property {boolean} isInline - Whether the element is inline (span).
 *   @property {React.ReactNode} content - The text content to render.
 *
 * @example
 * const { hasContent, className } = useTextViewModel({ children: 'Hello', className: 'text-lg' });
 */

export function useTextViewModel({
  children = '',
  className = '',
  as = 'p'
} = {}) {
  const [model] = useState(() => new TextModel({ children, className, as }))

  return {
    hasContent: model.hasContent,
    className: model.className,
    elementType: model.as,
    isInline: model.isInline,
    content: model.children
  }
}
