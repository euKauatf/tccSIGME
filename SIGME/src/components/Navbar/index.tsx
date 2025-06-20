import { AlignJustify } from "lucide-react"; // Importa o icone do hamburguer
import "./style.css";

interface NavbarProps {
  // Apenas segurança que o TypeScript gera (não é necessário btw eu nem entendi direito como isso funciona kk)
  onHamburgerClick: () => void;
}

function Navbar({ onHamburgerClick }: NavbarProps) {
  return (
    <>
      <div className="flex justify-between items-center p-2 bg-emerald-600 shadow-xl/30 shadow-zinc-800 px-1 py-1">
        <div
          className="hamburger-menu text-white cursor-pointer p-2"
          onClick={onHamburgerClick}
        >
          <AlignJustify className="w-8 h-8 scale-125 transform" />
        </div>
        <div>
          <img src="./images/icon.svg" alt="pfp" className="w-8 pfp-profile" />
        </div>
      </div>
    </>
  );
}

export default Navbar;
