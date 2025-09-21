import React from 'react';
import { ButtonView as Botao } from "../../../../src/shared/view/components/ButtonView";

// Adicionamos a prop 'onClose' para que possamos ter um botão de fechar
export default function ForgotPasswordForm({ onClose }) {
  return (
    <div className="p-8 flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Redefinir Senha</h2>
      <p className="text-gray-600 mb-8">
        Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
      </p>

      <form>
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full px-4 py-3 rounded-md bg-[#E9BEDC] placeholder:text-black text-black focus:outline-none focus:ring-2 focus:ring-[#B33C8E]"
        />
      </form>

      {/* Botões de Ação */}
      <div className="mt-auto flex justify-end gap-4">
        <Botao variant="default" onClick={onClose}>
          Cancelar
        </Botao>
        <Botao variant="destac">
          Enviar Link
        </Botao>
      </div>
    </div>
  );
}
