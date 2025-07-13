import { Link, NavLink } from "react-router-dom";
import { UserRound, CalendarDays, LogOut, UsersRound, ReceiptText, House } from "lucide-react";
import type { User } from "../../types";
import "./style.css";

interface SidebarProps {
  isOpen: boolean;
  user: User | null;
  onLogout: () => void;
}

const linkClasses = "flex items-center gap-x-4 p-3 rounded-lg text-emerald-200 transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:text-white hover:pl-4";
const activeLinkClasses = "bg-emerald-900/50 text-white font-semibold shadow-inner";

function Sidebar({ isOpen, user, onLogout }: SidebarProps) {
  return (
    <aside className={`sidebar bg-emerald-800 text-white w-64 p-5 flex flex-col shadow-xl ${isOpen ? "open" : ""}`}>
      <Link to="/profile" className="flex items-center gap-x-3 border-b border-emerald-700/80 pb-5 mb-5">
        <img src="/images/icon.svg" alt="Avatar" className="w-12 h-12 rounded-full ring-2 ring-emerald-600" />
        <div>
          <span className="text-lg font-bold text-white">{user?.name}</span>
          <p className="text-xs text-emerald-300">Ver Perfil</p>
        </div>
      </Link>
      <nav className="flex flex-col gap-y-3">
        <NavLink to="/home" className={({ isActive }) =>
          `${linkClasses} ${isActive ? activeLinkClasses : ""}`
        }
        >
          <House size={22} className="opacity-80" />
          <span>Página Inicial</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) =>
          `${linkClasses} ${isActive ? activeLinkClasses : ""}`
        }
        >
          <UserRound size={22} className="opacity-80" />
          <span>Perfil</span>
        </NavLink>

        <NavLink to="/events" className={({ isActive }) =>
          `${linkClasses} ${isActive ? activeLinkClasses : ""}`
        }
        >
          <CalendarDays size={22} className="opacity-80" />
          <span>Atividades</span>
        </NavLink>

        {user?.tipo == 'adm' ? (
          <>
            <NavLink to="/students" className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeLinkClasses : ""}`
            }
            >
              <UsersRound size={22} className="opacity-80" />
              <span>Alunos</span>
            </NavLink>

            <NavLink to="/logs" className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeLinkClasses : ""}`
            }
            >
              <ReceiptText size={22} className="opacity-80" />
              <span>Logs</span>
            </NavLink>
          </>
        ) : (
          <></>
        )}
      </nav>


      <div className="mt-auto pt-5">
        <button onClick={onLogout} className={`${linkClasses} w-full text-left`}>
          <LogOut size={22} className="opacity-80" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
