import "./style.css";

// Mesma merda do Navbar, sei pra que serve direito não mas é parada do typescript ne kkj
interface SidebarProps {
  isOpen: boolean;
}

function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`sidebar bg-emerald-700 text-white w-64 p-4 ${
        isOpen ? "open" : ""
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">SIGME</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Sexo1
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Sexo2
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Sexo3
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              Sexo4
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
