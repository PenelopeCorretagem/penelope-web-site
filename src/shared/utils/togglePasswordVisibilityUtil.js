/**
 * Alterna a visibilidade de um campo de senha no HTML.
 * @param {string} inputId - ID do input de senha.
 * @returns {void}
 * @example
 * // HTML:
 * // <input type="password" id="senha" placeholder="Digite sua senha">
 * // <button type="button" onclick="togglePasswordVisibility('senha')">Mostrar/Esconder</button>
 *
 * // Quando o botão é clicado, o campo alterna entre 'password' e 'text'
 */
export function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId)
  if (!input) return
  input.type = input.type === 'password' ? 'text' : 'password'
}
