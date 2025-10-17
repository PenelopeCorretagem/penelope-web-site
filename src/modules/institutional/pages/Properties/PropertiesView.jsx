import { useState, useRef, useEffect } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory'
import { ESectionBackgroundColor } from '@shared/components/layout/Section/ESectionBackgroundColor'
import { PropertiesCarouselView } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'
import { ResultTitleView } from '@shared/components/ui/ResultTitle/ResultTitleView'

export function PropertiesView() {
  const [setCardWidth] = useState(0)
  const cardRef = useRef(null)

  const fakeRequest = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: EPropertyCardCategory.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: EPropertyCardCategory.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: EPropertyCardCategory.LANCAMENTO,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: EPropertyCardCategory.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }
  ]
  const fakeRequest2 = [
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: EPropertyCardCategory.DISPONIVEL,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: EPropertyCardCategory.DISPONIVEL,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: EPropertyCardCategory.DISPONIVEL,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: EPropertyCardCategory.DISPONIVEL,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }
  ]
  const fakeRequest3 = [
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: EPropertyCardCategory.EM_OBRAS,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: EPropertyCardCategory.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: EPropertyCardCategory.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: EPropertyCardCategory.EM_OBRAS,
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
  })

  return (
    <>
      <SearchFilterView />
      <ResultTitleView />
      <SectionView backgroundColor={ESectionBackgroundColor.LANCAMENTO}>
        <PropertiesCarouselView properties={fakeRequest} titleCarousel="Lançamentos" />
      </SectionView>
      <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
        <PropertiesCarouselView properties={fakeRequest2} titleCarousel="Disponível" />
      </SectionView>
      <SectionView backgroundColor={ESectionBackgroundColor.LANCAMENTO}>
        <PropertiesCarouselView properties={fakeRequest3} titleCarousel="Em Obras" />
      </SectionView>
    </>
  )
}
