import { useState, useEffect, useCallback, useRef } from 'react'
import { PropertyTabsModel } from './PropertyTabsModel'

export function usePropertyTabsViewModel(anchors, tabs) {
  const [model] = useState(() => new PropertyTabsModel({ tabs, anchors }))
  const [activeTab, setActiveTab] = useState(model.activeTab)
  const isManualClick = useRef(false)
  const manualClickTimer = useRef(null)

  const getDOMElements = useCallback(() => {
    const header = document.querySelector('header[role="banner"]')
    const tabsElement =
      document.querySelector('nav[data-tabs-component], [data-tabs-component][role="tablist"]') ||
      document.querySelector('[data-tabs-component]')

    const headerHeight = header?.offsetHeight || 0
    const tabsHeight = tabsElement?.offsetHeight || 0

    return {
      header,
      tabsElement,
      headerHeight,
      tabsHeight,
      totalOffset: headerHeight + tabsHeight,
    }
  }, [])

  // Helper: find nearest scrollable parent of an element (fallback to document.scrollingElement)
  const getScrollableParent = useCallback((node) => {
    if (!node) return document.scrollingElement || document.documentElement
    let parent = node.parentElement
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent)
      const overflowY = style.overflowY || ''
      const canScroll = overflowY === 'auto' || overflowY === 'scroll'
      if (canScroll && parent.scrollHeight > parent.clientHeight) {
        return parent
      }
      parent = parent.parentElement
    }
    return document.scrollingElement || document.documentElement
  }, [])

  const checkActiveSection = useCallback(() => {
    const { totalOffset } = getDOMElements()
    const offset = totalOffset + model.scrollConfig.offset

    let activeSection = model.anchors[0]

    for (let i = 0; i < model.anchors.length; i++) {
      const element = document.getElementById(model.anchors[i])
      if (element) {
        const rect = element.getBoundingClientRect()

        if (rect.top <= offset && rect.bottom > offset) {
          activeSection = model.anchors[i]
          break
        }
        if (rect.top <= offset) {
          activeSection = model.anchors[i]
        }
      }
    }

    return activeSection
  }, [model.anchors, model.scrollConfig.offset, getDOMElements])

  const scrollToElement = useCallback(
    (anchor) => {
      const element = document.getElementById(anchor)
      if (!element) return false

      // detect the container that should be scrolled
      const scrollParent = getScrollableParent(element)
      const elementRect = element.getBoundingClientRect()

      // compute the scrollTop target relative to the detected scroll parent
      const parentIsWindow = scrollParent === document.scrollingElement || scrollParent === document.documentElement
      const parentScrollTop = parentIsWindow ? window.pageYOffset : scrollParent.scrollTop
      const parentRectTop = parentIsWindow ? 0 : scrollParent.getBoundingClientRect().top
      const elementTopRelativeToParent = elementRect.top - parentRectTop + parentScrollTop

      // Stop at the very top of the viewport/container (no offsets/subtractions)
      const targetScrollTop = Math.max(0, elementTopRelativeToParent)

      if (parentIsWindow) {
        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        })
      } else {
        scrollParent.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        })
      }

      // Accessibility: focus the target element without re-scrolling
      try {
        element.setAttribute('tabindex', '-1')
        element.focus({ preventScroll: true })
      } catch (err) {
        // ignore focus errors
      }

      return true
    },
    [getScrollableParent]
  )

  useEffect(() => {
    if (!model.hasValidData()) {
      console.warn('PropertyTabsViewModel: Invalid data provided')
      return
    }

    const handleScroll = () => {
      if (isManualClick.current) return

      const newActiveTab = checkActiveSection()
      setActiveTab((prev) => {
        if (prev !== newActiveTab) {
          model.setActiveTab(newActiveTab)
          return newActiveTab
        }
        return prev
      })
    }

    const initialActive = checkActiveSection()
    setActiveTab(initialActive)
    model.setActiveTab(initialActive)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      // Cleanup any pending timers used for manual click debounce
      if (manualClickTimer.current) {
        clearTimeout(manualClickTimer.current)
        manualClickTimer.current = null
      }
    }
  }, [checkActiveSection, model])

  const isTabActive = useCallback(
    (anchor) => {
      return model.isTabActive(anchor)
    },
    [activeTab, model]
  )

  const handleTabClick = useCallback(
    (anchor) => {
      if (!model.anchors.includes(anchor)) {
        console.warn(`PropertyTabsViewModel: Invalid anchor "${anchor}"`)
        return
      }

      setActiveTab(anchor)
      model.setActiveTab(anchor)

      // mark as manual click both in ref and in model for debugging/consistency
      isManualClick.current = true
      model.setManualClick(true)

      const scrollSuccess = scrollToElement(anchor)

      if (scrollSuccess) {
        if (manualClickTimer.current) {
          clearTimeout(manualClickTimer.current)
        }
        manualClickTimer.current = setTimeout(() => {
          isManualClick.current = false
          model.setManualClick(false)
          manualClickTimer.current = null
        }, model.scrollConfig.clickTimeout)
      } else {
        isManualClick.current = false
        model.setManualClick(false)
      }
    },
    [model, scrollToElement]
  )

  const getTabsData = useCallback(() => {
    return model.getTabData()
  }, [model, activeTab])

  return {
    activeTab,
    isTabActive,
    handleTabClick,
    getTabsData,
    hasValidData: model.hasValidData(),
    model,
  }
}
