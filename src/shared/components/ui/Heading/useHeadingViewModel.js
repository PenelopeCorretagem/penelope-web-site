import { useState } from 'react'
import { HeadingModel } from './HeadingModel'

// Classes Tailwind diretas
const HEADING_LEVELS = {
  1: 'text-[28px] font-bold md:text-[44px]',
  2: 'text-[24px] font-semibold md:text-[38px]',
  3: 'text-[20px] font-semibold md:text-[32px]',
  4: 'text-[16px] font-medium md:text-[26px]',
  5: 'text-[12px] font-medium md:text-[20px]',
  6: 'text-[8px] font-normal md:text-[14px]',
}
const HEADING_BASE_CLASSES = 'w-fit font-title text-default-dark leading-none uppercase'

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

  // Se className contém classes de cor, não aplicar a cor padrão do tema
  const hasColorClass = model.className.includes('text-')
  const baseClasses = hasColorClass
    ? HEADING_BASE_CLASSES.replace('text-default-dark', '')
    : HEADING_BASE_CLASSES

  const levelClasses = HEADING_LEVELS[model.level] || HEADING_LEVELS[1]
  const finalClassName = [baseClasses, levelClasses, model.className].filter(Boolean).join(' ')

  return {
    componentTag: model.componentTag,
    hasContent: model.hasContent,
    finalClassName,
  }
}
