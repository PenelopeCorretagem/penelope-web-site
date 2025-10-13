export class ContactIconListModel {
  static CONTACT_TYPES = {
    EMAIL: 'email',
    WHATSAPP: 'whatsapp',
    INSTAGRAM: 'instagram',
    FACEBOOK: 'facebook',
    LINKEDIN: 'linkedin',
    TWITTER: 'twitter'
  }

  static getDefaultContacts() {
    return [
      {
        id: 'email',
        type: ContactIconListModel.CONTACT_TYPES.EMAIL,
        href: 'mailto:contato@penelope.com.br',
        label: 'Email'
      },
      {
        id: 'whatsapp',
        type: ContactIconListModel.CONTACT_TYPES.WHATSAPP,
        href: 'https://wa.me/5511999999999',
        label: 'WhatsApp'
      },
      {
        id: 'instagram',
        type: ContactIconListModel.CONTACT_TYPES.INSTAGRAM,
        href: 'https://instagram.com/penelope',
        label: 'Instagram'
      },
      {
        id: 'facebook',
        type: ContactIconListModel.CONTACT_TYPES.FACEBOOK,
        href: 'https://facebook.com/penelope',
        label: 'Facebook'
      },
    ]
  }

  static validateContactListProps(contacts) {
    const errors = []

    if (!contacts || !Array.isArray(contacts)) {
      errors.push('Lista de contatos deve ser um array')
    }

    if (contacts && contacts.length === 0) {
      errors.push('Lista de contatos não pode estar vazia')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static getLayoutClasses(layout) {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row items-center gap-4'
      case 'vertical':
        return 'flex flex-col items-center gap-4'
      case 'grid':
        return 'grid grid-cols-2 gap-4'
      default:
        return 'flex flex-row items-center gap-4'
    }
  }
}
