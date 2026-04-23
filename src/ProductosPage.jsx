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
        <h2>Productos</h2>

        <input
          value={nombre}
          placeholder="Nombre"
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          value={precio}
          placeholder="Precio"
          onChange={(e) => setPrecio(e.target.value)}
        />

        <button onClick={guardar}>
          {editId ? "Actualizar producto" : "Crear producto"}
        </button>

        <div className="list">
          {productos.map((p) => (
            <div className="row" key={p.id_producto}>
              <div className="id">#{p.id_producto}</div>

              <div>
                <strong>{p.nombre}</strong>
                <div className="muted">${p.precio}</div>
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