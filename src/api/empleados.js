const API = "https://crud-ventas-backend.onrender.com";
const API_LOCAL = "http://localhost:3000";

export const getEmpleados = async () =>
    fetch(`${API}/empleados`).then(r => r.json());

export const getEmpleadosInhabilitados = async () =>
    fetch(`${API}/empleados/inhabilitados`).then(r => r.json());

export const crearEmpleado = async (data) =>
    fetch(`${API}/empleados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

export const actualizarEmpleado = async (id, data) =>
    fetch(`${API}/empleados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

export const inhabilitarEmpleado = async (id) =>
    fetch(`${API}/empleados/${id}`, {
        method: "DELETE"
    });

export const reactivarEmpleado = async (id) =>
    fetch(`${API}/empleados/reactivar/${id}`, {
        method: "PUT"
    });

export const getVentasEmpleado = async (id) => {
    const res = await fetch(`${API}/ventas-empleado/${id}`);
    return res.json();
};

export const getAuditoriaEmpleado = async (id) => {
    const res = await fetch(`${API}/auditoria-empleado/${id}`);
    return res.json();
};