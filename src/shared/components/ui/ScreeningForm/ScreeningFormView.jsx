import ReactDOM from 'react-dom'
import { useState } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function ScreeningFormView({ onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Dados enviados:', formData)
    // Aqui você pode integrar com API, WhatsApp etc.
    onClose?.() // Fecha o modal ao enviar
  }

  // Renderiza como portal para garantir sobreposição total
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-7xl mx-4 border-4 border-distac-primary">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-black hover:text-gray-600 text-6xl"
          aria-label="Fechar formulário"
        >
          &larr;
        </button>

        <HeadingView
          level={3}
          className="text-center mb-4 text-distac-primary font-semibold"
        >
          Formulário de Triagem
        </HeadingView>

        <TextView className="text-center mb-6 text-default-dark">
          Formulário de Triagem
        </TextView>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={formData.nome}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-distac-primary outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-distac-primary outline-none"
            required
          />

          <input
            type="tel"
            name="telefone"
            placeholder="Seu telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-distac-primary outline-none"
          />

          <textarea
            name="mensagem"
            placeholder="Escreva sua mensagem..."
            rows="3"
            value={formData.mensagem}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-distac-primary outline-none resize-none"
          />

          <ButtonView type="submit" variant="primary" className="w-full">
            Enviar Formulário
          </ButtonView>
        </form>
      </div>
    </div>,
    document.body
  )
}
