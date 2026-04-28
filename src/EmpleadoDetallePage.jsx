import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVentasEmpleado, getAuditoriaEmpleado } from "./api/empleados";

export default function EmpleadoDetallePage() {
  const { id } = useParams();

  const [ventas, setVentas] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [paginaVentas, setPaginaVentas] = useState(1);
  const ventasPorPagina = 3;

  useEffect(() => {
    setPaginaVentas(1);
  }, [id, ventas]);

  const inicio = (paginaVentas - 1) * ventasPorPagina;
  const fin = inicio + ventasPorPagina;

  const ventasPaginadas = ventas.slice(inicio, fin);

  const totalPaginasVentas = Math.ceil(
    ventas.length / ventasPorPagina
  );

  useEffect(() => {
    const cargar = async () => {
      try {
        const ventasData = await getVentasEmpleado(id);
        setVentas(ventasData);
        const auditoriaData = await getAuditoriaEmpleado(id);
        setAuditoria(auditoriaData);
      } catch (error) {
        alert("Error al cargar detalles del empleado");
      }
    };
    cargar();
  }, [id]);

  return (
    <div className="page">
      <div className="panel">

        <h2>Detalle del Empleado #{id}</h2>

        {/* VENTAS */}
        <section className="section">
          <h3>Ventas</h3>

          {totalPaginasVentas > 1 && (
            <div className="pagination">
              <button
                className="secondary"
                onClick={() =>
                  setPaginaVentas((p) => Math.max(p - 1, 1))
                }
                disabled={paginaVentas === 1}
              >
                Anterior
              </button>

              <span className="page-info">
                Página {paginaVentas} de {totalPaginasVentas}
              </span>

              <button
                className="secondary"
                onClick={() =>
                  setPaginaVentas((p) =>
                    Math.min(p + 1, totalPaginasVentas)
                  )
                }
                disabled={paginaVentas === totalPaginasVentas}
              >
                Siguiente
              </button>
            </div>
          )}

          {ventas.length === 0 ? (
            <div className="empty-state">No hay ventas registradas</div>
          ) : (
            <div className="list compact">
              {ventasPaginadas.map((v) => (
                <div className="card-item" key={v.id_venta}>
                  <div>
                    <div className="title">Venta #{v.id_venta}</div>
                    <div className="muted">
                      {new Date(v.fecha).toLocaleString()}
                    </div>
                  </div>
                  {
                    v.detalle_venta.map((d, i) => (
                      <div key={i} style={{ marginLeft: "10px" }}>
                        <p><strong>Producto:</strong> {d.productos?.nombre}</p>
                        <p>Cantidad: {d.cantidad}</p>
                        <p>Precio: ${d.precio_unitario}</p>
                        <p>Subtotal: ${d.cantidad * d.precio_unitario}</p>
                      </div>
                    ))
                  }
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AUDITORÍA */}
        <section className="section">
          <h3>Auditoría</h3>

          {auditoria.length === 0 ? (
            <div className="empty-state">No hay registros de auditoría</div>
          ) : (
            <div className="timeline">
              {auditoria.map((a, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-dot" />

                  <div className="timeline-content">
                    <div className="title">{a.accion}</div>
                    <div className="muted">
                      {new Date(a.fecha).toLocaleString()}
                    </div>

                    {a.datos_nuevos && (
                      <div className="box new">
                        <p>Nombre: {a.datos_nuevos.nombre}</p>
                        <p>Correo: {a.datos_nuevos.correo}</p>
                        <p>
                          Activo:{" "}
                          {a.datos_nuevos.activo ? "Sí" : "No"}
                        </p>
                      </div>
                    )}

                    {a.datos_anteriores && (
                      <div className="box old">
                        <p>Antes: {a.datos_anteriores.nombre}</p>
                        <p>Antes: {a.datos_anteriores.correo}</p>
                        <p>
                          Activo:{" "}
                          {a.datos_anteriores.activo ? "Sí" : "No"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}