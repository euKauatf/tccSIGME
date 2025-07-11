// LAYOUT PRINCIPAL DAS APLICAÇÕES DO SITE! UTILIZADA EM TODAS AS PÁGINAS!

// -=-=-=-=-=-=-=- Importações -=-=-=-=-=-=-=- //
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./style.css";
import apiClient from "../../api/apiClient";

// -=-=-=-=-=-=-=- Tipos de Dados -=-=-=-=-=-=-=- //
import type { User } from "../../types";
import type { Event } from "../../types";

// Função que retorna o HTML da página
function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Busca os dados do usuário ao carregar o layout
  useEffect(() => {
    apiClient
      .get("/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Falha na autenticação:", error);
        localStorage.removeItem("authToken");
        navigate("/login");
      });
  }, [navigate]);

  // Função de logout que será passada para a Sidebar
  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
    } finally {
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  // Função para abrir e fechar a sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Container principal da aplicação */}
      <Sidebar isOpen={isSidebarOpen} user={user} onLogout={handleLogout} />
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <Navbar
          onHamburgerClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        {/* Outlet renderiza as páginas e passa o 'user' para elas */}
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default MainLayout;