const API = "https://crud-ventas-backend.onrender.com/productos";

export const getProductos = async () => {
  const res = await fetch(API);
  return res.json();
};

export const crearProducto = async (data) => {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const eliminarProducto = async (id) => {
  return fetch(`${API}/${id}`, {
    method: "DELETE",
  });
};

export const actualizarProducto = async (id, data) => {
  return fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};