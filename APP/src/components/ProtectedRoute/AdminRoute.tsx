
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser"; // Importe o seu hook useUser

const AdminRoute = () => {
  // hook de user que pega o usuario (la ele) e verifica se é admin
  const { user, isAdmin} = useUser(); 


  // pra nao mostra sem querer, se o user for null, mostra uma mensagem de carregando
  if (user === null) {
    return <p className="text-center p-8">Carregando...</p>;
  }

  // se for adm, sobrou nada pros beta e o chad entra onde quiser
  if (user && isAdmin) {
    return <Outlet />;
  }

  //se nao for admin, volta pra home kekw
  else {
    return <Navigate to="/home" replace />; 
  }
};

export default AdminRoute;