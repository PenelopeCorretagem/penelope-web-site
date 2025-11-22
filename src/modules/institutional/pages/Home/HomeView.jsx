import { useState, useRef, useEffect } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PropertyCardView } from '@domains/property/PropertyCard/PropertyCardView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import LogoCury from '@institutional/assets/logo-cury.jpg'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'
import { ChatbotView } from '@shared/components/ui/Chatbot/ChatbotView'

export function HomeView() {
  const [cardWidth, setCardWidth] = useState(0)
  const cardRef = useRef(null)

  const fakeRequest =
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }

  const fakeRequest2 = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: 'lancamento',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: 'lancamento',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: 'lancamento',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: 'lancamento',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
  ]

  useEffect(() => {
    const calculateCardWidth = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth
        setCardWidth(width)
      }
    }

    // Múltiplas tentativas para garantir que funcione
    const timer1 = setTimeout(calculateCardWidth, 0)
    const timer2 = setTimeout(calculateCardWidth, 100) // Fallback

    // Também no load da janela
    window.addEventListener('load', calculateCardWidth)
    window.addEventListener('resize', calculateCardWidth)

    let observer
    if (cardRef.current) {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width
          setCardWidth(width)
        }
      })
      observer.observe(cardRef.current)
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('load', calculateCardWidth)
      window.removeEventListener('resize', calculateCardWidth)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className='flex flex-col items-center pb-section-y md:pb-section-y-md bg-default-light-alt'>
        {/*Destac Announcement Property*/ }
        <SectionView className='!p-0 !gap-0'>
          <div className='bg-distac-gradient p-section-y md:p-section-y-md flex flex-col items-center justify-center w-fit'>
            <div className='flex flex-col items-center gap-subsection md:gap-subsection-md'>
              <div
                style={{
                  width: cardWidth > 0 ? `${cardWidth}px` : 'auto',
                  transition: 'all 0.3s ease'
                }}
              >
                <HeadingView
                  level={2}
                  className='text-center text-default-light'
                >
                  Seu sonho começa com uma chave
                </HeadingView>
              </div>

              <div ref={cardRef}>
                <PropertyCardView
                  hasLabel={true}
                  category={fakeRequest.category}
                  title={fakeRequest.title}
                  subtitle={fakeRequest.subtitle}
                  description={fakeRequest.description}
                  hasDifference={true}
                  differences={fakeRequest.differences}
                  hasButton={true}
                  hasShadow={false}
                />
              </div>
            </div>
          </div>
          <ImageView
            src={fakeRequest.imageLink}
            alt="Imagem do imóvel"
            mode="background"
            className='flex-1 bg-cover bg-center bg-no-repeat'
          />
        </SectionView>

        <div className='flex flex-col items-center gap-subsection md:gap-subsection-md p-card md:p-card-md rounded-sm w-fit shadow bg-default-light relative bottom-6 -mb-6'>
          <HeadingView
            level={4}
            className='text-center mt-section-y md:mt-section-y-md text-distac-secondary'
          >
            Encontre seu imóvel ideal
          </HeadingView>
          <SearchFilterView className="w-fit !bg-default-light !p-0" selectClassName="!bg-default-light-muted" />
        </div>
      </div>

      {/*Destac Properties*/ }
      <SectionView className="bg-default-light">
        <PropertiesCarouselView properties={fakeRequest2} titleCarousel="Nossos Lançamentos" />
      </SectionView>

      {/*Penélope + Cury*/ }
      <SectionView className="bg-default-light-alt">
        <div className='flex flex-col items-start justify-center flex-1 gap-subsection md:gap-subsection-md'>
          <HeadingView
            level={2}
            className='text-left'
          >
            Imóveis Com a qualidade Cury -
            <span className='text-distac-primary'> seu sonho começa com uma chave</span>
          </HeadingView>
          <TextView>
            Penélope une o melhor dos dois mundos: a experiência e credibilidade da Cury no mercado imobiliário com um atendimento humanizado, próximo e pensado especialmente para quem está dando os primeiros passos rumo à casa própria.
          </TextView>
          <ButtonView
            variant="brown"
            size="medium"
            width='fit'
            type="link"
            to='/sobre'
          >
            saber mais
          </ButtonView>
        </div>

        <ImageView
          src={LogoCury}
          alt="Imagem da Logo da Cury"
        />

      </SectionView>

      {/* 🔥 CHATBOT INCLUIDO AQUI */}
      <ChatbotView />
    </>
  )
}
