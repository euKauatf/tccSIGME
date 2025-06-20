// LAYOUT PRINCIPAL DAS APLICAÇÕES DO SITE! UTILIZADA EM TODAS AS PÁGINAS!

// -=-=-=-=-=-=-=- Importações -=-=-=-=-=-=-=- //
import { useState } from "react"; // Importação para utilizacao de hooks (a tal da State Machine rs)
import { Outlet } from "react-router-dom"; // Importação para poder acessar as páginas do router. É a forma de ligar as páginas
import Navbar from "../../components/Navbar"; // Importação da navbar do site
import Sidebar from "../../components/Sidebar"; // Importação da sidebar do site
import "./style.css"; // Importação do arquivo CSS padrão do projeto
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// Função que retorna o HTML da página
function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Controlar a sidebar (false de padrão no hook para carregar fechada)

  // Função para abrir e fechar a sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Se isSidebarOpen = false, entao ele vai setar a sidebar como true, e vice-versa
  };

  return (
    <div className="app-container">
      {/* Container principal da aplicação */}

      {/* Sidebar que recebe a propriedade isOpen (inicia como false)
          Se a isSidebarOpen for true, então haverá a classe "shifted" que abrirá a sidebar
          No clique do hamburger, a função toggleSidebar é chamada e muda o estado da sidebar */}
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <Navbar
          onHamburgerClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Outlet é o componente que renderiza as páginas do router */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
