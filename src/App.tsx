import React, { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Layout from "./Layout";
import { LoginPage } from "./pages";
import Dashboard from "./components/Dashboard";
import { DataTable } from "./components/Users/data-table";
import { useMainStore } from "./store";

// Tipos para las props del componente ProtectedRoute
interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
}

// Componente de Ruta Protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAllowed,
  redirectTo = "/login",
}) => {
  const location = useLocation();

  useEffect(() => {
    if (!isAllowed) {
      console.warn(`Acceso denegado a la ruta: ${location.pathname}`);
    }
  }, [isAllowed, location.pathname]);

  return isAllowed ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

const App: React.FC = () => {
  const user = useMainStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute isAllowed={!!user} />}>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <div>
                  <Dashboard />
                </div>
              }
            />

            {/* Usuarios */}
            <Route path="usuarios">
              <Route
                path="lista"
                element={
                  <div>
                    <DataTable />
                  </div>
                }
              />
            </Route>

            {/* Mantenimientos */}
            <Route path="mantenimientos">
              <Route
                path="programar"
                element={<div>Programar Mantenimiento</div>}
              />
            </Route>

            {/* Equipos */}
            <Route path="equipos">
              <Route path="lista" element={<div>Lista de Equipos</div>} />
            </Route>

            {/* Reparaciones */}
            <Route path="reparaciones">
              <Route
                path="solicitar"
                element={<div>Solicitar Reparación</div>}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
