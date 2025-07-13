import { Routes, Route } from "react-router-dom"; // Importa as rotas do react-router-dom
import LoginPage from "./pages/login"; // Login
import HomePage from "./pages/home"; // Home
import RegisterPage from "./pages/register"; // Register
import EventsPage from "./pages/events"; // Events
import ProfilePage from "./pages/profile"; // Profile
import StudentsPage from "./pages/students";
import MainLayout from "./layouts/MainLayout"; // Layout principal do site né pai
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import FormEvent from "./components/Forms/FormEvent";
import EditEventPage from "./pages/events/edit.tsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/add" element={<FormEvent />} />
          <Route path="events/edit/:eventId" element={<EditEventPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="students" element={<StudentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
