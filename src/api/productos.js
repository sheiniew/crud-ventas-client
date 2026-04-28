const API = "https://crud-ventas-backend.onrender.com/productos";
const API_LOCAL = "http://localhost:3000/productos";

export const getProductos = async () => {
  const res = await fetch(API);
  return res.json();
};

export const getProductosInactivos = async () => {
  const res = await fetch(`${API}/inactivos`);
  return res.json();
}

export const crearProducto = async (data) => {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const desactivarProducto = async (id) => {
  return fetch(`${API}/desactivar/${id}`, {
    method: "PUT",
  });
};

export const reactivarProducto = async (id) => {
  return fetch(`${API}/reactivar/${id}`, {
    method: "PUT",
  });
}

export const actualizarProducto = async (id, data) => {
  return fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};