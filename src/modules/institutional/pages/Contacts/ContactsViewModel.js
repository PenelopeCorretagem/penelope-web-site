import { useMemo } from 'react'
import { ContactIconListModel } from '@institutional/components/ContactIconList/ContactIconListModel'

// ViewModel
export function useContactsViewModel() {
  const contactItems = useMemo(() => {
    return ContactIconListModel.getDefaultContacts()
  }, [])

  return {
    contactItems
  }
}
