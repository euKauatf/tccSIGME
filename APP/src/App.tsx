import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Layouts e componentes de proteção são mantidos com importação estática
// para garantir que a estrutura principal e a segurança carreguem imediatamente.
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";

// --- PÁGINAS CARREGADAS SOB DEMANDA (LAZY LOADING) ---

// Rota pública
const LoginPage = lazy(() => import("./pages/login"));

// Rotas para todos os usuários logados
const HomePage = lazy(() => import("./pages/home"));
const EventsPage = lazy(() => import("./pages/events"));
const ProfilePage = lazy(() => import("./pages/profile"));
const PalestrantesPage = lazy(() => import("./pages/palestrantes"));
const LocaisPage = lazy(() => import("./pages/locais"));
const RedefinirSenhaPage = lazy(() => import("./pages/redefinirSenha"));

// Rotas de formulário e edição (Admin)
const FormEvent = lazy(() => import("./components/Forms/FormEvent"));
const EditEventPage = lazy(() => import("./pages/events/edit"));
const FormPalestrantePage = lazy(
  () => import("./components/Forms/FormPalestrantePage")
);
const FormLocalPage = lazy(() => import("./components/Forms/FormLocalPage"));

// Rotas de gerenciamento (Admin)
const StudentsPage = lazy(() => import("./pages/students"));
const AuditLogsPage = lazy(() => import("./pages/auditLogs"));
const ScannerPage = lazy(() => import("./pages/scanner"));

function App() {
  // Componente de fallback para ser exibido enquanto as páginas carregam
  const loadingFallback = (
    <div className="flex items-center justify-center w-full h-screen bg-base-100">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <Suspense fallback={loadingFallback}>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<LoginPage />} />
        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Rotas para todos os usuários logados */}
            <Route path="home" element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="palestrantes" element={<PalestrantesPage />} />
            <Route path="locais" element={<LocaisPage />} />
            <Route path="/mudar-senha" element={<RedefinirSenhaPage />} />

            {/* Rotas que são apenas para administradores */}
            <Route element={<AdminRoute />}>
              <Route path="events/add" element={<FormEvent />} />
              <Route path="events/edit/:eventId" element={<EditEventPage />} />
              <Route path="logs" element={<AuditLogsPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="scanner" element={<ScannerPage />} />
              <Route
                path="palestrantes/add"
                element={<FormPalestrantePage />}
              />
              <Route
                path="palestrantes/edit/:id"
                element={<FormPalestrantePage />}
              />
              <Route path="locais/add" element={<FormLocalPage />} />
              <Route path="locais/edit/:id" element={<FormLocalPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
