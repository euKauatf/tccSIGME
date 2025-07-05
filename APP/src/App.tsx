// App.tsx é o cabeça do bagulho. Ele quem vai renderizar as outras páginas e gerir as tramonha tudo

// -=-=-=-=-=-=-=-=-=-=-=-=-=- Importações -=-=-=-=-=-=-=-=-=-=-=-=-=- //
import { Routes, Route } from "react-router-dom"; // Importa as rotas do react-router-dom
import LoginPage from "./pages/login"; // Login
import HomePage from "./pages/home"; // Home
import RegisterPage from "./pages/register"; // Register
<<<<<<< HEAD
=======
import EventsPage from "./pages/events"; // Events
import ProfilePage from "./pages/profile"; // Profile
import LogsPage from "./pages/logs";
import StudentsPage from "./pages/students";
>>>>>>> 450da4c (Criação das páginas da sidebar e implementação da página de alunos para administradores)
import MainLayout from "./layouts/MainLayout"; // Layout principal do site né pai
// A linha 'import ProtectedRoute...' foi removida daqui

// -=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

function App() {
  return (
    // -=-=-=-=-=-=-=-=-=-=-=-=-=- Rotas -=-=-=-=-=-=-=-=-=-=-=-=-=- //
    <Routes>
      {/* Rotas que NÃO TÊM a sidebar */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas que TÊM a sidebar - Voltaram a ser públicas temporariamente */}
      <Route element={<MainLayout />}>
        <Route path="home" element={<HomePage />} />
<<<<<<< HEAD
=======
        <Route path="events" element={<EventsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="students" element={<StudentsPage />} />
>>>>>>> 450da4c (Criação das páginas da sidebar e implementação da página de alunos para administradores)
      </Route>
    </Routes>
    // -=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 450da4c (Criação das páginas da sidebar e implementação da página de alunos para administradores)
