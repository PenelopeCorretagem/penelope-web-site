import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/view/pages/AuthPage';
import VerificationCodePage from './auth/view/pages/VerificationCodePage';
import CreateNewPasswordPage from './auth/view/pages/CreateNewPasswordPage';

function App() {
  return (
    <Routes>
      {/* Rota 1: Redirecionamento da página inicial para a de autenticação */}
      <Route path="/" element={<Navigate to="/auth" />} />

      {/* Rota 2: Sua página de Login e Cadastro */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Rota 3: Página de Verificação de Código */}
      <Route path="/verificar-codigo" element={<VerificationCodePage />} />

      {/* Rota 4: Página de Criação de Nova Senha */}
      <Route path="/nova-senha" element={<CreateNewPasswordPage />} />
    </Routes>
  );
}

export default App;
