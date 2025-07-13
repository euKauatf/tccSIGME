import { AlignJustify } from "lucide-react";
import "./style.css";

interface NavbarProps {
  onHamburgerClick: () => void;
  isSidebarOpen: boolean;
}

function Navbar({ onHamburgerClick, isSidebarOpen }: NavbarProps) {
  return (
    <>
      <div className="navbarStyle flex justify-between items-center p2 bg-emerald-600 shadow-xl/30 shadow-zinc-800 px-1 py-1">
        <div
          className="hamburger-menu text-white cursor-pointer p-2"
          onClick={onHamburgerClick}
        >
          <AlignJustify
            className={`w-8 h-8 scale-125 transform transition-colors duration-200 ${isSidebarOpen ? "text-emerald-900" : "text-white"
              }`}
          />
        </div>
        <div>
          <img src="./images/icon.svg" alt="pfp" className="w-8 pfp-profile" />
        </div>
      </div>
    </>
  );
}

export default Navbar;
