
// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // 1. O segurança olha no "bolso" do navegador (localStorage)
  //    para ver se a pessoa tem o "convite VIP" (o authToken).
  const token = localStorage.getItem('authToken');

  // 2. A decisão do segurança é baseada na existência do convite.
  //    Usamos uma estrutura if/else para clareza.
  if (token) {
    // SE o token EXISTE, o segurança libera a passagem.
    // O <Outlet /> é o "espaço reservado" onde o React Router vai renderizar
    // a página protegida que o usuário quer acessar (ex: o MainLayout e a HomePage).
    return <Outlet />;
  } else {
    // SENÃO (se o token NÃO EXISTE), o acesso é negado.
    // O componente <Navigate> do React Router é usado para forçar
    // um redirecionamento para a página de login ('/').
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;