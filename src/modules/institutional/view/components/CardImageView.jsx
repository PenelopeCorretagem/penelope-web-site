export function CardImageView({
  path,
  description,
  position = 'bottom-right',
  alt
}) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return '-translate-x-8 translate-y-8'
      case 'bottom-right':
        return 'translate-x-8 translate-y-8'
      case 'top-left':
        return '-translate-x-8 -translate-y-8'
      case 'top-right':
        return 'translate-x-8 -translate-y-8'
      default:
        return 'translate-x-8 translate-y-8'
    }
  }

  const getPaddingClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'pl-8 pb-8'
      case 'bottom-right':
        return 'pr-8 pb-8'
      case 'top-left':
        return 'pl-8 pt-8'
      case 'top-right':
        return 'pr-8 pt-8'
      default:
        return 'pr-8 pb-8'
    }
  }

  return (
    <div className='flex flex-col items-start gap-1.5'>
      <div className={`relative w-fit ${getPaddingClasses()}`}>
        <div className='relative z-0 w-fit rounded-md bg-brand-gradient'>
          <div className={`relative z-10 ${getPositionClasses()} rounded-md p-0.5 bg-brand-gradient`}>
            <img
              src={path}
              alt={alt}
              className="block rounded-md shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <p className='text-gray-700 mt-2 text-sm'>
        {description}
      </p>
    </div>
  )
}
