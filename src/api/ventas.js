const API = "http://localhost:3000/venta";

export const registrarVenta = (data) =>
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });