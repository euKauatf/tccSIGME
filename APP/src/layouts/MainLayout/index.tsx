// !!! Layout que o site usa pra tudo quanto é página !!!

// IMPORTAÇÕES
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./style.css";
import apiClient from "../../api/apiClient";
import type { User } from "../../types";

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Pra ver se a sidebar está aberta ou fechada
  const navigate = useNavigate(); // Pra poder redirecionar o usuário
  const [user, setUser] = useState<User | null>(null); // Pra pegar o usuário (ê ê)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Mudar o tema
  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  // Abrir/Fechar a sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Renderizar o layout (po esse aqui vo explicar nao mo preguiça vocês que explodam aí)
  return (
    <div className="min-h-screen app-container bg-base-200">
      <Sidebar isOpen={isSidebarOpen} user={user} onLogout={handleLogout} currentTheme={theme} setLightTheme={setLightTheme} setDarkTheme={setDarkTheme} />
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <Navbar
          onHamburgerClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <Outlet context={{ user }} />
      </main>

      {isSidebarVisible && window.innerWidth <= 768 && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}
    </div>
  );
}

export default MainLayout;