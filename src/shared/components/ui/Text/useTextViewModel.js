import { useState } from 'react'
import { TextModel } from './TextModel'
import { getTextThemeClasses } from '@shared/styles/theme'

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
 *   @property {string} finalClassName - The computed CSS class string for the text element.
 *   @property {string} elementType - The HTML element type ('p' or 'span').
 *   @property {boolean} isInline - Whether the element is inline (span).
 *
 * @example
 * const { hasContent, finalClassName } = useTextViewModel({ children: 'Hello', className: 'text-lg' });
 */

export function useTextViewModel({
  children = '',
  className = '',
  as = 'p'
} = {}) {
  const [model] = useState(() => new TextModel({ children, className, as }))

  const finalClassName = getTextThemeClasses({
    className: model.className,
  })

  return {
    hasContent: model.hasContent,
    finalClassName,
    elementType: model.as,
    isInline: model.isInline
  }
}
