import { Link, NavLink } from "react-router-dom";
import { UserRound, CalendarDays, LogOut } from "lucide-react";
import "./style.css";

// Mesma merda do Navbar, sei pra que serve direito não mas é parada do typescript ne kkj
interface SidebarProps {
  isOpen: boolean;
}

// Estilos base para TODOS os links
const linkClasses =
  "flex items-center gap-x-4 p-3 rounded-lg text-emerald-200 transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:text-white hover:pl-4";

// Estilos que serão aplicados ao link da página ativa
const activeLinkClasses =
  "bg-emerald-900/50 text-white font-semibold shadow-inner";

function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`sidebar bg-emerald-800 text-white w-64 p-5 flex flex-col shadow-xl ${
        isOpen ? "open" : ""
      }`}
    >
      {/* -=-=-=-=-=- Seção do Perfil do Usuário -=-=-=-=-=- */}
      <Link
        to="/profile"
        className="flex items-center gap-x-3 border-b border-emerald-700/80 pb-5 mb-5"
      >
        <img
          src="./images/icon.svg"
          className="w-12 h-12 rounded-full ring-2 ring-emerald-600"
        />
        <div>
          <span className="text-lg font-bold text-white">Nome</span>
          <p className="text-xs text-emerald-300">Ver Perfil</p>
        </div>
      </Link>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

      {/* -=-=-=-=-=- Seção de Navegação Principal -=-=-=-=-=- */}
      <nav className="flex flex-col gap-y-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ""}`
          }
        >
          <UserRound size={22} className="opacity-80" />
          <span>Perfil</span>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ""}`
          }
        >
          <CalendarDays size={22} className="opacity-80" />
          <span>Eventos</span>
        </NavLink>
      </nav>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

      {/* -=-=-=-=-=- Ação de Deslogar e Dantas (DarkMode) -=-=-=-=-=- */}
      <div className="mt-auto pt-5">
        <div className="border-b border-emerald-700/80">
          <label className="swap mb-4 swap-rotate text-emerald-200">
            <input type="checkbox" className="theme-controller" value="dark" />

            {/* sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>

        <NavLink to="/" className={linkClasses}>
          <LogOut size={22} className="opacity-80" />
          <span>Sair</span>
        </NavLink>
      </div>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
    </aside>
  );
}

export default Sidebar;
