const API = "https://crud-ventas-backend.onrender.com";

export const ventasPorCliente = async (id) => {
  const res = await fetch(`${API}/ventas-cliente/${id}`);
  return res.json();
};

export const totalPorCliente = async (id) => {
  const res = await fetch(`${API}/total/${id}`);
  return res.json();
};