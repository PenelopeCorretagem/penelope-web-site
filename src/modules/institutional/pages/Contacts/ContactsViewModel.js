import { useMemo } from 'react'
import { ContactIconListModel } from './components/layout/ContactIconList/ContactIconListModel'

// ViewModel
export function useContactsViewModel() {
  const contactItems = useMemo(() => {
    return ContactIconListModel.getDefaultContacts()
  }, [])

  return {
    contactItems
  }
}
