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
                <h2>Clientes</h2>

                <input
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <input
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />

                <button onClick={crear}>Crear cliente</button>

                <div className="list">
                    {clientes.map((c) => (
                        <div className="row" key={c.id_cliente}>
                            <div className="id">#{c.id_cliente}</div>

                            <div>
                                <div><strong>{c.nombre}</strong></div>
                                <div className="muted">{c.correo}</div>
                            </div>

                            <div></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}