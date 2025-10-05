import { useContactViewModel } from '../../viewmodel/components/ContactViewModel'
import { MenuView } from '../../../shared/view/components/MenuView'
import { ContactIconView } from '../components/ContactIconView'
import { FaEnvelope, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import { CardImageView } from '../components/CardImageView'

export function ContactView() {
  const { contactItems, openLink } = useContactViewModel()

  // Mapa de ícones (componentes, não instâncias)
  const iconMap = {
    mail: FaEnvelope,
    whatsapp: FaWhatsapp,
    instagram: FaInstagram,
    facebook: FaFacebook,
  }

  return (
    <>
      <MenuView />

      <main className='grid grid-cols-1 gap-[80px] md:grid-cols-2'>
        <section className='flex flex-col gap-6 p-22'>
          <h1 className='font-title-family-family text-brand-primary text-[56px] font-semibold'>
            ENTRE EM CONTATO COM A GENTE
          </h1>
          <p className='font-default-family text-text-primary text-base'>
            Tem dúvidas, sugestões ou deseja conhecer mais sobre a Penélope?
            Nossa equipe está sempre pronta para ouvir você, oferecer
            orientações e ajudar em cada etapa do seu sonho.
          </p>

          <div className='flex flex-wrap gap-10'>
            {contactItems.map(item => {
              const Icon = iconMap[item.id.trim().toLowerCase()]
              return (
                <ContactIconView
                  key={item.id}
                  onClick={() => openLink(item.id)}
                >
                  {Icon && <Icon className='text-surface-primary h-12 w-12' />}
                </ContactIconView>
              )
            })}
          </div>
        </section>
        <section className='flex items-center justify-center p-22'>
          <CardImageView descriptionImage='Imagem gerada por IA' />
        </section>
      </main>
    </>
  )
}
