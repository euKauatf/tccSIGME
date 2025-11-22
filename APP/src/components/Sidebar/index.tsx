import { Link, NavLink } from "react-router-dom";
import {
  UserRound,
  CalendarDays,
  LogOut,
  UsersRound,
  ReceiptText,
  House,
  Briefcase,
  Camera,
  MapPin,
  Lock,
} from "lucide-react";
import type { User } from "../../types";
import "./style.css";

interface SidebarProps {
  isOpen: boolean;
  user: User | null;
  onLogout: () => void;
  currentTheme: string;
  setLightTheme: () => void;
  setDarkTheme: () => void;
}

const linkClasses =
  "flex items-center gap-x-4 p-3 rounded-lg text-emerald-200 transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:text-white hover:pl-4";
const activeLinkClasses =
  "bg-emerald-900/50 text-white font-semibold shadow-inner";

function Sidebar({
  isOpen,
  user,
  onLogout,
  currentTheme,
  setLightTheme,
  setDarkTheme,
}: SidebarProps) {
  return (
    <aside
      className={`sidebar bg-emerald-800 text-white w-64 p-5 flex flex-col shadow-xl ${
        isOpen ? "open" : ""
      }`}>
      {" "}
      <Link
        to="/profile"
        className="flex items-center pb-5 mb-5 border-b gap-x-3 border-emerald-700/80">
        <img
          src="/images/icon.jpg"
          alt="Avatar"
          className="w-12 h-12 rounded-full ring-2 ring-emerald-600"
        />
        <div>
          <span className="text-lg font-bold text-white">{user?.name}</span>
          <p className="text-xs text-emerald-300">Ver Perfil</p>
        </div>
      </Link>
      <nav className="flex flex-col gap-y-1">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ""}`
          }>
          <House size={22} className="opacity-80" />
          <span>Página Inicial</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ""}`
          }>
          <UserRound size={22} className="opacity-80" />
          <span>Perfil</span>
        </NavLink>
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ""}`
          }>
          <CalendarDays size={22} className="opacity-80" />
          <span>Atividades</span>
        </NavLink>

        {user?.tipo == "adm" ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ""}`
              }>
              <House size={22} className="opacity-80" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ""}`
              }>
              <UsersRound size={22} className="opacity-80" />
              <span>Alunos</span>
            </NavLink>
            <NavLink
              to="/logs"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ""}`
              }>
              <ReceiptText size={22} className="opacity-80" />
              <span>Logs</span>
            </NavLink>
            <NavLink
              to="/palestrantes"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ""}`
              }>
              <Briefcase size={22} className="opacity-80" />
              <span>Palestrantes</span>
            </NavLink>
            <NavLink
              to="/locais"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ""}`
              }>
              <MapPin size={22} className="opacity-80" />
              <span>Locais</span>
            </NavLink>
            <NavLink
              to="/scanner"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ""}`
              }>
              <Camera size={22} className="opacity-80" />
              <span>Scanner</span>
            </NavLink>
          </>
        ) : (
          <></>
        )}
      </nav>
      <div className="flex items-center justify-center gap-4 p-4">
        <button
          onClick={setLightTheme}
          className={`btn btn-ghost btn-circle ${
            currentTheme === "light" ? "btn-active" : ""
          }`}
          aria-label="Mudar para tema claro">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
        </button>

        <button
          onClick={setDarkTheme}
          className={`btn btn-ghost btn-circle ${
            currentTheme === "dark" ? "btn-active" : ""
          }`}
          aria-label="Mudar para tema escuro">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
      <nav className="flex flex-col pt-5 mt-auto gap-y-1">
        <NavLink
          to="/mudar-senha"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ""}`
          }>
          <Lock size={22} className="opacity-80" />
          <span>Mudar Senha</span>
        </NavLink>
        <button
          onClick={onLogout}
          className={`${linkClasses} w-full text-left`}>
          <LogOut size={22} className="opacity-80" />
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
