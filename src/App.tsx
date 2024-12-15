import React from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { DataTableEquipos } from "./components/Equipos/data-table";
import { DataTableMantenimiento } from "./components/Mantenimientos/data-table";
import { DataTableReparaciones } from "./components/Reparaciones/data-table";
import { DataTable } from "./components/Users/data-table";
import Layout from "./Layout";
import { LoginPage } from "./pages";

const App: React.FC = () => {
 

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
