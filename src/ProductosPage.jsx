import { useEffect, useState } from "react";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
  reactivarProducto,
  getProductosInactivos
} from "./api/productos";
import Loading from "./Loading";
import ConfirmModal from "./utils/ConfirmModal";
import "./component.css";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("none");
  const [pagina, setPagina] = useState(1);
  const [toast, setToast] = useState(null);
  const [inactivos, setInactivos] = useState([]);
  const [verInactivos, setVerInactivos] = useState(false);

  const mostrarToast = (mensaje, esExito) => {
    const id = Date.now();

    setToast({ id, mensaje, esExito });

    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3000);
  };

  const productosPorPagina = 3;


  const formularioInvalido = !nombre || !precio || isNaN(precio) || Number(precio) <= 0 || !stock || isNaN(stock) || Number(stock) < 0;

  const productosFiltrados = productos
    .filter((p) =>
      p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenPrecio === "asc") return a.precio - b.precio;
      if (ordenPrecio === "desc") return b.precio - a.precio;
      return 0;
    });

  const inactivosFiltrados = inactivos
    .filter((p) =>
      p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenPrecio === "asc") return a.precio - b.precio;
      if (ordenPrecio === "desc") return b.precio - a.precio;
      return 0;
    });

  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;

  const productosPaginados = productosFiltrados.slice(inicio, fin);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cargar = async () => {
    setLoading(true);
    try {
      const activosData = await getProductos();
      const inactivosData = await getProductosInactivos();
      setProductos(activosData);
      setInactivos(inactivosData);
    } catch (error) {
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtroNombre, ordenPrecio]);

  const guardar = async () => {
    if (editId) {
      await actualizarProducto(editId, { nombre, precio, stock });
      setEditId(null);
      mostrarToast("Producto actualizado con exito", true);
    } else {
      await crearProducto({ nombre, precio, stock });
      mostrarToast("Producto creado con exito", true);
    }

    setNombre("");
    setPrecio("");
    setStock("");
    cargar();
  };

  const editar = (p) => {
    setEditId(p.id_producto);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setStock(p.stock);
  };

  const confirmarDesactivar = (producto) => {
    setProductoAEliminar(producto);
    setModalOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (productoAEliminar) {
      await desactivarProducto(productoAEliminar.id_producto);
      cargar();
    }
    setModalOpen(false);
    setProductoAEliminar(null);
    mostrarToast("Producto desactivado con exito", true);
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setNombre("");
    setPrecio("");
    setStock("");
  };

  return (
    <div className="page">
      <div className="panel">
        <h2>Catálogo de Productos</h2>

        <div className="form-group">
          <input
            required
            value={nombre}
            placeholder="Nombre del producto"
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            required
            value={precio}
            placeholder="Precio unitario"
            onChange={(e) => setPrecio(e.target.value)}
          />
          <input
            required
            value={stock}
            placeholder="Stock disponible"
            onChange={(e) => setStock(e.target.value)}
          />
          <button onClick={guardar} disabled={formularioInvalido} >
            {editId ? "Guardar cambios" : "Registrar producto"}
          </button>
          {editId && (
            <button style={{ marginLeft: "10px" }} onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>

        <h2>Filtrar y Ordenar Productos</h2>
        <div className="filter-bar">
          <div className="filter-label">Filtrar por nombre:</div>
          <input
            placeholder="Buscar producto..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <div className="filter-label">Ordenar por precio:</div>
          <select
            value={ordenPrecio}
            onChange={(e) => setOrdenPrecio(e.target.value)}
          >
            <option value="none">Orden normal</option>
            <option value="asc">Precio ↑</option>
            <option value="desc">Precio ↓</option>
          </select>

          <button
            className="secondary"
            onClick={() => setVerInactivos(!verInactivos)}
          >
            {verInactivos ? "Ver activos" : "Ver inactivos"}
          </button>
        </div>

        {totalPaginas > 1 && (
          <div className="pagination">
            <button
              className="secondary"
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              disabled={pagina === 1}
            >
              Anterior
            </button>

            <span className="page-info">
              Página {pagina} de {totalPaginas}
            </span>

            <button
              className="secondary"
              onClick={() =>
                setPagina((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={pagina === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : !verInactivos ? (
          <div className="list">
            {productosFiltrados.length === 0 ? (
              <div className="empty">
                <p>No hay productos activos</p>
                <span>Agrega o activa productos para verlos aquí</span>
              </div>
            ) : (
              productosFiltrados.map((p) => (
                <div className="row" key={p.id_producto}>
                  <div className="id">Id: {p.id_producto}</div>

                  <div className="info">
                    <div style={{ fontWeight: "600" }}>{p.nombre}</div>
                    <div className="muted">${p.precio}</div>
                    <div className="muted">Stock: {p.stock}</div>
                  </div>

                  <div className="actions">
                    <button className="secondary" onClick={() => editar(p)}>
                      Editar
                    </button>
                    <button
                      className="danger"
                      onClick={() => confirmarDesactivar(p)}
                    >
                      Desactivar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="list">
            {inactivosFiltrados.length === 0 ? (
              <div className="empty">
                <p>No hay productos inactivos</p>
                <span>Reactiva productos para verlos aquí</span>
              </div>
            ) : (
              inactivosFiltrados.map((p) => (
                <div className="row inactive" key={p.id_producto}>
                  <div className="id">Id: {p.id_producto}</div>

                  <div className="info">
                    <div style={{ fontWeight: "600" }}>{p.nombre}</div>
                    <div className="muted">${p.precio}</div>
                    <div className="muted">Stock: {p.stock}</div>
                  </div>

                  <div className="actions">
                    <button
                      className="secondary"
                      onClick={() =>
                        reactivarProducto(p.id_producto).then(cargar)
                      }
                    >
                      Reactivar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmarEliminar}
        title="Confirmar desactivación"
        message={`¿Estás seguro de que deseas desactivar "${productoAEliminar?.nombre}"? Esta acción no se puede deshacer`}
      />
      {toast && (
        <div
          className={`toast ${toast.esExito ? "success" : "error"}`}
        >
          {toast.mensaje}
        </div>
      )}
    </div>
  );
}