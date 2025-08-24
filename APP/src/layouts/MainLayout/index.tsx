// !!! Layout que o site usa pra tudo quanto é página !!!

// IMPORTAÇÕES
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import apiClient from "../../api/apiClient";
import type { User } from "../../types";

function MainLayout() {
  const navigate = useNavigate(); // Pra poder redirecionar o usuário
  const [user, setUser] = useState<User | null>(null); // Pra pegar o usuário (ê ê)

  // Pegar o usuário e ver se ele está logado ou não
  useEffect(() => {
    apiClient
      .get("/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Falha na autenticação:", error);
        localStorage.removeItem("authToken");
        navigate("/");
      });
  }, [navigate]);

  // Desconectar a conta
  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
    } finally {
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  // Renderizar o layout (po esse aqui vo explicar nao mo preguiça vocês que explodam aí)
  return (
    <div className="drawer bg-gray-100 min-h-screen">
      {/*essa checkbox controla se a sidebar está aberta ou fechada */}
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
      {/*esse tal drawer é a gaveta do daisyUI que, usando apenas CSS, esconde e mostra a sidebar com animação de deslizar*/}
      <aside className="drawer-side z-50">
        <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar user={user} onLogout={handleLogout} />
      </aside>
    </div>
  );
}

export default MainLayout;