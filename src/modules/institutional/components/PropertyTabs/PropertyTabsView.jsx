import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { usePropertyTabsViewModel } from './usePropertyTabsViewModel'

export function PropertyTabsView({ tabs, anchors }) {
  const {
    handleTabClick,
    getTabsData,
    hasValidData
  } = usePropertyTabsViewModel(anchors, tabs)

  if (!hasValidData) {
    console.warn('PropertyTabsView: Invalid props provided')
    return null
  }

  const tabsData = getTabsData()

  return (
    <nav
      className="bg-default-light-alt px-section-x md:px-section-x-md py-4 md:py-6"
      data-tabs-component
      role="tablist"
      aria-label="Property sections navigation"
    >
      <ul className="flex items-center justify-start gap-subsection md:gap-subsection-md">
        {tabsData.map(({ tab, anchor, isActive }) => (
          <li key={anchor} role="none">
            <button
              className={`uppercase font-medium transition-colors duration-200 focus:outline-none cursor-pointer ${
                isActive
                  ? 'text-distac-primary'
                  : 'text-default-dark hover:text-distac-primary'
              }`}
              onClick={() => handleTabClick(anchor)}
              role="tab"
              aria-selected={isActive}
              aria-controls={anchor}
              id={`tab-${anchor}`}
            >
              <HeadingView
                level={5}
                className="transition-colors duration-200 !text-current"
              >
                {tab}
              </HeadingView>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
