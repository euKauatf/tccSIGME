import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./style.css";
import apiClient from "../../api/apiClient";
import type { User } from "../../types";

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
    } finally {
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="min-h-screen app-container bg-base-200">
      <Sidebar
        isOpen={isSidebarOpen}
        user={user}
        onLogout={handleLogout}
        currentTheme={theme}
        setLightTheme={setLightTheme}
        setDarkTheme={setDarkTheme}
      />
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
