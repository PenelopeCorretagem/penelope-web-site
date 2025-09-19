import { useState, useCallback, useMemo } from 'react'
import { MenuModel } from '../../model/components/MenuModel'

export function useMenuViewModel() {
  const [model] = useState(() => new MenuModel())

  // React state
  const [activeItem, setActiveItem] = useState('home')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Business Logic Functions
  const navigateToItem = useCallback((itemId, route) => {
    return {
      shouldSetLoading: true,
      newActiveItem: itemId,
      navigationRoute: route,
      delay: 100,
    }
  }, [])

  const isItemActive = useCallback(
    itemId => {
      return activeItem === itemId
    },
    [activeItem]
  )

  const validateNavigation = useCallback(
    (itemId, route) => {
      if (!itemId || !route) {
        throw new Error('ItemId and route are required')
      }

      const item = model.getItemById(itemId)
      if (!item) {
        throw new Error(`Item with id ${itemId} not found`)
      }

      return true
    },
    [model]
  )

  const menuItems = useMemo(() => model.getMenuItems(), [model])
  const userActions = useMemo(() => model.getUserActions(), [model])
  const allItems = useMemo(
    () => [...menuItems, ...userActions],
    [menuItems, userActions]
  )

  const handleItemClick = useCallback(
    (itemId, route) => {
      try {
        setError(null)

        validateNavigation(itemId, route)

        const navigationInfo = navigateToItem(itemId, route)

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
    [validateNavigation, navigateToItem]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const hasActiveItem = useMemo(() => activeItem !== null, [activeItem])
  const hasError = useMemo(() => error !== null, [error])

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
    hasError,
  }
}

// Hook auxiliar para casos onde só precisamos das funções de validação
export const useMenuValidation = () => {
  const [model] = useState(() => new MenuModel())

  const validateNavigation = useCallback(
    (itemId, route) => {
      if (!itemId || !route) {
        throw new Error('ItemId and route are required')
      }

      const item = model.getItemById(itemId)
      if (!item) {
        throw new Error(`Item with id ${itemId} not found`)
      }

      return true
    },
    [model]
  )

  return { validateNavigation }
}
