/** @type {import('tailwindcss').Config} */
export default {
  // A correção está aqui. O padrão "./src/**/*.{js,jsx,ts,tsx}"
  // garante que CADA pasta dentro de 'src' seja lida.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
 theme: {
    extend: {
      colors: {
        'surface-primary': 'var(--color-surface-primary)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-tertiary': 'var(--color-surface-tertiary)',
        'text-primary': 'var(--color-text-primary)',
        'brand-primary': 'var(--color-brand-primary)',
        'brand-primary-soft': 'var(--color-brand-primary-soft)',
        'brand-secondary': 'var(--color-brand-secondary)',
        'brand-secondary-soft': 'var(--color-brand-secondary-soft)',
      },
      padding: {
        'button': 'var(--padding-button)',
        'button-y': 'var(--padding-button-y)',
      },
      fontFamily: {
        agh1: ['Agh1', 'sans-serif'],
        agh2: ['Agh2', 'sans-serif'],
        agh3: ['Agh3', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        'title-family': ['Darker Grotesque', 'sans-serif'],
      },
      fontSize: {
        '32px': ['32px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
}
