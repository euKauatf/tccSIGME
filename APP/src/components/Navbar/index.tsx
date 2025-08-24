// !!! Componente Navbar !!!

// IMPORTAÇÕES
import { AlignJustify } from "lucide-react";
import "./style.css";

// As props foram removidas pois o controle agora é feito pelo DaisyUI
function Navbar() {

  // Retorna o componente navbar
  return (
    <div className="navbarStyle flex justify-between items-center p2 bg-emerald-600 shadow-xl/30 shadow-zinc-800 px-1 py-1"> {/* Navbar */}
      {/*essa label é o botão que está conectado diretamente com o input do MainLayout. */}
      <label htmlFor="sidebar-drawer" className="hamburger-menu text-white cursor-pointer p-2">
        <AlignJustify className="w-8 h-8 scale-125 transform transition-colors duration-200 text-white" />
      </label>

      <div>{/* Icone do usuário lá no cantinho (quero ainda colocar pra redirecionar pra página de perfil) */}
        <img src="./images/icon.svg" alt="pfp" className="w-8 pfp-profile" />
      </div>

    </div>
  );
}

export default Navbar;