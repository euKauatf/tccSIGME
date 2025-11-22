import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const AdminRoute = () => {
  const { user, isAdmin } = useUser();

  if (user === null) {
    return <p className="p-8 text-center">Carregando...</p>;
  }

  if (user && isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to="/home" replace />;
  }
};

export default AdminRoute;
