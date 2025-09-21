import { useContactViewModel } from '../../viewmodel/components/ContactViewModel'
import { MenuView } from '../../../shared/view/components/MenuView'
import { ContactIconView } from '../components/ContactIconView'
import { FaEnvelope, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import ContactImage from '../../assets/ContactImage.svg'
import { useState, useRef, useEffect } from 'react'

export function ContactView() {
  const imgRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (imgRef.current) {
      setSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      })
    }
  }, [])

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
          <div>
            <img
              ref={imgRef}
              src={ContactImage}
              alt='Imagem de um casal feliz após se mudar'
              className='border-brand-primary rounded-sm border-4'
            />
            <div style={{ width: size.width, height: size.height }} className='bg-brand-primary border-brand-primary border-4 rounded-sm'></div>
          </div>
        </section>
      </main>
    </>
  )
}
