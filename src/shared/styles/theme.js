export const theme = {
  button: {
    base: [
      'inline-flex items-center justify-center gap-button md:gap-button-md',
      'font-title font-bold',
      'text-base md:text-xl',
      'leading-none',
      'uppercase',
      'transition-all duration-200',
      'hover:scale-105'
    ].join(' '),
    padding: {
      default: 'p-button md:p-button-md',
      circle: 'p-button-y md:p-button-y-md',
    },
    colors: {
      pink: {
        base: 'bg-distac-primary text-default-light',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      },
      brown: {
        base: 'bg-distac-secondary text-default-light',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      },
      'soft-brown': {
        base: 'bg-distac-secondary-light text-default-light',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      },
      white: {
        base: 'bg-default-light-muted text-default-dark',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      },
      gray: {
        base: 'bg-default-dark-muted text-default-light',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      },
      'border-white': {
        base: 'border-2 border-default-light bg-transparent text-default-light',
        active: 'border-2 border-default-light bg-default-light text-distac-primary',
        hover: 'hover:border-2 hover:border-default-light hover:bg-default-light hover:text-distac-primary',
      },
      transparent: {
        base: 'bg-transparent text-default-light',
        active: 'text-default-light',
        hover: 'hover:text-default-light',
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
  backbutton: {
    base: [
      'font-semibold',
      'cursor-pointer',
      'transition-all duration-300',
      'hover:scale-105',
      'focus:outline-none'
    ].join(' '),
    icon: {
      base: 'inline',
    }
  },
  heading: {
    base: [
      'w-fit',
      'font-title text-default-dark',
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
  },
  text: {
    base: [
      'text-xs md:text-base',
      'leading-none',
      'font-default',
      'text-default-dark',
    ].join(' '),
  },
  label: {
    base: [
      'text-[12px] md:text-[14px] text-center',
      'px-2 py-1 md:px-3 md:py-2',
      'inline-block rounded-sm font-medium',
      'transition-all duration-200',
    ].join(' '),
    variants: {
      pink: 'bg-distac-primary text-default-light',
      softPink: 'bg-distac-primary-light text-default-light',
      brown: 'bg-distac-secondary text-default-light',
      softBrown: 'bg-distac-secondary-light text-default-light',
      gray: 'bg-default-dark-light text-default-light',
    },
  },
  input: {
    container: 'w-full flex flex-col gap-2',
    input: {
      base: [
        'w-full px-4 py-2 rounded-sm',
        'transition-colors duration-200',
        'placeholder:text-default-dark-muted',
        'placeholder:text-[12px] md:placeholder:text-[16px]',
        'placeholder:uppercase placeholder:font-default'
      ].join(' '),
      state: {
        active: 'bg-distac-primary-light focus:bg-default-light focus:ring-2 focus:ring-distac-primary focus:outline-none',
        inactive: 'bg-default-light-terciary',
        disabled: 'bg-default-light-tertiary text-gray-500 cursor-not-allowed opacity-75',
        enabled: 'hover:bg-opacity-80',
        error: 'border-2 border-distac-primary focus:ring-distac-primary',
        normal: '',
        readOnly: 'bg-default-light-tertiary text-gray-600 cursor-text select-text',
      }
    },
    label: {
      base: [
        'uppercase font-semibold font-default',
        'text-[12px] leading-none md:text-[16px]'
      ].join(' '),
      state: {
        error: 'text-distac-primary',
        normal: 'text-default-dark-muted',
      },
      required: 'after:content-["*"] after:text-distac-primary after:ml-1'
    },
    error: 'text-distac-primary text-sm mt-1'
  },
  image: {
    modes: {
      image: {
        base: 'max-h-72 min-w-lg rounded-sm border-transparent bg-gradient-to-t from-distac-secondary to-distac-primary p-0.5 w-fit',
      },
      background: {
        base: 'bg-cover bg-center bg-no-repeat',
      }
    },
    container: 'flex flex-col gap-card md:gap-card-md',
    placeholder: 'flex-1 flex items-center justify-center bg-default-light-secondary',
    placeholderIcon: 'w-[100px] h-[100px] text-default-light-tertiary',
    description: 'text-default-dark-muted'
  },
  cardImage: {
    container: 'flex flex-col items-start gap-1.5',
    imageWrapper: 'relative w-fit',
    background: 'relative z-0 w-fit rounded-sm bg-distac-gradient',
    imageContainer: 'relative z-10',
    image: 'block rounded-sm shadow-sm object-cover',
    description: 'text-default-dark-muted mt-2 text-sm',
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
    title: 'text-center text-distac-primary',
    subtitle: 'text-center text-default-dark-muted',
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
      'border-t-2 border-default-light-muted',
      'pt-section-y'
    ].join(' '),
  },
  header: {
    container: [
      'w-full',
      'bg-default-light',
      'transition-all duration-300',
      'p-header md:p-header-md',
      'flex items-center justify-center',
    ].join(' '),
    sticky: 'sticky top-0 z-50',
    shadow: 'shadow-lg',
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
        base: 'bg-default-light-terciary text-default-dark',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      },
      destac: {
        base: 'bg-distac-secondary text-default-light',
        active: 'bg-distac-primary text-default-light',
        hover: 'hover:bg-distac-primary hover:text-default-light',
      }
    },
    footer: {
      container: [
        'flex flex-col md:flex-row items-center md:items-start',
        'justify-between w-full h-fit gap-subsection md:gap-0'
      ].join(' '),
      logoSection: 'flex flex-col items-center md:items-start justify-between h-24',
      section: 'flex flex-col items-center md:items-start gap-2',
      sectionTitle: 'text-distac-primary font-extrabold',
      sectionLink: [
        'text-default-dark',
        'hover:text-distac-primary hover:underline',
        'transition-colors duration-200',
        'uppercase cursor-pointer'
      ].join(' '),
      disabledLink: 'cursor-not-allowed opacity-50 text-gray-500'
    }
  },
  section: {
    base: 'section flex w-full h-fit bg-default-light',
    padding: {
      default: 'p-section md:p-section-md',
    },
    gap: {
      default: 'gap-section md:gap-section-md',
    }
  },
  auth: {
    container: {
      base: 'relative w-full h-full bg-default-light overflow-hidden transition-all duration-700 ease-in-out',
      active: 'active'
    },
    signInPanel: {
      base: 'absolute top-0 left-0 w-3/5 h-full bg-default-light z-20 p-section md:p-section-md flex flex-col items-center justify-center transition-all duration-700 ease-in-out',
      states: {
        active: 'translate-x-[166.67%] opacity-0 invisible pointer-events-none',
        inactive: 'translate-x-0 opacity-100 visible pointer-events-auto'
      }
    },
    signUpPanel: {
      base: 'absolute top-0 right-0 w-3/5 h-full bg-default-light p-section md:p-section-md flex flex-col transition-all duration-700 ease-in-out',
      states: {
        active: 'translate-x-0 opacity-100 visible z-50',
        inactive: 'translate-x-[-166.67%] opacity-0 invisible z-10'
      }
    },
    toggleContainer: {
      base: 'absolute top-0 left-3/5 w-2/5 h-full overflow-hidden z-[1000] transition-all duration-700 ease-in-out',
      states: {
        active: 'transform -translate-x-[150%]',
        inactive: 'transform translate-x-0'
      }
    },
    gradient: {
      base: 'bg-distac-gradient h-full relative -left-full w-[200%] transform transition-all duration-700 ease-in-out',
      states: {
        active: 'translate-x-1/2',
        inactive: 'translate-x-0'
      }
    },
    leftPanel: {
      base: 'absolute w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out',
      states: {
        active: 'transform translate-x-0',
        inactive: 'transform -translate-x-[200%]'
      }
    },
    rightPanel: {
      base: 'absolute right-0 w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out',
      states: {
        active: 'transform translate-x-[200%]',
        inactive: 'transform translate-x-0'
      }
    },
    backButton: {
      signIn: 'flex justify-start w-full',
      leftPanel: 'flex justify-start w-full',
      rightPanel: 'flex justify-end w-full'
    },
    formContainer: {
      base: 'flex-1 flex flex-col w-full items-center justify-center gap-subsection md:gap-subsection-md'
    },
    linkButton: {
      base: 'font-semibold text-distac-primary hover:underline bg-transparent border-none cursor-pointer p-0 min-h-0 h-auto inline-block',
      container: 'text-default-dark-muted flex gap-1 items-center justify-center'
    },
    toggleButton: {
      base: '' // Removido as classes customizadas
    },
    panelContent: {
      base: 'w-full text-center flex-1 flex flex-col items-center justify-center gap-subsection md:gap-subsection-md'
    }
  }
}

// Helper simplificado para montar classes do botão
export function getButtonThemeClasses({
  color = 'pink',
  active = false,
  width = 'full',
  shape = 'square',
  disabled = false,
  className = '',
}) {
  const t = theme.button
  const colorObj = t.colors[color] || t.colors.pink

  // Classes de cor baseadas no estado
  const colorClasses = active
    ? colorObj.active
    : `${colorObj.base} ${colorObj.hover}`

  // Padding baseado na forma
  const paddingClass = shape === 'circle' ? t.padding.circle : t.padding.default
  const widthClass = t.width[width] || t.width.full
  const shapeClass = t.shape[shape] || t.shape.square
  const stateClasses = disabled ? t.state.disabled : t.state.enabled

  // CSS natural: últimas classes sobrescrevem as anteriores
  return [
    t.base,
    paddingClass,
    colorClasses,
    widthClass,
    shapeClass,
    stateClasses,
    className // className por último para permitir sobrescrita
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do ArrowBack
export function getBackButtonThemeClasses({
  className = '',
}) {
  const t = theme.backbutton

  return [
    t.base,
    className
  ].filter(Boolean).join(' ')
}

export function getBackButtonIconClasses(params = {}) {
  const { className = '' } = params
  const t = theme.backbutton
  return [t.icon.base, className].filter(Boolean).join(' ')
}

// Helper para montar classes do Heading
export function getHeadingThemeClasses({
  level = 1,
  className = '',
}) {
  const t = theme.heading
  const levelClasses = t.levels[level] || t.levels[1]

  return [
    t.base,
    levelClasses,
    className
  ].filter(Boolean).join(' ')
}

/**
 * Generates the final CSS class string for text elements by combining
 * the base theme styles with any additional custom classes provided.
 *
 * @param {Object} options - Configuration options.
 * @param {string} [options.className=''] - Additional CSS class names to append to the base text style.
 *
 * @returns {string} - The computed CSS class string for the text element.
 *
 * @example
 * const className = getTextThemeClasses({ className: 'text-lg font-semibold' });
 * // Returns something like: "'text-xs md:text-base leading-none'"
 */
export function getTextThemeClasses({
  className = '',
}) {
  const text = theme.text

  return [
    text.base,
    className
  ].filter(Boolean).join(' ')
}

/**
 * Generates the final CSS class string for label elements by combining
 * base styles, variant, size, and state-specific theme classes with optional custom classes.
 *
 * @param {Object} options - Configuration options.
 * @param {string} [options.variant='pink'] - The color variant of the label (must match a theme variant).
 * @param {string} [options.size='medium'] - The size variant of the label (must match a theme size).
 * @param {boolean} [options.isEmpty=false] - If true, applies the "empty" state styling.
 * @param {boolean} [options.invalid=false] - If true, applies the "invalid" state styling.
 * @param {string} [options.className=''] - Additional CSS class names to append to the label.
 *
 * @returns {string} - The computed CSS class string for the label element.
 *
 * @example
 * const classes = getLabelThemeClasses({ variant: 'purple', size: 'small', invalid: true });
 * // Returns something like: "label-base label-purple label-small label-invalid"
 */
export function getLabelThemeClasses({
  variant = 'pink',
  className = '',
}) {
  const t = theme.label
  const variantClasses = t.variants[variant] || t.variants.pink

  return [
    t.base,
    variantClasses,
    className
  ].filter(Boolean).join(' ')
}

// Helper para montar classes do Input
export function getInputThemeClasses({
  isActive = true,
  disabled = false,
  readOnly = false,
  hasErrors = false,
  withToggle = false,
  className = '',
}) {
  const t = theme.input.input

  let stateClasses = ''

  if (disabled) {
    stateClasses = t.state.disabled
  } else if (readOnly) {
    stateClasses = t.state.readOnly
  } else if (isActive) {
    stateClasses = t.state.active
  } else {
    stateClasses = t.state.inactive
  }

  const errorClasses = hasErrors ? t.state.error : t.state.normal
  const toggleClasses = withToggle ? 'pr-12' : ''

  return [
    t.base,
    stateClasses,
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
export function getFormThemeClasses() {
  return [theme.form.container].filter(Boolean).join(' ')
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
    'font-title',
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
    'font-title',
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
export function getSectionThemeClasses() {
  const t = theme.section
  return [t.base
    , t.padding.default
    , t.gap.default
  ].filter(Boolean).join(' ')
}

// Helper functions for Auth component
export function getAuthContainerThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.container
  const activeClass = isActive ? t.active : ''

  return [t.base, activeClass, className].filter(Boolean).join(' ')
}

export function getAuthSignInPanelThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.signInPanel
  const stateClass = isActive ? t.states.active : t.states.inactive

  return [t.base, stateClass, className].filter(Boolean).join(' ')
}

export function getAuthSignUpPanelThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.signUpPanel
  const stateClass = isActive ? t.states.active : t.states.inactive

  return [t.base, stateClass, className].filter(Boolean).join(' ')
}

export function getAuthToggleContainerThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.toggleContainer
  const stateClass = isActive ? t.states.active : t.states.inactive

  return [t.base, stateClass, className].filter(Boolean).join(' ')
}

export function getAuthGradientThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.gradient
  const stateClass = isActive ? t.states.active : t.states.inactive

  return [t.base, stateClass, className].filter(Boolean).join(' ')
}

export function getAuthLeftPanelThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.leftPanel
  const stateClass = isActive ? t.states.active : t.states.inactive

  return [t.base, stateClass, className].filter(Boolean).join(' ')
}

export function getAuthRightPanelThemeClasses({ isActive = false, className = '' } = {}) {
  const t = theme.auth.rightPanel
  const stateClass = isActive ? t.states.active : t.states.inactive

  return [t.base, stateClass, className].filter(Boolean).join(' ')
}

export function getAuthBackButtonThemeClasses({ variant = 'signIn', className = '' } = {}) {
  const t = theme.auth.backButton
  const variantClass = t[variant] || t.signIn

  return [variantClass, className].filter(Boolean).join(' ')
}

export function getAuthFormContainerThemeClasses({ className = '' } = {}) {
  return [theme.auth.formContainer.base, className].filter(Boolean).join(' ')
}

export function getAuthLinkButtonThemeClasses({ className = '' } = {}) {
  return [theme.auth.linkButton.base, className].filter(Boolean).join(' ')
}

export function getAuthLinkContainerThemeClasses({ className = '' } = {}) {
  return [theme.auth.linkButton.container, className].filter(Boolean).join(' ')
}

export function getAuthToggleButtonThemeClasses({ className = '' } = {}) {
  return [theme.auth.toggleButton.base, className].filter(Boolean).join(' ')
}

export function getAuthPanelContentThemeClasses({ className = '' } = {}) {
  return [theme.auth.panelContent.base, className].filter(Boolean).join(' ')
}
