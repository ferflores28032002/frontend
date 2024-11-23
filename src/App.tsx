import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages";
import Layout from "./Layout";
import { DataTable } from "./containers/data-table";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Dashboard</div>} />
          
          {/* Analytics */}
          <Route path="analytics">
            <Route path="sales" element={<div>Análisis de Ventas</div>} />
            <Route path="traffic" element={<div>Análisis de Tráfico</div>} />
          </Route>
          
          {/* Products */}
          <Route path="productos">
            <Route path="catalogo" element={<div>Catálogo de Productos</div>} />
            <Route path="categorias" element={<div>Categorías</div>} />
            <Route path="inventario" element={<div>Inventario</div>} />
          </Route>
          
          {/* Orders */}
          <Route path="pedidos" element={<div>Pedidos</div>} />
          
          {/* Users */}
          <Route path="usuarios">
            <Route path="lista" element={<DataTable />} />
            <Route path="agregar" element={<div>Agregar Usuario</div>} />
          </Route>
          
          {/* Roles & Permissions */}
          <Route path="roles" element={<div>Roles</div>} />
          <Route path="permisos" element={<div>Permisos</div>} />
          
          {/* Settings */}
          <Route path="configuracion">
            <Route path="general" element={<div>Configuración General</div>} />
            <Route path="notificaciones" element={<div>Notificaciones</div>} />
            <Route path="integraciones" element={<div>Integraciones</div>} />
          </Route>
          
          {/* Support */}
          <Route path="soporte">
            <Route path="ayuda" element={<div>Centro de Ayuda</div>} />
            <Route path="mensajes" element={<div>Mensajes</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
