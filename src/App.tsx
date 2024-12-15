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
import { DataTableMantenimiento } from "./components/Mantenimientos/data-table";
import { DataTableEquipos } from "./components/Equipos/data-table";
import { DataTableReparaciones } from "./components/Reparaciones/data-table";

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
            <Route path="trabajadores">
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
                element={
                  <div>
                    <DataTableMantenimiento />
                  </div>
                }
              />
            </Route>

            {/* Equipos */}
            <Route path="equipos">
              <Route
                path="lista"
                element={
                  <div>
                    <DataTableEquipos />
                  </div>
                }
              />
            </Route>

            {/* Reparaciones */}
            <Route path="reparaciones">
              <Route
                path="solicitar"
                element={
                  <div>
                    <DataTableReparaciones />
                  </div>
                }
              />
            </Route>
          </Route>
      
      </Routes>
    </BrowserRouter>
  );
};

export default App;
