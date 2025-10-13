import { useContactsViewModel } from '@institutional/pages/Contacts/ContactsViewModel'
import { ContactIconListView } from '@institutional/components/ContactIconList/ContactIconListView'
import { CardImageView } from '@shared/components/ui/CardImage/CardImageView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import HappyCoupleDancing from '@institutional/assets/happy-couple-dancing.jpg'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'


export function ContactsView() {
  const { contactItems } = useContactsViewModel()

  return (
    <>
      <SectionView className='flex min-h-[90vh] justify-center items-center'>
        <div className='flex flex-col justify-center gap-subsection md:gap-subsection-md'>
          <HeadingView level={1} className='text-brand-pink'>
            ENTRE EM CONTATO COM A GENTE
          </HeadingView>
          <TextView className=''>
            Tem dúvidas, sugestões ou deseja conhecer mais sobre a Penélope?
            Nossa equipe está sempre pronta para ouvir você, oferecer
            orientações e ajudar em cada etapa do seu sonho.
          </TextView>

          <ContactIconListView
            contacts={contactItems}
            layout="horizontal"
            iconSize="large"
            className="gap-card md:gap-card-md"
          />
        </div>
        <CardImageView src={HappyCoupleDancing} description='Imagem gerada por IA' />
      </SectionView>
    </>
  )
}
