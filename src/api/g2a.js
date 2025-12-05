// src/api/g2a.js

const BASE_URL = "http://localhost:8000";

export async function runAllAgents(empresaId) {
  const res = await fetch(
    `${BASE_URL}/empresa/${encodeURIComponent(empresaId)}/agentes/run-all`
  );

  if (!res.ok) {
    throw new Error(`Erro ao rodar agentes: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
