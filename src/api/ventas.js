const API = "https://crud-ventas-backend.onrender.com/venta";
const API_LOCAL = "http://localhost:3000/venta";

export const registrarVenta = (data) =>
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
