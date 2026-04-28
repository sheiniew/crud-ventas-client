const API = "https://crud-ventas-backend.onrender.com/clientes";
const API_LOCAL = "http://localhost:3000/clientes";

export const crearCliente = async (data) => {
    const res = await fetch(`${API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json().catch(() => null);

    return {
        ok: res.ok,
        status: res.status,
        data: json
    };
};

export const getClientes = async () => {
    const res = await fetch(`${API}`);
    return res.json();
};
