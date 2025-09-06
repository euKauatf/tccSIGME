// !!! Componente Navbar !!!

// IMPORTAÇÕES
import { AlignJustify } from "lucide-react";
import "./style.css";

// Props(obrigatório) serve para passar funções e variáveis entre os componentes, aí aki ele passa pra clicar no icone e abrir a sidebar
interface NavbarProps {
  onHamburgerClick: () => void;
  isSidebarOpen: boolean;
}

function Navbar({ onHamburgerClick, isSidebarOpen }: NavbarProps) {
  // Retorna o componente navbar
  return (
    <div className="flex items-center justify-between px-1 py-1 navbarStyle p2 bg-emerald-600 shadow-xl/30 shadow-zinc-800"> {/* Navbar */}

      <div className="p-2 text-white cursor-pointer hamburger-menu" onClick={onHamburgerClick} > {/* Icone pra sidebar */}
        <AlignJustify className={`w-8 h-8 scale-125 transform transition-colors duration-200 ${isSidebarOpen ? "text-emerald-900" : "text-white"}`} />
      </div>

      <div> {/* Icone do usuário lá no cantinho (quero ainda colocar pra redirecionar pra página de perfil) */}
        <img src="./images/icon.jpg" alt="pfp" className="w-8 pfp-profile" />
      </div>

    </div>
  );
}

export default Navbar;