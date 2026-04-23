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
      <div className="panel" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2>Nueva Transacción</h2>
        <p className="muted" style={{ marginBottom: "20px" }}>Ingrese los detalles para registrar la venta.</p>

        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>CLIENTE</label>
        <input
          placeholder="ID del Cliente"
          onChange={(e) => setCliente(e.target.value)}
        />

        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>PRODUCTO</label>
        <input
          placeholder="ID del Producto"
          onChange={(e) => setProducto(e.target.value)}
        />

        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>CANTIDAD</label>
        <input
          placeholder="0"
          type="number"
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button onClick={vender} style={{ width: "100%", marginTop: "10px" }}>
          Confirmar Venta
        </button>
      </div>
    </div>
  );
}