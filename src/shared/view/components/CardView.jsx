import { ButtonView } from './ButtonView'
import { ButtonModel } from '../../model/components/ButtonModel'
import { LabelView } from './LabelView'
import { LabelModel } from '../../model/components/LabelModel'
import { Heading } from './Heading'
import { Text } from './Text'

/**
 * CardView - Componente de card
 * Renderiza informações em formato de card com opções configuráveis
 * @param {boolean} label - Exibe ou não o rótulo de categoria
 * @param {string} category - Categoria do card
 * @param {string} title - Título principal
 * @param {string} subtitle - Subtítulo
 * @param {string} description - Descrição do conteúdo
 * @param {boolean} diference - Exibe ou não lista de diferenças
 * @param {Array} differences - Lista de diferenças/características
 * @param {boolean} button - Exibe ou não botão de ação
 * @param {boolean} shadow - Aplica ou não sombra ao card
 */
export function CardView({
  label = true,
  category,
  title,
  subtitle,
  description,
  diference = false,
  differences,
  button = false,
  shadow = false,
}) {
  const color =
    category == 'Lançamento'
      ? 'pink'
      : category == 'Disponível'
        ? 'brown'
        : 'softBrown'

  const categoryModel = new LabelModel(category, color, 'medium')
  const buttonModel = new ButtonModel('saber mais', 'pink', 'button')

  return (
    <div
      className={`bg-brand-white-secondary p-card md:p-card-md gap-card md:gap-card-md flex w-fit flex-col items-start rounded-sm ${shadow ? 'drop-shadow-md' : ''}`}
    >
      {label ? <LabelView model={categoryModel} /> : null}
      <div className='flex flex-col gap-2'>
        <Heading level={3}>{title}</Heading>
        <Heading level={4} color={color}>
          {subtitle}
        </Heading>
      </div>
      <Text className='uppercase'>{description}</Text>
      {diference ? (
        <div className='gap-card md:gap-card-md flex w-full flex-wrap'>
          {differences.map((item, index) => (
            <LabelView
              key={index}
              model={new LabelModel(item, 'gray', 'small')}
            />
          ))}
        </div>
      ) : null}
      {button ? (
        <ButtonView
          model={buttonModel}
          onClick={(event, model) => {
            console.log('Button clicked:', model.text)
          }}
        />
      ) : null}
    </div>
  )
}
