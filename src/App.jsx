import { useState } from "react";
import ProductosPage from "./ProductosPage";
import VentasPage from "./VentasPage";
import ReportesPage from "./ReportesPage";
import ClientesPage from "./ClientesPage";

function App() {
  const [vista, setVista] = useState("productos");

  return (
    <div className="app-container">
      <h1>Dashboard de Ventas</h1>

      <nav className="nav-bar">
        <button className={vista === "clientes" ? "active" : ""} onClick={() => setVista("clientes")}>Clientes</button>
        <button className={vista === "productos" ? "active" : ""} onClick={() => setVista("productos")}>Productos</button>
        <button className={vista === "ventas" ? "active" : ""} onClick={() => setVista("ventas")}>Nueva Venta</button>
        <button className={vista === "reportes" ? "active" : ""} onClick={() => setVista("reportes")}>Reportes</button>
      </nav>

      {vista === "clientes" && <ClientesPage />}
      {vista === "productos" && <ProductosPage />}
      {vista === "ventas" && <VentasPage />}
      {vista === "reportes" && <ReportesPage />}
    </div>
  );
}

export default App;