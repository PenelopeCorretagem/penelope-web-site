// modules/institutional/pages/Contacts/ContactsView.jsx
import { useContactsViewModel } from '@institutional/pages/Contacts/ContactsViewModel'
import { ContactIconListView } from '@institutional/components/ContactIconList/ContactIconListView'
import { CardImageView } from '@shared/components/ui/CardImage/CardImageView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ContactFormView } from '@institutional/components/ContactForm/ContactFormView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import HappyCoupleDancing from '@institutional/assets/happy-couple-dancing.jpg'

/**
 * ContactsView - Página institucional de contato.
 *
 * Exibe informações de contato da empresa, formulário de envio de mensagens,
 * ícones de redes sociais e canais diretos (WhatsApp, E-mail etc).
 *
 * Estrutura:
 * 1. Cabeçalho e imagem ilustrativa
 * 2. Textos institucionais
 * 3. Formulário de contato
 * 4. Lista de ícones de contato
 */
export function ContactsView() {
  const { contactItems } = useContactsViewModel()

  return (
    <SectionView className="flex-col items-center !gap-[var(--padding-section-y)] md:!gap-[var(--padding-section-y-md)]">
      <HeadingView className="text-center text-distac-primary">ENTRE EM CONTATO COM A GENTE</HeadingView>
      <div className="flex flex-col md:flex-row gap-card md:gap-section-md w-full">
        <div className="flex flex-col gap-subsection md:gap-subsection-md w-full md:w-1/2">
          <CardImageView
            src={HappyCoupleDancing}
            alt="Casal feliz dançando representando a conquista do sonho da casa própria"
            description="Imagem gerada por IA"
            className="w-full md:w-lg rounded-2xl shadow-md h-72"
          />

          <TextView className="text-center md:text-left">
            Tem dúvidas, sugestões ou deseja conhecer mais sobre a Penélope?
            Acesse um de nossos canais. Nossa equipe está sempre pronta para
            ouvir você, oferecer orientações e ajudar em cada etapa do seu sonho.
          </TextView>

          <ContactIconListView
            contacts={contactItems}
            layout="horizontal"
            iconSize="large"
            className="gap-card md:gap-card-md w-full md:justify-center max-md:mt-2 max-md:mb-4 max-md:grid max-md:grid-cols-4 max-md:gap-x-4 max-md:gap-y-2 max-md:flex-none max-md:justify-items-center [&_a]:max-md:p-3 [&_a]:max-md:text-[28px] [&_button]:max-md:p-3 [&_button]:max-md:text-[28px]"
          />
        </div>

        <div className="w-full md:w-1/2">
          <ContactFormView />
        </div>
      </div>
    </SectionView>
  )
}
