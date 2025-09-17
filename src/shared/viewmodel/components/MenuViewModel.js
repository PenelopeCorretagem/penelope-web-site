import { useState, useCallback, useMemo } from 'react'
import { MenuModel } from '../../model/components/MenuModel'

// Classe para lógica de negócio pura (sem hooks)
class MenuBusinessLogic {
  constructor() {
    this.model = new MenuModel()
  }

  // Business Logic Methods (Pure functions)
  navigateToItem(itemId, route) {
    return {
      shouldSetLoading: true,
      newActiveItem: itemId,
      navigationRoute: route,
      delay: 100,
    }
  }

  isItemActive(itemId, activeItem) {
    return activeItem === itemId
  }

  validateNavigation(itemId, route) {
    if (!itemId || !route) {
      throw new Error('ItemId and route are required')
    }

    const item = this.model.getItemById(itemId)
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`)
    }

    return true
  }

  // Data getters
  getMenuItems() {
    return this.model.getMenuItems()
  }

  getUserActions() {
    return this.model.getUserActions()
  }

  getAllItems() {
    return [...this.getMenuItems(), ...this.getUserActions()]
  }
}

// Hook customizado que usa a lógica de negócio
export const useMenuViewModel = () => {
  // Instância da lógica de negócio (singleton para este hook)
  const [businessLogic] = useState(() => new MenuBusinessLogic())

  // React state
  const [activeItem, setActiveItem] = useState('home')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Actions
  const handleItemClick = useCallback(
    (itemId, route) => {
      try {
        setError(null)

        // Validação usando lógica de negócio
        businessLogic.validateNavigation(itemId, route)

        // Obter instruções de navegação
        const navigationInfo = businessLogic.navigateToItem(itemId, route)

        if (navigationInfo.shouldSetLoading) {
          setIsLoading(true)
        }

        // Simula navegação async
        setTimeout(() => {
          setActiveItem(navigationInfo.newActiveItem)
          setIsLoading(false)

          console.log(`Navigating to: ${navigationInfo.navigationRoute}`)
        }, navigationInfo.delay)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    },
    [businessLogic],
  )

  const isItemActive = useCallback(
    itemId => {
      return businessLogic.isItemActive(itemId, activeItem)
    },
    [businessLogic, activeItem],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Computed properties usando lógica de negócio
  const menuItems = useMemo(() => businessLogic.getMenuItems(), [businessLogic])
  const userActions = useMemo(
    () => businessLogic.getUserActions(),
    [businessLogic],
  )
  const hasActiveItem = useMemo(() => activeItem !== null, [activeItem])
  const allItems = useMemo(() => businessLogic.getAllItems(), [businessLogic])

  return {
    // Data
    menuItems,
    userActions,
    allItems,
    activeItem,
    isLoading,
    error,

    // Actions
    handleItemClick,
    isItemActive,
    clearError,

    // Computed
    hasActiveItem,
    hasError: error !== null,
  }
}

// Export da classe de lógica de negócio para casos onde não precisamos dos hooks
export { MenuBusinessLogic }
