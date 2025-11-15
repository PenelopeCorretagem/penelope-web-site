import { Link } from 'react-router-dom'
import { useButtonViewModel } from './useButtonViewModel'

export function ButtonView(props) {
  const {
    model,
    classes,
    handleClick,
    isLink,
    to,
    type,
    disabled
  } = useButtonViewModel(props)

  if (isLink && to) {
    return (
      <Link
        to={to}
        className={classes}
        onClick={handleClick}
        aria-disabled={disabled}
        aria-pressed={model.active}
        role="button"
        title={props.title}
      >
        {model.text}
      </Link>
    )
  }

  if (props.href) {
    return (
      <a
        href={props.href}
        className={classes}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-pressed={model.active}
        aria-disabled={disabled}
        title={props.title}
      >
        {model.text}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={handleClick}
      aria-pressed={model.active}
      title={props.title}
    >
      {model.text}
    </button>
  )
}
