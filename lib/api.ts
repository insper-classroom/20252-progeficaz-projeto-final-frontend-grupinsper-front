// frontend/lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  // withCredentials: true, // habilite apenas se usar cookies/session
});

// listar faturas do usuário
export async function getFaturasDoUsuario(userId: string) {
  const res = await API.get(`/faturas/usuario/${userId}`);
  return res.data;
}

// criar fatura para usuário
export async function criarFaturaDoUsuario(userId: string) {
  const res = await API.post(`/faturas/${userId}`);
  return res.data;
}

// obter fatura completa
export async function obterFatura(faturaId: string) {
  const res = await API.get(`/faturas/${faturaId}`);
  return res.data;
}

// enviar extratos (arquivos) para fatura
export async function enviarExtratos(faturaId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append("file", f)); // backend usa request.files.getlist("file")
  const res = await API.post(`/faturas/${faturaId}/extratos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // withCredentials: true, // se necessário
  });
  return res.data;
}
