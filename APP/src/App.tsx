import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import EventsPage from "./pages/events";
import ProfilePage from "./pages/profile";
import StudentsPage from "./pages/students";
import MainLayout from "./layouts/MainLayout";
import FormEvent from "./components/Forms/FormEvent";
import EditEventPage from "./pages/events/edit";
import AuditLogsPage from "./pages/auditLogs";
import ScannerPage from "./pages/scanner";
import PalestrantesPage from "./pages/palestrantes";
import FormPalestrantePage from "./components/Forms/FormPalestrantePage";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<LoginPage />} />

      {/* Rotas protegidas com o mesmo aninhamento */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Rotas para todos os usuários logados */}
          <Route path="home" element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="palestrantes" element={<PalestrantesPage />} />

          {/* Rotas que são apenas para administradores */}
          <Route element={<AdminRoute />}>
            <Route path="events/add" element={<FormEvent />} />
            <Route path="events/edit/:eventId" element={<EditEventPage />} />
            <Route path="logs" element={<AuditLogsPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="palestrantes/add" element={<FormPalestrantePage />} />
            <Route path="palestrantes/edit/:id" element={<FormPalestrantePage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

