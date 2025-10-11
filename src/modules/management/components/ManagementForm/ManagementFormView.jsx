import { InputView } from '@shared/view/components/InputView.jsx'
import { HeadingView } from '@shared/view/components/HeadingView'
import { ButtonView } from '@shared/view/components/ButtonView.jsx'
import { ButtonModel } from '@shared/model/components/ButtonModel'
import { useEffect, useState } from 'react'

export function ManagementFormView({ variant }) {

  const [formAction, setFormAction] = useState('')

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
    <div>
      <HeadingView level={3} color={'pink'}>{changeTitle(formAction)}</HeadingView>
      <form action={formAction} className='grid grid-cols-2 gap-subsection md:gap-subsection-md'>
        {variants[variant].map(item => (
          <InputView key={item} id={item} name={item} placeholder={`Digite seu ${item}`} variant={formAction} />
        ))}
      </form>
      <div>
        <ButtonView
          key={formAction}
          model={
            formAction === 'editar'
              ? new ButtonModel('CANCELAR', 'brown', 'button')
              : new ButtonModel('EXCLUIR', 'white', 'button')
          }
          width='fit'
          onClick={
            formAction === 'editar'
              ? () => setFormAction('')
              : () => alert('Excluir conta')
          }
        />
        <ButtonView
          model={new ButtonModel('EDITAR', 'pink', 'button')}
          width='fit'
          onClick={() => setFormAction('editar')}
        />
      </div>
    </div>
  )
}
