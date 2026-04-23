const API = "http://localhost:3000/clientes";

export const crearCliente = async (data) => {
    return fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const getClientes = async () => {
    const res = await fetch(`${API}`);
    return res.json();
};
