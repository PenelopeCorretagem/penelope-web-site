import { ContactIconView } from '@institutional/components/ContactIcon/ContactIconView'
import { useContactIconListViewModel } from '@institutional/components/ContactIconList/useContactIconListViewModel'
import {
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa'

const iconMap = {
  email: FaEnvelope,
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  twitter: FaTwitter
}

export function ContactIconListView({ contacts, layout, iconSize, className }) {
  const {
    validation,
    finalClassName,
    validContacts,
    iconSize: viewModelIconSize
  } = useContactIconListViewModel({ contacts, layout, iconSize, className })

  if (!validation.isValid) {
    return (
      <div className="text-red-500 text-sm">
        {validation.errors.join(', ')}
      </div>
    )
  }

  return (
    <div
      className={finalClassName}
      title={!validation.isValid ? validation.errors.join(', ') : undefined}
    >
      {validContacts.map((contact) => {
        const IconComponent = iconMap[contact.type || contact.id]

        return (
          <ContactIconView
            key={contact.id}
            href={contact.href}
            size={viewModelIconSize}
          >
            {IconComponent && <IconComponent />}
          </ContactIconView>
        )
      })}
    </div>
  )
}
