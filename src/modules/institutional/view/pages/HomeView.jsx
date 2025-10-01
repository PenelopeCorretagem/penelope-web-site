import { useState, useRef, useEffect } from 'react'
import { SectionView } from '@shared/view/components/SectionView'
import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { CardView } from '@shared/view/components/CardView'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'
import { ESectionBackgroundColor } from '@shared/Enum/components/ESectionBackgroundColor'
import { Image } from 'lucide-react'
import { ButtonModel } from '@shared/model/components/ButtonModel'

export function HomeView() {
  const [cardWidth, setCardWidth] = useState(0)
  const cardRef = useRef(null)

  const fakeRequest =
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }

  const fakeRequest2 = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: ECategoryCard.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: ECategoryCard.DISPONIVEL,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
  ]

  useEffect(() => {
    const calculateCardWidth = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth
        console.log('Largura calculada:', width) // Para debug
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
          console.log('ResizeObserver largura:', width) // Para debug
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
      <SectionView paddingClasses='p-0' gapClasses='gap-0'>
        <div className='bg-brand-gradient p-section-y md:p-section-y-md flex flex-col h-auto items-start justify-center md:justify-start w-fit'>
          <div className='flex flex-col items-center gap-6'>
            <div
              style={{
                width: cardWidth > 0 ? `${cardWidth}px` : 'auto',
                transition: 'all 0.3s ease'
              }}
            >
              <HeadingView
                level={2}
                color='white'
                className='text-center'
              >
                Seu sonho começa com uma chave
              </HeadingView>
            </div>

            <div ref={cardRef}>
              <CardView
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
        {fakeRequest.imageLink != null ?(
          <div
            className='w-full h-auto bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${fakeRequest.imageLink})` }}
            role="img"
            aria-label="Imagem do imóvel"
          >
          </div>
        ) : <div className='w-full h-auto flex items-center justify-center bg-brand-white-secondary'><Image className='w-[50%] h-[50%] text-brand-white-tertiary' /></div>}
      </SectionView>

      <SectionView>
        <div className={`flex flex-col h-auto items-start justify-center md:justify-start w-full gap-subsection md:gap-subsection-md`}>
          <HeadingView
            level={2}
            className='text-left'
          >
            Imóveis Com a qualidade Cury -
            <span className='text-brand-pink'> seu sonho começa com uma chave</span>
          </HeadingView>
          <TextView>
            Penélope une o melhor dos dois mundos: a experiência e credibilidade da Cury no mercado imobiliário com um atendimento humanizado, próximo e pensado especialmente para quem está dando os primeiros passos rumo à casa própria.
          </TextView>
          <ButtonView
            model={new ButtonModel('saber mais', 'brown', 'button')}
            width='fit'
          />
        </div>
        {fakeRequest.imageLink != null ?(
          <div
            className='w-full h-auto bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${fakeRequest.imageLink})` }}
            role="img"
            aria-label="Imagem do imóvel"
          />
        ) : <div className='w-full h-auto flex items-center justify-center bg-brand-white-secondary'><Image className='w-[50%] h-[50%] text-brand-white-tertiary' /></div>}
      </SectionView>

      <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
        <div className='w-full overflow-x-auto'>
          <div className='flex flex-row items-center gap-4 md:gap-6 pb-4'>
            {fakeRequest2.map((property, index) => (
              <CardView
                key={index}
                hasLabel={true}
                category={property.category}
                title={property.title}
                subtitle={property.subtitle}
                description={property.description}
                hasDifference={true}
                differences={property.differences}
                hasButton={true}
                hasShadow={true}
                hasImage={true}
                imageUrl={property.imageLink}
              />
            ))}
          </div>
        </div>
      </SectionView>

    </>
  )
}
