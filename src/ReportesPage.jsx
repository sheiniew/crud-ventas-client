import { useState } from "react";
import { ventasPorCliente, totalPorCliente } from "./api/reportes";

export default function ReportesPage() {
  const [cliente, setCliente] = useState("");
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(false);
  const [noVentas, setNoVentas] = useState(false);

  const consultar = async () => {
    if (!cliente) {
      setError(true);
      return;
    }
    setError(false);
    setNoVentas(false);
    const dataVentas = await ventasPorCliente(cliente);
    const dataTotal = await totalPorCliente(cliente);
    setTotal(dataTotal.total || dataTotal[0]?.total || 0);

    if (dataVentas.length === 0) {
      setNoVentas(true);
    }

    setVentas(dataVentas);
    console.log("Ventas:", dataVentas);
    console.log("Total:", dataTotal);
  };

  return (
    <div className="page">
      <div className="panel">
        <h2>Reporte de Ventas por Cliente</h2>
        <p className="muted" style={{ marginBottom: "20px" }}>Ingrese el ID del cliente para consultar su historial de compras</p>
        <div className="form-inline" style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Ingrese ID del cliente"
            onChange={(e) => setCliente(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button onClick={consultar}>Consultar reporte</button>
        </div>
        {error && <p style={{ color: "red", marginTop: "10px" }}>Por favor ingrese un ID de cliente válido</p>}
        {noVentas && total !== null && (
          <div className="empty">
            <p>No se encontraron ventas para este cliente</p>
          </div>
        )}

        {ventas.length > 0 && total !== null && (
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
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Subtotal: ${(Number(v.subtotal) || 0).toLocaleString()}
                </div>

                <div style={{ fontSize: "0.75rem", color: "#16a34a" }}>
                  IVA (19%): ${(Number(v.iva) || 0).toLocaleString()}
                </div>

                <div style={{ fontSize: "0.75rem", color: "#dc2626" }}>
                  Retención: -${(Number(v.retencion) || 0).toLocaleString()}
                </div>

                <div style={{
                  fontWeight: "700",
                  marginTop: "4px",
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "4px"
                }}>
                  Total: ${(Number(v.total) || 0).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}