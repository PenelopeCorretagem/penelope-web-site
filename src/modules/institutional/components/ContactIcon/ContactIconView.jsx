import { useContactIconViewModel } from '@institutional/components/ContactIcon/useContactIconViewModel'

export function ContactIconView({ children, size, onClick, href, className }) {
  const {
    validation,
    finalClassName,
    isLink,
    handleClick
  } = useContactIconViewModel({ children, size, onClick, href, className })

  const iconContent = (
    <>
      {children}
    </>
  )

  if (isLink) {
    return (
      <a
        href={href}
        className={finalClassName}
        onClick={handleClick}
        title={!validation.isValid ? validation.errors.join(', ') : undefined}
        target="_blank"
        rel="noopener noreferrer"
      >
        {iconContent}
      </a>
    )
  }

  return (
    <button
      className={finalClassName}
      onClick={handleClick}
      title={!validation.isValid ? validation.errors.join(', ') : undefined}
      type="button"
    >
      {iconContent}
    </button>
  )
}
