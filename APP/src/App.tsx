import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";

const LoginPage = lazy(() => import("./pages/login"));

const HomePage = lazy(() => import("./pages/home"));
const EventsPage = lazy(() => import("./pages/events"));
const ProfilePage = lazy(() => import("./pages/profile"));
const PalestrantesPage = lazy(() => import("./pages/palestrantes"));
const LocaisPage = lazy(() => import("./pages/locais"));
const RedefinirSenhaPage = lazy(() => import("./pages/redefinirSenha"));

const FormEvent = lazy(() => import("./components/Forms/FormEvent"));
const EditEventPage = lazy(() => import("./pages/events/edit"));
const FormPalestrantePage = lazy(
  () => import("./components/Forms/FormPalestrantePage")
);
const FormLocalPage = lazy(() => import("./components/Forms/FormLocalPage"));

const StudentsPage = lazy(() => import("./pages/students"));
const AuditLogsPage = lazy(() => import("./pages/auditLogs"));
const ScannerPage = lazy(() => import("./pages/scanner"));
const DashboardPage = lazy(() => import("./pages/dashboard"));

function App() {
  const loadingFallback = (
    <div className="flex items-center justify-center w-full h-screen bg-base-100">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <Suspense fallback={loadingFallback}>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="palestrantes" element={<PalestrantesPage />} />
            <Route path="locais" element={<LocaisPage />} />
            <Route path="/mudar-senha" element={<RedefinirSenhaPage />} />

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
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
