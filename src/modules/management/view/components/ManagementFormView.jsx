import { InputView } from '@shared/view/components/InputView.jsx'

export function ManagementFormView({ formAction, variant }) {

  const variants = {
    perfil: ['primeiro Nome', 'sobrenome', 'cpf', 'data de nascimento', 'renda media mensal', 'celular'],
    acesso: ['email', 'senha atual', 'nova senha']
  }

  return (
    <div>
      <form action={formAction} className='grid grid-cols-2 gap-subsection md:gap-subsection-md'>
        {variants[variant].map(item => (
          <InputView key={item} id={item} name={item} placeholder={`Digite seu ${item}`} variant={variant} />
        ))}
      </form>
    </div>
  )
}
