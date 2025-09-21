import { useState } from 'react'
import { ContactModel } from '../../model/components/ContactModel'

// ViewModel
export function useContactViewModel() {
  const [contactModel] = useState(new ContactModel())

  // Função para abrir link do menu
  const openLink = id => {
    const item = contactModel.contactItems.find(i => i.id === id.trim())
    if (!item) return

    // Aqui você pode decidir como abrir o link, ex: nova aba
    window.open(item.route, '_blank')
  }

  return {
    contactItems: contactModel.contactItems,
    openLink,
  }
}
