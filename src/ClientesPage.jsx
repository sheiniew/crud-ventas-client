import { useEffect, useState } from "react";
import { getClientes, crearCliente } from "./api/clientes";

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");

    const cargar = async () => {
        const data = await getClientes();
        setClientes(data);
    };

    useEffect(() => {
        cargar();
    }, []);

    const crear = async () => {
        if (!nombre || !correo) {
            return alert("Todos los campos son obligatorios");
        }

        await crearCliente({ nombre, correo });
        setNombre("");
        setCorreo("");
        cargar();
    };

    return (
        <div className="page">
            <div className="panel">
                <h2>Gestión de Clientes</h2>

                <div className="form-group">
                    <input
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <input
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <button onClick={crear}>Crear nuevo cliente</button>
                </div>

                <div className="list">
                    {clientes.map((c) => (
                        <div className="row" key={c.id_cliente}>
                            <div className="id">Id: {c.id_cliente}</div>

                            <div className="info">
                                <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{c.nombre}</div>
                                <div className="muted">{c.correo}</div>
                            </div>

                            <div className="actions">
                                {/* Espacio para acciones futuras */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}