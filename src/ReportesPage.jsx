import { useState } from "react";
import { ventasPorCliente, totalPorCliente } from "./api/reportes";

export default function ReportesPage() {
  const [cliente, setCliente] = useState("");
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(null);

  const consultar = async () => {
    if (!cliente) {
      alert("Ingresa un cliente válido");
      return;
    }

    const dataVentas = await ventasPorCliente(cliente);
    const dataTotal = await totalPorCliente(cliente);
    setTotal(dataTotal.total || dataTotal[0]?.total || 0);

    setVentas(dataVentas);

  };

  return (
    <div className="page">
      <div className="panel">
        <h2>Reporte de Ventas por Cliente</h2>

        <div className="form-inline" style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Ingrese ID del cliente"
            onChange={(e) => setCliente(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button onClick={consultar}>Consultar reporte</button>
        </div>

        {total !== null && (
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f5f3ff",
            borderRadius: "12px",
            border: "1px solid #ddd6fe"
          }}>
            <span style={{ color: "#4338ca", fontSize: "0.9rem", fontWeight: "500" }}>Total acumulado:</span>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#4f46e5" }}>
              ${Number(total).toLocaleString()}
            </div>
          </div>
        )}

        <div className="list" style={{ marginTop: "24px" }}>
          {ventas.map((v) => (
            <div className="row-4" key={v.id_venta}>
              <div className="id">#{v.id_venta}</div>

              <div>
                <div style={{ fontWeight: "600" }}>{v.producto}</div>
                <div className="muted">Cant: {v.cantidad}</div>
              </div>

              <div>
                <div className="muted" style={{ fontSize: "0.75rem" }}>
                  {new Date(v.fecha).toLocaleDateString()}
                  <br />
                  {new Date(v.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "700", color: "#1e293b" }}>${v.subtotal}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}