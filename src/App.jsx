import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/view/pages/AuthPage';
import ForgotPasswordPage from './auth/view/pages/ForgotPasswordPage';

function App() {
  return (
    <Routes>
      {/* Rota 1: Redirecionamento da página inicial para a de autenticação */}
      <Route path="/" element={<Navigate to="/auth" />} />

      {/* Rota 2: Sua página de Login e Cadastro */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Rota 3:página de Recuperação de Senha */}
      <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />

    </Routes>
  );
}

export default App;
