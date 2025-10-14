import { InputView } from '@shared/components/ui/Input/InputView.jsx'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView.jsx'
import { useEffect, useState } from 'react'

export function ManagementFormView({ variant }) {

  const [formAction, setFormAction] = useState('')

  function getButtonConfigs(formAction, setFormAction) {
    if (formAction === 'editar') {
      return [
        { text: 'CANCELAR', color: 'brown', onClick: () => setFormAction('') },
        { text: 'SALVAR', color: 'pink', onClick: () => setFormAction('') },
      ]
    }

    return [
      { text: 'EXCLUIR', color: 'gray', onClick: () => alert('Excluir conta') },
      { text: 'EDITAR', color: 'pink', onClick: () => setFormAction('editar') },
    ]
  }

  const [button1, button2] = getButtonConfigs(formAction, setFormAction)


  useEffect(() => {
    setFormAction('')
  }, [variant])

  const variants = {
    perfil: ['primeiro Nome', 'sobrenome', 'cpf', 'data de nascimento', 'renda media mensal', 'celular'],
    acesso: ['email', 'senha atual', 'nova senha']
  }

  const changeTitle = (action) => {
    if (action === 'editar') {
      return variant === 'perfil' ? 'EDITAR PERFIL' : 'EDITAR ACESSO'
    }
    return ''
  }

  return (
    <div className='flex flex-col gap-subsection md:gap-subsection-md'>
      <HeadingView level={3} className={'text-brand-pink'}>{changeTitle(formAction)}</HeadingView>
      <form action={formAction} className='grid grid-cols-2 gap-subsection md:gap-subsection-md'>
        {variants[variant].map(item => (
          <InputView key={item} id={item} name={item} variant={formAction} />
        ))}
      </form>
      <div className='flex gap-card md:gap-card-md'>
        <ButtonView
          key={`${formAction}-1`}
          variant={button1.color}
          width="fit"
          onClick={button1.onClick}
        >
          {button1.text}
        </ButtonView>
        <ButtonView
          key={`${formAction}-2`}
          variant={button2.color}
          width="fit"
          onClick={button2.onClick}
        >
          {button2.text}
        </ButtonView>
      </div>
    </div>
  )
}
