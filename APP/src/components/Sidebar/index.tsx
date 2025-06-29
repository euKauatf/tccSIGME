import { Link, NavLink } from "react-router-dom";
import { UserRound, CalendarDays, LogOut } from "lucide-react";
import "./style.css";

interface User {
  name: string;
}
interface SidebarProps {
  isOpen: boolean;
  user: User | null;
  onLogout: () => void;
}

const linkClasses =
  "flex items-center gap-x-4 p-3 rounded-lg text-emerald-200 transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:text-white hover:pl-4";
const activeLinkClasses =
  "bg-emerald-900/50 text-white font-semibold shadow-inner";

function Sidebar({ isOpen, user, onLogout }: SidebarProps) {
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
          src="/images/icon.svg"
          alt="Avatar"
          className="w-12 h-12 rounded-full ring-2 ring-emerald-600"
        />
        <div>
          {/* A MUDANÇA: user?.name só tenta acessar .name se 'user' não for nulo */}
          <span className="text-lg font-bold text-white">{user?.name}</span>
          <p className="text-xs text-emerald-300">Ver Perfil</p>
        </div>
      </Link>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

      {/* -=-=-=-=-=- Seção de Navegação Principal -=-=-=-=-=- */}
      <nav className="flex flex-col gap-y-3">
        {/* Seus NavLinks aqui */}
        <NavLink to="/profile" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}><UserRound size={22} className="opacity-80"/><span>Perfil</span></NavLink>
        <NavLink to="/events" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}><CalendarDays size={22} className="opacity-80"/><span>Eventos</span></NavLink>
      </nav>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

      {/* -=-=-=-=-=- Ação de Deslogar e Dantas (DarkMode) -=-=-=-=-=- */}
      <div className="mt-auto pt-5">
        <div className="border-b border-emerald-700/80">
          {/* Seu DarkMode aqui */}
        </div>
        <button onClick={onLogout} className={`${linkClasses} w-full text-left`}>
          <LogOut size={22} className="opacity-80" />
          <span>Sair</span>
        </button>
      </div>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
    </aside>
  );
}

export default Sidebar;