export const theme = {
  button: {
    base: [
      'inline-flex items-center justify-center gap-2',
      'font-title-family font-bold',
      'text-[16px] md:text-[20px]',
      'leading-none',
      'uppercase',
      'transition-all duration-200',
      'hover:scale-105'
    ].join(' '),
    padding: {
      default: 'px-4 py-2',
      circle: 'p-button-y', // Padding igual em todos os lados para círculo
    },
    colors: {
      pink: {
        base: 'bg-brand-pink text-brand-white',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      brown: {
        base: 'bg-brand-brown text-brand-white',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      'soft-brown': {
        base: 'bg-brand-soft-brown text-brand-white',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      white: {
        base: 'bg-brand-white text-brand-black',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      gray: {
        base: 'bg-brand-gray text-brand-white',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      'border-white': {
        base: 'border-2 border-brand-white bg-transparent text-brand-white',
        active: 'border-2 border-brand-white bg-brand-white text-brand-pink',
        hover: 'hover:border-2 hover:border-brand-white hover:bg-brand-white hover:text-brand-pink',
      },
      transparent: {
        base: 'bg-transparent text-brand-white',
        active: 'text-brand-white',
        hover: 'hover:text-brand-white',
      }
    },
    width: {
      full: 'w-full',
      fit: 'w-fit',
      square: 'w-10 h-10', // Para botões circulares pequenos
      medium: 'w-12 h-12', // Para botões circulares médios
      large: 'w-14 h-14', // Para botões circulares grandes
    },
    shape: {
      square: 'rounded-sm',
      circle: 'rounded-full aspect-square',
    },
    state: {
      disabled: 'cursor-not-allowed pointer-events-none opacity-50',
      enabled: 'cursor-pointer',
    }
  },
  arrowBack: {
    base: [
      'font-semibold',
      'cursor-pointer',
      'transition-all duration-300',
      'hover:scale-105',
      'focus:outline-none'
    ].join(' '),
    colors: {
      default: 'text-brand-dark-gray hover:text-brand-pink',
    },
    state: {
      disabled: 'opacity-50 cursor-not-allowed',
      enabled: 'cursor-pointer',
    },
    icon: {
      base: 'inline',
    }
  },
  logo: {
    base: 'fill-current transition-colors duration-200',
    colors: {
      pink: 'text-brand-pink',
      brown: 'text-brand-brown',
      white: 'text-brand-white',
      black: 'text-brand-black',
      custom: '',
    },
    state: {
      disabled: 'opacity-50 filter grayscale',
      invalid: 'opacity-80',
      normal: '',
    }
  },
  heading: {
    base: [
      'w-fit',
      'font-title-family',
      'leading-none',
      'uppercase',
    ].join(' '),
    levels: {
      1: 'text-[28px] font-bold md:text-[44px]',
      2: 'text-[24px] font-semibold md:text-[38px]',
      3: 'text-[20px] font-semibold md:text-[32px]',
      4: 'text-[16px] font-medium md:text-[26px]',
      5: 'text-[12px] font-medium md:text-[20px]',
      6: 'text-[8px] font-normal md:text-[14px]',
    },
    colors: {
      black: 'text-brand-black',
      pink: 'text-brand-pink',
      white: 'text-brand-white',
      brown: 'text-brand-brown',
      softBrown: 'text-brand-soft-brown',
      gray: 'text-brand-gray',
    }
  },
  text: {
    base: [
      'font-default-family',
      'text-[12px]',
      'leading-none',
      'md:text-[16px]',
      'text-brand-black',
    ].join(' '),
  },
  label: {
    base: [
      'inline-block rounded font-medium',
      'transition-all duration-200',
    ].join(' '),
    variants: {
      pink: 'bg-brand-pink text-brand-white',
      softPink: 'bg-brand-soft-pink text-brand-white',
      brown: 'bg-brand-brown text-brand-white',
      softBrown: 'bg-brand-soft-brown text-brand-white',
      gray: 'bg-brand-white-tertiary text-brand-black',
    },
    sizes: {
      small: 'text-[12px] px-2 py-1',
      medium: 'text-[16px] px-3 py-2',
      large: 'text-[20px] px-4 py-3',
    },
    state: {
      empty: 'opacity-60',
      invalid: 'border border-yellow-400',
      normal: '',
    }
  },
  input: {
    container: 'w-full flex flex-col gap-2',
    input: {
      base: [
        'w-full px-4 py-2 rounded-sm',
        'transition-colors duration-200',
        'placeholder:text-brand-dark-gray',
        'placeholder:text-[12px] md:placeholder:text-[16px]',
        'placeholder:uppercase placeholder:font-default-family'
      ].join(' '),
      state: {
        active: 'bg-brand-soft-pink focus:bg-brand-white focus:ring-2 focus:ring-brand-pink focus:outline-none',
        inactive: 'bg-brand-white-terciary',
        disabled: 'cursor-not-allowed opacity-60',
        enabled: 'hover:bg-opacity-80',
        error: 'border-2 border-brand-pink focus:ring-brand-pink',
        normal: '',
      }
    },
    label: {
      base: [
        'uppercase font-semibold font-default-family',
        'text-[12px] leading-none md:text-[16px]'
      ].join(' '),
      state: {
        error: 'text-brand-pink',
        normal: 'text-brand-dark-gray',
      },
      required: 'after:content-["*"] after:text-brand-pink after:ml-1'
    },
    error: 'text-brand-pink text-sm mt-1'
  },
  image: {
    modes: {
      image: {
        base: 'max-h-72 min-w-lg rounded-sm border-transparent bg-gradient-to-t from-brand-brown to-brand-pink p-0.5 w-fit',
      },
      background: {
        base: 'bg-cover bg-center bg-no-repeat',
      }
    },
    container: 'flex flex-col gap-card md:gap-card-md',
    placeholder: 'flex-1 flex items-center justify-center bg-brand-white-secondary',
    placeholderIcon: 'w-[100px] h-[100px] text-brand-white-tertiary',
    description: 'text-brand-dark-gray'
  },
  cardImage: {
    container: 'flex flex-col items-start gap-1.5',
    imageWrapper: 'relative w-fit',
    background: 'relative z-0 w-fit rounded-sm bg-brand-gradient',
    imageContainer: 'relative z-10',
    image: 'block rounded-sm shadow-sm object-cover',
    description: 'text-brand-dark-gray mt-2 text-sm',
    positions: {
      'bottom-left': {
        transform: '-translate-x-8 translate-y-8',
        padding: 'pl-8 pb-8'
      },
      'bottom-right': {
        transform: 'translate-x-8 translate-y-8',
        padding: 'pr-8 pb-8'
      },
      'top-left': {
        transform: '-translate-x-8 -translate-y-8',
        padding: 'pl-8 pt-8'
      },
      'top-right': {
        transform: 'translate-x-8 -translate-y-8',
        padding: 'pr-8 pt-8'
      }
    }
  },
  form: {
    container: 'w-full flex flex-col gap-6 items-center',
    title: 'text-center text-brand-pink',
    subtitle: 'text-center text-brand-dark-gray',
    fieldContainer: 'w-full',
    errorContainer: 'w-full',
    successContainer: 'w-full p-4 bg-green-100 border border-green-400 text-green-700 rounded',
    footer: 'w-full text-center',
    state: {
      loading: 'opacity-50 cursor-not-allowed',
      normal: '',
    }
  },
  footer: {
    container: [
      'flex flex-col items-center justify-center',
      'p-section md:p-section-md',
      'w-full h-auto',
      'gap-subsection md:gap-subsection-md'
    ].join(' '),
    copyright: [
      'w-full text-center',
      'border-t-2 border-brand-white-tertiary',
      'pt-section-y'
    ].join(' '),
  },
  header: {
    container: [
      'w-full',
      'bg-brand-white-secondary',
      'transition-all duration-300',
      'p-header md:p-header-md',
    ].join(' '),
    sticky: 'sticky top-0 z-50',
    shadow: 'shadow-lg',
    content: [
      'flex items-center justify-between',
    ].join(' '),
    logo: {
      sizes: {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12',
        extraLarge: 'w-14 h-14',
      }
    }
  },
  navMenu: {
    container: [
      'flex items-center justify-end md:justify-between',
      'w-full h-fit'
    ].join(' '),
    menuItems: {
      base: [
        'items-center gap-2',
        'flex-1 justify-center',
        'hidden md:flex'
      ].join(' '),
      mobile: [
        'md:hidden flex absolute top-full left-0 right-0',
        'flex-col bg-white shadow-lg p-4 z-50'
      ].join(' ')
    },
    userActions: {
      base: [
        'items-center gap-2',
        'w-fit',
        'hidden md:flex'
      ].join(' '),
      mobile: [
        'md:hidden flex absolute top-[calc(100%+var(--menu-items-height))]',
        'left-0 right-0 justify-center bg-white shadow-lg p-4 z-50'
      ].join(' ')
    },
    hamburger: [
      'hidden max-md:flex',
      'items-center justify-center',
      'w-10 h-10',
      'text-2xl',
      'cursor-pointer',
      'transition-colors duration-200',
      'hover:text-primary-600'
    ].join(' '),
    colors: {
      default: {
        base: 'bg-brand-white-tertiary text-brand-black',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      destac: {
        base: 'bg-brand-brown text-brand-white',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      }
    },
    footer: {
      container: [
        'flex flex-col md:flex-row items-center md:items-start',
        'justify-between w-full h-fit gap-subsection md-gap-0'
      ].join(' '),
      logoSection: 'flex flex-col items-center md:items-start justify-between h-24',
      section: 'flex flex-col items-center md:items-start gap-2',
      sectionTitle: 'text-brand-pink font-extrabold',
      sectionLink: [
        'hover:text-brand-pink hover:underline',
        'transition-colors duration-200',
        'uppercase cursor-pointer'
      ].join(' '),
      disabledLink: 'cursor-not-allowed opacity-50'
    }
  },
  section: {
    base: 'section w-full h-fit',
    padding: {
      default: 'p-section md:p-section-md',
    },
    gap: {
      default: 'gap-section md:gap-section-md',
    },
    background: {
      white: 'bg-brand-white',
      'white-secondary': 'bg-brand-white-secondary',
      pink: 'bg-brand-pink',
      pinkGradient: 'bg-brand-gradient',
    }
  },
  auth: {
    container: {
      base: 'relative w-full h-full bg-brand-white overflow-hidden transition-all duration-700 ease-in-out',
      active: 'active'
    },
    signInPanel: {
      base: 'absolute top-0 left-0 w-3/5 h-full bg-brand-white z-20 p-section md:p-section-md flex flex-col items-center justify-center transition-all duration-700 ease-in-out'
    },
    signUpPanel: {
      base: 'absolute top-0 right-0 w-3/5 h-full bg-brand-white p-section md:p-section-md flex flex-col transition-all duration-700 ease-in-out'
    },
    toggleContainer: {
      base: 'absolute top-0 left-3/5 w-2/5 h-full overflow-hidden z-[1000] transition-all duration-700 ease-in-out',
      transform: 'transform -translate-x-[150%]'
    },
    gradient: {
      base: 'bg-brand-gradient h-full relative -left-full w-[200%] transform transition-all duration-700 ease-in-out',
      transform: 'translate-x-1/2'
    },
    leftPanel: {
      base: 'absolute w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out',
      transform: 'transform translate-x-0',
      hidden: 'transform -translate-x-[200%]'
    },
    rightPanel: {
      base: 'absolute right-0 w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out',
      transform: 'transform translate-x-[200%]',
      visible: 'transform translate-x-0'
    }
  }
}

// Helper para montar classes do botão
export function getButtonThemeClasses({
  color = 'pink',
  active = false,
  width = 'full',
  shape = 'square',
  disabled = false,
  className = '',
  customPadding = false,
  customTextColor = false,
}) {
  const t = theme.button
  const colorObj = t.colors[color] || t.colors.pink

  // Se está ativo, usa as classes active, senão usa base + hover
  const colorClasses = customTextColor ? '' : active
    ? colorObj.active
    : `${colorObj.base} ${colorObj.hover}`

  // Padding especial para círculo - usa padding igual em todos os lados (p-button-y)
  const paddingClass = customPadding ? '' :
    shape === 'circle' ? t.padding.circle : t.padding.default

  const widthClass = t.width[width] || t.width.full
  const shapeClass = t.shape[shape] || t.shape.square

  const stateClasses = disabled ? t.state.disabled : t.state.enabled

  return [
    t.base,
    paddingClass,
    colorClasses,
    widthClass,
    shapeClass,
    stateClasses,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do ArrowBack
export function getArrowBackThemeClasses({
  color = 'default',
  disabled = false,
  className = '',
  customColor = false,
}) {
  const t = theme.arrowBack
  const colorClasses = customColor ? '' : t.colors[color] || t.colors.default
  const stateClasses = disabled ? t.state.disabled : t.state.enabled

  return [
    t.base,
    colorClasses,
    stateClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getArrowBackIconClasses(params = {}) {
  const { className = '' } = params
  const t = theme.arrowBack
  return [t.icon.base, className].filter(Boolean).join(' ')
}

// Helper para montar classes do Logo
export function getLogoThemeClasses({
  colorScheme = 'pink',
  disabled = false,
  invalid = false,
  className = '',
  customColor = false,
}) {
  const t = theme.logo
  const colorClasses = customColor ? '' : t.colors[colorScheme] || t.colors.pink

  let stateClasses = ''
  if (disabled) stateClasses = t.state.disabled
  else if (invalid) stateClasses = t.state.invalid
  else stateClasses = t.state.normal

  return [
    t.base,
    colorClasses,
    stateClasses,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do Heading
export function getHeadingThemeClasses({
  level = 1,
  color = 'black',
  className = '',
  customTextColor = false,
}) {
  const t = theme.heading
  const levelClasses = t.levels[level] || t.levels[1]
  const colorClasses = customTextColor ? '' : t.colors[color] || t.colors.black

  return [
    t.base,
    levelClasses,
    colorClasses,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do Text
export function getTextThemeClasses({
  className = '',
}) {
  const t = theme.text

  return [
    t.base,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do Label
export function getLabelThemeClasses({
  variant = 'pink',
  size = 'medium',
  isEmpty = false,
  invalid = false,
  className = '',
}) {
  const t = theme.label
  const variantClasses = t.variants[variant] || t.variants.pink
  const sizeClasses = t.sizes[size] || t.sizes.medium

  let stateClasses = ''
  if (isEmpty) stateClasses = t.state.empty
  else if (invalid) stateClasses = t.state.invalid
  else stateClasses = t.state.normal

  return [
    t.base,
    variantClasses,
    sizeClasses,
    stateClasses,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do Input
export function getInputThemeClasses({
  isActive = true,
  disabled = false,
  hasErrors = false,
  withToggle = false,
  className = '',
}) {
  const t = theme.input.input

  const stateClasses = isActive
    ? t.state.active
    : t.state.inactive

  const disabledClasses = disabled
    ? t.state.disabled
    : t.state.enabled

  const errorClasses = hasErrors
    ? t.state.error
    : t.state.normal

  const toggleClasses = withToggle ? 'pr-12' : ''

  return [
    t.base,
    stateClasses,
    disabledClasses,
    errorClasses,
    toggleClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getInputLabelThemeClasses({
  hasErrors = false,
  required = false,
  className = '',
}) {
  const t = theme.input.label

  const stateClasses = hasErrors ? t.state.error : t.state.normal
  const requiredClasses = required ? t.required : ''

  return [
    t.base,
    stateClasses,
    requiredClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getInputContainerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.input.container, className].filter(Boolean).join(' ')
}

export function getInputErrorThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.input.error, className].filter(Boolean).join(' ')
}

// Helper para montar classes do Image
export function getImageThemeClasses({
  mode = 'image',
  className = '',
}) {
  const t = theme.image
  const modeClasses = t.modes[mode]?.base || t.modes.image.base

  return [
    modeClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getImageContainerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.image.container, className].filter(Boolean).join(' ')
}

export function getImagePlaceholderThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.image.placeholder, className].filter(Boolean).join(' ')
}

export function getImagePlaceholderIconThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.image.placeholderIcon, className].filter(Boolean).join(' ')
}

export function getImageDescriptionThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.image.description, className].filter(Boolean).join(' ')
}

// Helper para montar classes do CardImage
export function getCardImageThemeClasses({
  position = 'bottom-right',
  className = '',
}) {
  const t = theme.cardImage
  const positionConfig = t.positions[position] || t.positions['bottom-right']
  const baseClasses = t.image

  return [
    baseClasses,
    positionConfig.transform,
    className
  ].filter(Boolean).join(' ')
}

export function getCardImageContainerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.cardImage.container, className].filter(Boolean).join(' ')
}

export function getCardImageWrapperThemeClasses(params = {}) {
  const { position = 'bottom-right', className = '' } = params
  const t = theme.cardImage
  const positionConfig = t.positions[position] || t.positions['bottom-right']

  return [
    t.imageWrapper,
    positionConfig.padding,
    className
  ].filter(Boolean).join(' ')
}

export function getCardImageBackgroundThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.cardImage.background, className].filter(Boolean).join(' ')
}

export function getCardImagePositionThemeClasses(params = {}) {
  const { position = 'bottom-right', className = '' } = params
  const t = theme.cardImage
  const positionConfig = t.positions[position] || t.positions['bottom-right']

  return [
    t.imageContainer,
    positionConfig.transform,
    className
  ].filter(Boolean).join(' ')
}

export function getCardImageDescriptionThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.cardImage.description, className].filter(Boolean).join(' ')
}

// Helper para montar classes do Form
export function getFormThemeClasses({
  className = '',
}) {
  return [theme.form.container, className].filter(Boolean).join(' ')
}

export function getFormTitleThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.form.title, className].filter(Boolean).join(' ')
}

export function getFormSubtitleThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.form.subtitle, className].filter(Boolean).join(' ')
}

export function getFormFieldContainerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.form.fieldContainer, className].filter(Boolean).join(' ')
}

export function getFormErrorContainerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.form.errorContainer, className].filter(Boolean).join(' ')
}

export function getFormSuccessContainerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.form.successContainer, className].filter(Boolean).join(' ')
}

export function getFormFooterThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.form.footer, className].filter(Boolean).join(' ')
}

export function getFormSubmitButtonThemeClasses({
  isLoading = false,
  className = '',
}) {
  const t = theme.form
  const stateClasses = isLoading ? t.state.loading : t.state.normal

  return [stateClasses, className].filter(Boolean).join(' ')
}

// Helper para montar classes do Footer
export function getFooterThemeClasses({
  className = '',
}) {
  return [theme.footer.container, className].filter(Boolean).join(' ')
}

export function getFooterCopyrightThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.footer.copyright, className].filter(Boolean).join(' ')
}

// Helper para montar classes do Header
export function getHeaderThemeClasses({
  sticky = true,
  showShadow = true,
  className = '',
}) {
  const t = theme.header
  const stickyClasses = sticky ? t.sticky : ''
  const shadowClasses = showShadow ? t.shadow : ''

  return [
    t.container,
    stickyClasses,
    shadowClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getHeaderContentThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.header.content, className].filter(Boolean).join(' ')
}

export function getHeaderLogoSizeThemeClasses({ size = 40 }) {
  const t = theme.header.logo.sizes

  if (size === 32) return t.small
  if (size === 40) return t.medium
  if (size === 48) return t.large
  if (size === 56) return t.extraLarge

  return t.medium
}

// Helper para montar classes do NavMenu
export function getNavMenuThemeClasses({
  hasErrors = false,
  className = '',
}) {
  const t = theme.navMenu
  const errorClasses = hasErrors ? 'border-b-2 border-red-500' : ''

  return [
    t.container,
    errorClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getNavMenuItemsThemeClasses({ isMobile = false, className = '' }) {
  const t = theme.navMenu.menuItems
  const baseClasses = isMobile ? t.mobile : t.base

  return [baseClasses, className].filter(Boolean).join(' ')
}

export function getNavMenuUserActionsThemeClasses({ isMobile = false, className = '' }) {
  const t = theme.navMenu.userActions
  const baseClasses = isMobile ? t.mobile : t.base

  return [baseClasses, className].filter(Boolean).join(' ')
}

export function getNavMenuHamburgerThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.navMenu.hamburger, className].filter(Boolean).join(' ')
}

export function getNavMenuFooterThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.navMenu.footer.container, className].filter(Boolean).join(' ')
}

export function getNavMenuFooterSectionThemeClasses(params = {}) {
  const { className = '' } = params
  return [theme.navMenu.footer.section, className].filter(Boolean).join(' ')
}

export function getNavMenuFooterLinkThemeClasses({ disabled = false, className = '' }) {
  const t = theme.navMenu.footer
  const linkClasses = disabled ? t.disabledLink : t.sectionLink

  return [linkClasses, className].filter(Boolean).join(' ')
}

/**
 * Gera classes CSS específicas para itens do NavMenu
 */
export function getNavMenuItemThemeClasses({
  isActive = false,
  requiresAuth = false,
  isAuthenticated = true,
  isMobileMenuOpen = false,
  variant = 'default',
  className = ''
}) {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-title-family',
    'font-medium',
    'uppercase',
    'text-[12px]',
    'md:text-[16px]',
    'leading-none',
    'transition-all',
    'duration-200',
    'rounded-sm',
    'px-4',
    'py-2'
  ]

  const stateClasses = []

  // Estado de autenticação
  if (requiresAuth && !isAuthenticated) {
    stateClasses.push('opacity-50', 'pointer-events-none')
  }

  // Classes de cor baseadas no variant e estado ativo
  const colorConfig = theme.navMenu.colors[variant] || theme.navMenu.colors.default
  let colorClasses = []

  if (isActive) {
    colorClasses = colorConfig.active.split(' ')
  } else {
    colorClasses = [
      ...colorConfig.base.split(' '),
      ...colorConfig.hover.split(' ')
    ]
  }

  // Estado ativo com escalamento
  if (isActive) {
    stateClasses.push('scale-105')
  } else {
    stateClasses.push('hover:scale-105')
  }

  // Classes para mobile
  if (isMobileMenuOpen) {
    stateClasses.push('w-full', 'justify-center')
  }

  // Classes de variante (peso da fonte)
  const variantClasses = variant === 'destac' ? ['font-bold'] : []

  return [
    ...baseClasses,
    ...colorClasses,
    ...stateClasses,
    ...variantClasses,
    className
  ].filter(Boolean).join(' ')
}

/**
 * Gera classes CSS específicas para ações do NavMenu
 */
export function getNavMenuActionThemeClasses({
  shape = 'square',
  requiresAuth = false,
  isAuthenticated = true,
  isMobileMenuOpen = false,
  variant = 'default',
  className = ''
}) {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-title-family',
    'font-medium',
    'uppercase',
    'text-[12px]',
    'md:text-[16px]',
    'leading-none',
    'transition-all',
    'duration-200'
  ]

  const stateClasses = []

  // Estado de autenticação
  if (requiresAuth && !isAuthenticated) {
    stateClasses.push('opacity-50', 'pointer-events-none')
  }

  // Shape específico
  if (shape === 'circle') {
    stateClasses.push('rounded-full', 'p-3')
  } else {
    stateClasses.push('rounded-sm', 'px-4', 'py-2')
  }

  // Classes de cor baseadas no variant
  const colorConfig = theme.navMenu.colors[variant] || theme.navMenu.colors.default
  const colorClasses = [
    ...colorConfig.base.split(' '),
    ...colorConfig.hover.split(' ')
  ]

  stateClasses.push('hover:scale-105')

  // Classes para mobile
  if (isMobileMenuOpen) {
    stateClasses.push('w-full', 'justify-center')
  }

  // Classes de variante
  const variantClasses = variant === 'destac' ? ['font-bold'] : []

  return [
    ...baseClasses,
    ...colorClasses,
    ...stateClasses,
    ...variantClasses,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do Section
export function getSectionThemeClasses({
  backgroundColor = 'white',
  padding = 'default',
  gap = 'default',
  className = '',
}) {
  const t = theme.section
  const backgroundClasses = t.background[backgroundColor] || t.background.white
  const paddingClasses = t.padding[padding] || t.padding.default
  const gapClasses = t.gap[gap] || t.gap.default

  return [
    t.base,
    paddingClasses,
    gapClasses,
    backgroundClasses,
    className
  ].filter(Boolean).join(' ')
}

export function getSectionBackgroundThemeClasses({ backgroundColor = 'white' }) {
  const t = theme.section
  return t.background[backgroundColor] || t.background.white
}

export function getSectionPaddingThemeClasses({ padding = 'default' }) {
  const t = theme.section
  return t.padding[padding] || t.padding.default
}

export function getSectionGapThemeClasses({ gap = 'default' }) {
  const t = theme.section
  return t.gap[gap] || t.gap.default
}
