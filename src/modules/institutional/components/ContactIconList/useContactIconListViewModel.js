import { useMemo } from 'react'
import { ContactIconListModel } from '@institutional/components/ContactIconList/ContactIconListModel'

export function useContactIconListViewModel({
  contacts = ContactIconListModel.getDefaultContacts(),
  layout = 'horizontal',
  iconSize = 'medium',
  className = ''
}) {
  const validation = useMemo(() => {
    return ContactIconListModel.validateContactListProps(contacts)
  }, [contacts])

  const layoutClasses = useMemo(() => {
    return ContactIconListModel.getLayoutClasses(layout)
  }, [layout])

  const finalClassName = useMemo(() => {
    return `${layoutClasses} ${className}`.trim()
  }, [layoutClasses, className])

  const validContacts = useMemo(() => {
    return contacts.filter(contact => contact.id && contact.href)
  }, [contacts])

  return {
    validation,
    finalClassName,
    validContacts,
    iconSize
  }
}
