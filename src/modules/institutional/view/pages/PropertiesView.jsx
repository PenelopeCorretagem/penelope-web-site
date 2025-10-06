import { useState, useRef, useEffect } from 'react'
import { SectionView } from '@shared/view/components/SectionView'
import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { PropertyCardView } from '@shared/view/components/PropertyCardView'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'
import { ESectionBackgroundColor } from '@shared/Enum/components/ESectionBackgroundColor'
import { Image } from 'lucide-react'
import { ButtonModel } from '@shared/model/components/ButtonModel'
import { PropertiesCarouselView } from '@shared/view/components/PropertiesCarouselView'
import { SearchFilter } from '../../../../shared/view/components/SearchFilter'

export function PropertiesView() {
  const [cardWidth, setCardWidth] = useState(0)
  const cardRef = useRef(null)

  const fakeRequest = [
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
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: ECategoryCard.LANCAMENTO,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }]

  const fakeRequest2 = [
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: ECategoryCard.DISPONIVEL,
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
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: ECategoryCard.DISPONIVEL,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: ECategoryCard.DISPONIVEL,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }]

  const fakeRequest3 = [
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: ECategoryCard.EM_OBRAS,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: ECategoryCard.EM_OBRAS,
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
      category: ECategoryCard.EM_OBRAS,
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
      <SearchFilter />
      <div className='bg-surface-primary flex h-fit items-center justify-between py-6 px-24'>
        <p className='text-[32px] leading-snug font-semibold tracking-tight text-[#36221D] uppercase'>
          67 APARTAMENTOS EM SÃO PAULO COM 3 DORMITÓRIOS
        </p>
      </div>
      <SectionView backgroundColor={ESectionBackgroundColor.LANCAMENTO}>
        <PropertiesCarouselView properties={fakeRequest} titleCarousel="Lançamentos" />
      </SectionView>
      <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
        <PropertiesCarouselView properties={fakeRequest2} titleCarousel="Disponíveis" />
      </SectionView>
      <SectionView backgroundColor={ESectionBackgroundColor.LANCAMENTO}>
        <PropertiesCarouselView properties={fakeRequest3} titleCarousel="Em Obras" />
      </SectionView>
    </>
  )
}
