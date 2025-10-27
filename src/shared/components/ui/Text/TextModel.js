/**
 * TextModel class encapsulates text content and its properties.
 *
 * @class
 * @param {Object} options - Optional configuration object.
 * @param {string} [options.children=''] - The text content to store in the model.
 * @param {string} [options.className=''] - Optional CSS class name associated with the text.
 * @param {'p' | 'span'} [options.as='p'] - HTML element type (p or span).
 *
 * @property {string} children - The text content of the model.
 * @property {string} className - The CSS class associated with the text.
 * @property {boolean} hasContent - Indicates whether the text content is non-empty.
 *
 * @example
 * const textModel = new TextModel({ children: 'Hello', className: 'text-lg' });
 * console.log(textModel.hasContent); // true
 */

export class TextModel {
  constructor({ children = '', className = '', as = 'p' } = {}) {
    this.children = children
    this.className = String(className || '')
    this.as = as === 'span' ? 'span' : 'p'
  }

  get hasContent() {
    return Boolean(this.children)
  }

  get isInline() {
    return this.as === 'span'
  }
}
