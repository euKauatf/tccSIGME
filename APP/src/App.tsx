// App.tsx é o cabeça do bagulho. Ele quem vai renderizar as outras páginas e gerir as tramonha tudo

// -=-=-=-=-=-=-=-=-=-=-=-=-=- Importações -=-=-=-=-=-=-=-=-=-=-=-=-=- //
import { Routes, Route } from "react-router-dom"; // Importa as rotas do react-router-dom
import LoginPage from "./pages/login"; // Login
import HomePage from "./pages/home"; // Home
import RegisterPage from "./pages/register"; // Register
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
      </Route>
    </Routes>
    // -=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
  );
}

export default App;