import { useState } from "react";
import { registrarVenta } from "./api/ventas";
import { getEmpleados } from "./api/empleados";
import { getProductos } from "./api/productos";
import { useEffect } from "react";

export default function VentasPage() {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [empleado, setEmpleado] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [toast, setToast] = useState(null);
  const [errores, setErrores] = useState({});

  const mostrarToast = (mensaje, esExito) => {
    setToast({ mensaje, esExito });
    setTimeout(() => setToast(null), 3000);
  };

  const formularioInvalido =
  !cliente || !producto || !cantidad || !empleado || Number(cantidad) <= 0;


  const validar = () => {
    const nuevosErrores = {};

    if (!cliente) nuevosErrores.cliente = "El cliente es obligatorio";
    if (!producto) nuevosErrores.producto = "Selecciona un producto";
    if (!cantidad || Number(cantidad) <= 0)
      nuevosErrores.cantidad = "Cantidad válida requerida";
    if (!empleado) nuevosErrores.empleado = "Selecciona un empleado";

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const vender = async () => {
    if (!validar()) {
      mostrarToast("Por favor corrige los errores en el formulario", false);
      return;
    }

    try {
      const resultado = await registrarVenta({
        id_cliente: Number(cliente),
        id_producto: Number(producto),
        cantidad: Number(cantidad),
        id_empleado: Number(empleado),
      });
      if (resultado.ok) {
        mostrarToast("Venta registrada con éxito", true);
        setCliente("");
        setProducto("");
        setCantidad("");
        setEmpleado("");
      } else {
        mostrarToast("Error al registrar la venta", false);
      }
    } catch (error) {
      mostrarToast("Error al registrar la venta", false);
    } 
  };

  useEffect(() => {
    getEmpleados().then(setEmpleados);
    getProductos().then(setProductos);
  }, []);

  return (
    <div className="page">
      <div className="panel" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2>Nueva Transacción</h2>
        <p className="muted" style={{ marginBottom: "20px" }}>Ingresa los detalles para registrar la venta</p>

        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>CLIENTE</label>
        <input
          value={cliente}
          required
          placeholder="ID del Cliente"
          onChange={(e) => setCliente(e.target.value)}
        />
        {
          errores.cliente && <p style={{ color: "red", fontSize: "0.8rem" }}>{errores.cliente}</p>
        }


        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>PRODUCTO</label>
        <select required onChange={(e) => setProducto(e.target.value)}>
          <option value={producto} disabled selected>
            Selecciona producto
          </option>
          {productos.map(p => (
            <option key={p.id_producto} value={p.id_producto}>
              {p.nombre} - {p.precio}
            </option>
          ))}
        </select>
        {
          errores.producto && <p style={{ color: "red", fontSize: "0.8rem" }}>{errores.producto}</p>
        }

        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>CANTIDAD</label>
        <input
          value={cantidad}
          required
          placeholder="0"
          type="number"
          onChange={(e) => setCantidad(e.target.value)}
        />
        {
          errores.cantidad && <p style={{ color: "red", fontSize: "0.8rem" }}>{errores.cantidad}</p>
        }
        <label className="muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>EMPLEADO</label> 
        <select required onChange={(e) => setEmpleado(e.target.value)}>
          <option value={empleado} disabled selected>
            Selecciona empleado
          </option>
          {empleados.map(e => (
            <option key={e.id_empleado} value={e.id_empleado}>
              {e.nombre} - {e.cargo}
            </option>
          ))}
        </select>

        <button disabled={formularioInvalido} onClick={vender} style={{ width: "100%", marginTop: "10px" }}>
          Confirmar Venta
        </button>
      </div>
      {toast && (
        <div className={`toast ${toast.esExito ? "success" : "error"}`}>
          {toast.mensaje}
        </div>
      )}
    </div>
  );
}