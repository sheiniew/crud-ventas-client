import { useEffect, useState } from "react";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "./api/productos";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null);

  const cargar = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async () => {
    if (editId) {
      await actualizarProducto(editId, { nombre, precio });
      setEditId(null);
    } else {
      await crearProducto({ nombre, precio });
    }

    setNombre("");
    setPrecio("");
    cargar();
  };

  const editar = (p) => {
    setEditId(p.id_producto);
    setNombre(p.nombre);
    setPrecio(p.precio);
  };

  const eliminar = async (id) => {
    await eliminarProducto(id);
    cargar();
  };

  return (
    <div className="page">
      <div className="panel">
        <h2>Catálogo de Productos</h2>

        <div className="form-group">
          <input
            value={nombre}
            placeholder="Nombre del producto"
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            value={precio}
            placeholder="Precio unitario"
            onChange={(e) => setPrecio(e.target.value)}
          />
          <button onClick={guardar}>
            {editId ? "Guardar cambios" : "Registrar producto"}
          </button>
        </div>

        <div className="list">
          {productos.map((p) => (
            <div className="row" key={p.id_producto}>
              <div className="id">Id: {p.id_producto}</div>

              <div className="info">
                <div style={{ fontWeight: "600" }}>{p.nombre}</div>
                <div className="muted" style={{ color: "#4f46e5", fontWeight: "500" }}>
                  ${p.precio}
                </div>
              </div>

              <div className="actions">
                <button className="secondary" onClick={() => editar(p)}>
                  Editar
                </button>
                <button className="danger" onClick={() => eliminar(p.id_producto)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}