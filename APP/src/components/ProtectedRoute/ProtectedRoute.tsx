// !!! Serve para proteger as rotas que só podem ser acessadas por usuários autenticados !!!

// IMPORTAÇÕES
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Verifica se o usuário está autenticado
  const token = localStorage.getItem('authToken');

  // Se o usuário está autenticado, renderiza o componente filho (Outlet), se não manda pro login
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;