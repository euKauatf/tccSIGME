// !!! Componente que renderiza o sidebar !!!

// IMPORTAÇÕES
import { Link, NavLink } from "react-router-dom";
import { UserRound, CalendarDays, LogOut, UsersRound, ReceiptText, House } from "lucide-react";
import type { User } from "../../types";
import "./style.css";

// Props do componente para saber se tá abrida, se o usuário existe e lançar logo uma função de logout na fuça
interface SidebarProps {
  isOpen: boolean;
  user: User | null;
  onLogout: () => void;
}

// Classes dos links (Pra poder mudar a cor do link quando está ativo)
const linkClasses = "flex items-center gap-x-4 p-3 rounded-lg text-emerald-200 transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:text-white hover:pl-4";
const activeLinkClasses = "bg-emerald-900/50 text-white font-semibold shadow-inner";


function Sidebar({ isOpen, user, onLogout }: SidebarProps) {
  // Componente que renderiza o sidebar
  return (
    <aside className={`sidebar bg-emerald-800 text-white w-64 p-5 flex flex-col shadow-xl ${isOpen ? "open" : ""}`}> {/* Muda a corzinha do hamborgue */}
      {/* Parte do perfil do usuário bonitinha lá em cima */}
      <Link to="/profile" className="flex items-center gap-x-3 border-b border-emerald-700/80 pb-5 mb-5">
        <img src="/images/icon.svg" alt="Avatar" className="w-12 h-12 rounded-full ring-2 ring-emerald-600" />
        <div>
          <span className="text-lg font-bold text-white">{user?.name}</span>
          <p className="text-xs text-emerald-300">Ver Perfil</p>
        </div>
      </Link>

      {/* Links da sidebar */}
      <nav className="flex flex-col gap-y-3">
        <NavLink to="/home" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
          <House size={22} className="opacity-80" />
          <span>Página Inicial</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
          <UserRound size={22} className="opacity-80" />
          <span>Perfil</span>
        </NavLink>

        <NavLink to="/events" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
          <CalendarDays size={22} className="opacity-80" />
          <span>Atividades</span>
        </NavLink>

        {/* Se o usuário for adm, mostra os links que tão aqui embaixo*/}
        {user?.tipo == 'adm' ? (
          <>
            <NavLink to="/students" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
              <UsersRound size={22} className="opacity-80" />
              <span>Alunos</span>
            </NavLink>

            <NavLink to="/logs" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
              <ReceiptText size={22} className="opacity-80" />
              <span>Logs</span>
            </NavLink>
          </>
        ) : ( // Se não for adm, não é nadakkkkk
          <></>
        )}
      </nav>

      {/* Butão pra sair da conta */}
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
