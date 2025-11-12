import { useState } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function ScreeningFormView({ onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    email: '',
    celular: '',
    renda: ''
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Dados enviados:', formData)
    // Aqui você pode integrar com API, WhatsApp, etc.
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="max-h-screen bg-pink-50 border border-pink-600 rounded-2xl flex flex-col justify-center items-center p-10 relative w-full max-w-6xl shadow-xl">

        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-700 hover:text-pink-900 text-2xl"
          aria-label="Fechar formulário"
        >
          ✕
        </button>

        {/* Cabeçalho */}
        <div className="w-full flex justify-between items-center mb-10">
          <HeadingView level={2} className="text-3xl font-semibold text-pink-700 text-center flex-1">
            FORMULÁRIO DE TRIAGEM
          </HeadingView>
          <img
            src="/logo.png"
            alt="Logo consultoria"
            className="w-24 h-auto object-contain"
          />
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-2 gap-6 max-w-6xl"
        >
          {/* Linha 1 */}
          <div className="flex flex-col">
            <input
              id="nome"
              type="text"
              placeholder="NOME"
              value={formData.nome}
              onChange={handleChange}
              className="bg-pink-200 rounded-md px-4 py-3 outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <input
              id="sobrenome"
              type="text"
              placeholder="SOBRENOME:"
              value={formData.sobrenome}
              onChange={handleChange}
              className="bg-pink-200 rounded-md px-4 py-3 outline-none"
            />
          </div>

          {/* Linha 2 */}
          <div className="flex flex-col">
            <input
              id="cpf"
              type="text"
              placeholder="CPF:"
              value={formData.cpf}
              onChange={handleChange}
              className="bg-pink-200 rounded-md px-4 py-3 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <input
              id="email"
              type="email"
              placeholder="E-MAIL:"
              value={formData.email}
              onChange={handleChange}
              className="bg-pink-200 rounded-md px-4 py-3 outline-none"
            />
          </div>

          {/* Linha 3 */}
          <div className="flex flex-col">
            <input
              id="celular"
              type="tel"
              placeholder="CELULAR:"
              value={formData.celular}
              onChange={handleChange}
              className="bg-pink-200 rounded-md px-4 py-3 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <input
              id="renda"
              type="text"
              placeholder="RENDA MÉDIA MENSAL:"
              value={formData.renda}
              onChange={handleChange}
              className="bg-pink-200 rounded-md px-4 py-3 outline-none"
            />
          </div>
        </form>

        {/* Botões */}
        <div className="flex gap-4 mt-10">
          <ButtonView
            type="submit"
            variant="primary"
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-md"
            onClick={handleSubmit}
          >
            ENVIAR FORMULÁRIO
          </ButtonView>
        </div>
      </div>
    </div>
  )
}
