import { useContactViewModel } from '../../viewmodel/components/ContactViewModel'
import { MenuView } from '../../../shared/view/components/MenuView'
import { ContactIconView } from '../components/ContactIconView'
import { FaEnvelope, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import ContactImage from '../../assets/ContactImage.svg'

export function ContactView() {
  const { contactItems, openLink } = useContactViewModel()

  const overlayOffsetX = 34
  const overlayOffsetY = -32

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
        <section className='flex flex-col gap-6'>
          <h1 className='font-title-family-family text-brand-primary text-[56px]'>
            ENTRE EM CONTATO COM A GENTE
          </h1>
          <p className='font-default-family text-text-primary text-base'>
            Tem dúvidas, sugestões ou deseja conhecer mais sobre a Penélope?
            Nossa equipe está sempre pronta para ouvir você, oferecer
            orientações e ajudar em cada etapa do seu sonho.
          </p>

          <div className='flex flex-wrap gap-4'>
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
        <section className='flex items-center justify-center'>
          <div className='relative inline-block overflow-visible'>
            <div
              className='absolute inset-0 left-0 z-0 rounded-md bg-gradient-to-b from-[#B33C8E] to-[#36221D] shadow-lg'
              style={{
                transform: `translate(${overlayOffsetX}px, ${overlayOffsetY}px)`,
              }}
            />

            <img
              src={ContactImage}
              alt='Casal feliz'
              className='border-brand-primary relative z-10 block rounded-sm border-4 shadow-lg'
            />
          </div>
        </section>
      </main>
    </>
  )
}
