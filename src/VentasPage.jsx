import { useState } from "react";
import { registrarVenta } from "./api/ventas";

export default function VentasPage() {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");

  const vender = async () => {
    await registrarVenta({
      id_cliente: Number(cliente),
      id_producto: Number(producto),
      cantidad: Number(cantidad),
    });
    alert("Venta registrada");
  };

  return (
    <div className="page">
      <div className="panel">
        <h2>Registro de Ventas</h2>

        <input
          placeholder="Cliente ID"
          onChange={(e) => setCliente(e.target.value)}
        />

        <input
          placeholder="Producto ID"
          onChange={(e) => setProducto(e.target.value)}
        />

        <input
          placeholder="Cantidad"
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button onClick={vender}>Registrar venta</button>
      </div>
    </div>
  );
}