/**
 * HeadingModel represents the data and validation logic for heading elements.
 * It manages level, content, and class name, ensuring values remain valid
 * according to the theme configuration and HTML heading standards.
 *
 * @class
 *
 * @param {Object} [options] - Optional configuration object.
 * @param {number|string} [options.level=1] - The heading level (1–6). Can be a number or string (e.g., 'h2').
 * @param {string|React.ReactNode} [options.children=''] - The heading content.
 * @param {string} [options.className=''] - Optional CSS class names for custom styling.
 *
 * @property {number} level - The validated heading level (1–6).
 * @property {string|React.ReactNode} children - The content of the heading.
 * @property {string} className - The CSS classes applied to the heading.
 * @property {string} componentTag - The HTML tag string representing the heading level (e.g., 'h1', 'h2').
 * @property {boolean} hasContent - Indicates whether the heading contains non-empty content.
 *
 * @example
 * const model = new HeadingModel({ level: 2, children: 'Section Title' });
 * console.log(model.componentTag); // "h2"
 * console.log(model.color); // "primary"
 * console.log(model.hasContent); // true
 */

export class HeadingModel {
  static VALID_LEVELS = [1, 2, 3, 4, 5, 6]

  constructor({
    level = 1,
    children = '',
    className = '',
  } = {}) {
    this.level = this.validateLevel(level)
    this.children = children
    this.className = String(className || '')
  }

  validateLevel(level) {
    if (typeof level === 'number' && level >= 1 && level <= 6) {
      return Math.floor(level)
    }
    if (typeof level === 'string') {
      const parsed = parseInt(level.replace(/\D/g, ''), 10)
      if (parsed >= 1 && parsed <= 6) {
        return parsed
      }
    }
    return 1
  }

  get componentTag() {
    return `h${this.level}`
  }

  get hasContent() {
    return Boolean(this.children)
  }
}
