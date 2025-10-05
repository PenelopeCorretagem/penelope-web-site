import { SectionView } from '@shared/view/components/SectionView'
import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { CardImageView } from '@institutional/view/components/CardImageView'
import { ESectionBackgroundColor } from '@shared/Enum/components/ESectionBackgroundColor'
import AboutImage from '@institutional/assets/about-image.png'
import PenelopeImage from '@institutional/assets/penelope-about.png'
import CuryAbout from '@institutional/assets/cury-about.png'
import PenelopeCuryImage from '@institutional/assets/penelope-cury-about.svg'

export function AboutView() {

  return (
    <>
      <SectionView backgroundColor={ESectionBackgroundColor.WHITE} className="flex flex-row items-between justify-between gap-section md:gap-section-md">
        <div className="flex flex-col gap-subsection mb:gap-subsection-md w-[50%] justify-center">
          <HeadingView level={1} color="pink" className="text-left">
            seu sonho começa com uma chave
          </HeadingView>
          <TextView className="flex flex-col gap-card md:gap-card-md text-sm">
            Penélope une o melhor dos dois mundos: a experiência e credibilidade da Cury no mercado imobiliário com um atendimento humanizado, próximo e pensado especialmente para quem está dando os primeiros passos rumo à casa própria.
            Mais do que vender imóveis, nosso propósito é transformar conquistas em momentos inesquecíveis, oferecendo clareza em cada detalhe, suporte em todas as etapas e soluções acessíveis para tornar o sonho possível.
          </TextView>
        </div>
        <div className='flex flex-col gap-subsection mb:gap-subsection-md w-[50%] justify-center'>
          <CardImageView path={AboutImage} description='Imagem gerada por IA' position='bottom-left' alt='Imagem mulher com chave' />
        </div>
      </SectionView>

      <SectionView backgroundColor={ESectionBackgroundColor.PINK_GRADIENT} className="flex flex-row items-between gap-section md:gap-section-md">
        <div className="flex flex-col gap-subsection mb:gap-subsection-md w-[45%] align-center">
          <img src={PenelopeImage} alt="Corretora Penélope" />
        </div>
        <div className="flex flex-col gap-subsection mb:gap-subsection-md w-[55%] align-center">
          <HeadingView level={1} color="white" className="text-left">
            Penélope ou Isabella
          </HeadingView>
          <TextView color='white' className="flex flex-col gap-card md:gap-card-md text-sm">
            A corretora Penélope é mais do que um nome comercial — é a expressão da corretora Isabelle, uma jovem apaixonada por ajudar pessoas a conquistarem seu primeiro imóvel. Penélope é a identidade profissional que Isabella criou para se comunicar de forma mais leve, próxima e acolhedora com seus clientes, especialmente jovens das classes C e D de São Paulo que estão dando seus primeiros passos rumo à casa própria.
          </TextView>
          <TextView color='white' className="flex flex-col gap-card md:gap-card-md text-sm">
            Com uma abordagem empática e transparente, Isabella — como Penélope — transforma o processo de compra em uma jornada emocional, onde cada chave entregue representa um novo capítulo de vida. Ela não vende apenas imóveis: oferece escuta, parceria e celebração em cada etapa, tornando-se uma verdadeira ponte entre pessoas e sonhos.
          </TextView>
        </div>
      </SectionView>

      <SectionView backgroundColor={ESectionBackgroundColor.WHITE} className="flex flex-row items-between justify-between gap-section md:gap-section-md">
        <div className="flex flex-col gap-subsection mb:gap-subsection-md w-[55%] justify-center">
          <HeadingView level={2} color="pink" className="text-left">
            Imóveis Com a qualidade Cury
          </HeadingView>
          <TextView className="flex flex-col gap-card md:gap-card-md">
            Com mais de 60 anos de história, a Cury Construtora é uma das maiores referências do setor imobiliário no Brasil. Presente nas regiões metropolitanas de São Paulo e Rio de Janeiro, a empresa tem como missão transformar vidas por meio de empreendimentos acessíveis, modernos e de alta qualidade.
          </TextView>
          <TextView className="flex flex-col gap-card md:gap-card-md">
            Listada na B3 desde 2020 (CURY3), a Cury atua com foco em incorporação econômica, oferecendo soluções habitacionais que promovem segurança, dignidade e realização para milhares de brasileiros. Seu compromisso é claro: construir não apenas imóveis, mas futuros melhores.
          </TextView>
        </div>
        <div className='flex flex-col gap-subsection mb:gap-subsection-md w-[45%] justify-center'>
          <CardImageView path={CuryAbout} description='' position='top-right' alt='Imagem da Cury Construtora'/>
        </div>
      </SectionView>

      <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY} className="flex flex-row items-between justify-between gap-section md:gap-section-md">
        <div className="flex flex-col gap-subsection mb:gap-subsection-md w-[45%] justify-center">
          <img src={PenelopeCuryImage} alt="Penélope e Cury" className='rounded-md shadow-md border-[#b33c8e]' />
        </div>
        <div className="flex flex-col gap-subsection mb:gap-subsection-md w-[55%] justify-center">
          <HeadingView level={2} color="pink" className="text-left">
            Penélope + Cury
          </HeadingView>
          <TextView className="flex flex-col gap-card md:gap-card-md">
            A união entre Penélope e a Cury é o encontro perfeito entre sensibilidade e solidez. Integrada ao time da construtora, Penélope traz uma abordagem jovem e personalizada, enquanto a Cury oferece credibilidade, segurança e acesso a empreendimentos de alto padrão.
          </TextView>
          <TextView className="flex flex-col gap-card md:gap-card-md">
            Essa parceria transforma a compra do primeiro imóvel em uma experiência única, onde o cliente é acolhido desde o primeiro contato. Juntas, Penélope e Cury tornam o sonho da casa própria mais acessível, humano e memorável — uma jornada marcada por confiança, alegria e conquistas reais.
          </TextView>
        </div>
      </SectionView>
    </>
  )
}
