import { useState } from "react";
import ProductosPage from "./ProductosPage";
import VentasPage from "./VentasPage";
import ReportesPage from "./ReportesPage";
import ClientesPage from "./ClientesPage";

function App() {
  const [vista, setVista] = useState("productos");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sistema de Ventas</h1>

      <button onClick={() => setVista("clientes")}>Clientes</button>
      <button onClick={() => setVista("productos")}>Productos</button>
      <button onClick={() => setVista("ventas")}>Ventas</button>
      <button onClick={() => setVista("reportes")}>Reportes</button>

      <hr />
      {vista === "clientes" && <ClientesPage />}
      {vista === "productos" && <ProductosPage />}
      {vista === "ventas" && <VentasPage />}
      {vista === "reportes" && <ReportesPage />}
    </div>
  );
}

export default App;