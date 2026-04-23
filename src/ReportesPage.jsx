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
        <h2>Reporte por Cliente</h2>

        <input
          placeholder="Cliente ID"
          onChange={(e) => setCliente(e.target.value)}
        />

        <button onClick={consultar}>Consultar</button>

        {total !== null && (
          <h3 style={{ marginTop: "14px" }}>
            Total vendido: <span style={{ color: "#4f46e5" }}>${Number(total)}</span>
          </h3>
        )}

        <div className="list" style={{ marginTop: "18px" }}>
          {ventas.map((v) => (
            <div className="row-4" key={v.id_venta}>
              <div className="id">#{v.id_venta}</div>

              <div>
                <strong>{v.producto}</strong>
                <div className="muted">Cantidad: {v.cantidad}</div>
              </div>

              <div>
                <div className="muted">
                  {new Date(v.fecha).toLocaleString()}
                </div>
              </div>

              <div>
                <strong>${v.subtotal}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}