import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

/**
 * Registra um novo usuário.
 * @param {object} userData - Dados do usuário { nomeCompleto, email, senha }
 * @returns {Promise<object>} A resposta da API.
 */
export const registerUser = (userData) => {
  return api.post('/users', userData);
};

/**
 * Autentica um usuário.
 * @param {object} credentials - Credenciais do usuário { email, senha }
 * @returns {Promise<object>} A resposta da API com o token.
 */
export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

/**
 * Solicita a recuperação de senha.
 * @param {string} email - O e-mail do usuário.
 * @returns {Promise<object>} A resposta da API.
 */
export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

/**
 * Valida um token de redefinição de senha.
 */
export const validateResetToken = (token) => {
  return api.post('/auth/validate-token', { token });
};

/**
 * Redefine a senha do usuário.
 */
export const resetPassword = ({ token, newPassword }) => {
  return api.post('/auth/reset-password', { token, newPassword });
};
