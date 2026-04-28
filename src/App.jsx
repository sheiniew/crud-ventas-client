import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ProductosPage from "./ProductosPage";
import VentasPage from "./VentasPage";
import ReportesPage from "./ReportesPage";
import ClientesPage from "./ClientesPage";
import EmpleadosPage from "./EmpleadosPage";
import EmpleadoDetallePage from "./EmpleadoDetallePage";

function App() {
  return (
    <div className="app-container">
      <h1>Dashboard de Ventas</h1>
      <nav className="nav-bar">
        <NavLink to="/clientes" className={({ isActive }) => isActive ? "active" : ""}>Clientes</NavLink>
        <NavLink to="/productos" className={({ isActive }) => isActive ? "active" : ""}>Productos</NavLink>
        <NavLink to="/ventas" className={({ isActive }) => isActive ? "active" : ""}>Nueva Venta</NavLink>
        <NavLink to="/reportes" className={({ isActive }) => isActive ? "active" : ""}>Reportes</NavLink>
        <NavLink to="/empleados" className={({ isActive }) => isActive ? "active" : ""}>Empleados</NavLink>
      </nav>
        <Routes>
          <Route path="/" element={<EmpleadosPage />} />
          <Route path="/empleado/:id" element={<EmpleadoDetallePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/empleados" element={<EmpleadosPage />} />
        </Routes>
    </div>
  );
}

export default App;