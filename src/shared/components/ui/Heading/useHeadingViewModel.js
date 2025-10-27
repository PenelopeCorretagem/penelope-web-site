import { useState } from 'react'
import { HeadingModel } from './HeadingModel'
import { getHeadingThemeClasses } from '@shared/styles/theme'

/**
 * Custom React hook that creates and manages a heading element’s configuration and styling.
 * It instantiates a HeadingModel and generates the final CSS class string based on theme settings.
 *
 * @param {Object} [options] - Optional configuration parameters.
 * @param {number} [options.level=1] - The heading level (1–6), determining the semantic tag (e.g., h1–h6).
 * @param {string | React.ReactNode} [options.children=''] - The text content or elements inside the heading.
 * @param {string} [options.className=''] - Additional CSS class names to apply.
 *
 * @returns {Object} - Returns an object containing:
 *   @property {string} componentTag - The appropriate heading tag (e.g., 'h1', 'h2', etc.).
 *   @property {boolean} hasContent - Indicates whether the heading contains content.
 *   @property {string} finalClassName - The computed CSS class string for the heading element.
 *
 * @example
 * const { componentTag: Tag, finalClassName } = useHeadingFactory({
 *   level: 2,
 *   children: 'Section Title',
 * });
 *
 * return <Tag className={finalClassName}>Section Title</Tag>;
 */

export function useHeadingFactory({
  level = 1,
  children = '',
  className = '',
} = {}) {
  const [model] = useState(() => new HeadingModel({ level, children, className }))

  const finalClassName = getHeadingThemeClasses({
    level: model.level,
    className: model.className,
  })

  return {
    componentTag: model.componentTag,
    hasContent: model.hasContent,
    finalClassName,
  }
}
