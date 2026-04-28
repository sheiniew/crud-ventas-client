import { useEffect, useState } from "react";
import { getClientes, crearCliente } from "./api/clientes";
import Loading from "./Loading";

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errores, setErrores] = useState({});

    const formularioInvalido = !nombre || !correo;

    const mostrarToast = (mensaje, esExito) => {
        const id = Date.now();

        setToast({ id, mensaje, esExito });

        setTimeout(() => {
            setToast((prev) => (prev?.id === id ? null : prev));
        }, 3000);
    };

    const validar = () => {
        const nuevosErrores = {};

        if (!nombre) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        }
        if (!correo) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!correo.includes("@") || !correo.includes(".")) {
            nuevosErrores.correo = "El correo no es válido";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    };


    const existeCorreo = async (correo) => {
        try {
            const clientes = await getClientes();
            return clientes.some(c => c.correo === correo);
        } catch (error) {
            mostrarToast("Error al verificar correo", false);
            return false;
        }
    };

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (error) {
            mostrarToast("Error al cargar clientes", false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const crear = async () => {
        if (!validar()) return;
        const res = await crearCliente({ nombre, correo });
        if (!res.ok) {
            if (res.data?.error) {
                setErrores(prev => ({
                    ...prev,
                    correo: res.data.error
                }));
            } else {
                mostrarToast("Error al crear cliente", false);
            }
            return;
        }
        setNombre("");
        setCorreo("");
        setErrores({});
        mostrarToast("Cliente creado con exito", true);
        await cargar();
    };

    return (
        <div>
            <h2>Cliente</h2>
            <div className="form-group">
                <input
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                {errores.nombre && <div className="error">{errores.nombre}</div>}
                <input
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => (setCorreo(e.target.value))}
                />
                {errores.correo && <div style={{ color: "red", paddingBottom: "10px" }}>{errores.correo}</div>}
                <button disabled={formularioInvalido} onClick={crear}>
                    Agregar cliente
                </button>
            </div>
            <h2>Lista de Clientes</h2>
            {loading ? (
                <Loading />
            ) : (
                <div className="page">
                    <div className="panel">

                        <h2>Gestión de Clientes</h2>
                        {clientes.length === 0 ? (
                            <p style={{ color: "gray" }}>No hay clientes registrados</p>
                        ) : null}
                        <div className="list">
                            {clientes.map((c) => (
                                <div className="row" key={c.id_cliente}>
                                    <div className="id">Id: {c.id_cliente}</div>

                                    <div className="info">
                                        <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{c.nombre}</div>
                                        <div className="muted">{c.correo}</div>
                                    </div>

                                    <div className="actions">

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
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