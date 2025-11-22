import { AlignJustify } from "lucide-react";
import "./style.css";

interface NavbarProps {
  onHamburgerClick: () => void;
  isSidebarOpen: boolean;
}

function Navbar({ onHamburgerClick, isSidebarOpen }: NavbarProps) {
  return (
    <div className="flex items-center justify-between px-1 py-1 navbarStyle p2 bg-emerald-600 shadow-xl/30 shadow-zinc-800">
      <div
        className="p-2 text-white cursor-pointer hamburger-menu"
        onClick={onHamburgerClick}>
        <AlignJustify
          className={`w-8 h-8 scale-125 transform transition-colors duration-200 ${
            isSidebarOpen ? "text-emerald-900" : "text-white"
          }`}
        />
      </div>

      <div>
        <img src="./images/icon.jpg" alt="pfp" className="w-8 pfp-profile" />
      </div>
    </div>
  );
}

export default Navbar;
