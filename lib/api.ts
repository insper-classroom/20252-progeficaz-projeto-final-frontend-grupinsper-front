import axios from "axios";

// 1. Configuração da Instância do Axios
const API = axios.create({
  baseURL: "http://localhost:5000",
  // ESSENCIAL: Habilita o envio de cookies
  withCredentials: true, 
});

// 2. Funções de Autenticação (ATUALIZADAS)

/**
 * Faz login. O backend vai salvar o token em um cookie.
 */
export async function loginUser(data: any) {
  // Chama a rota /auth/login do seu novo arquivo
  const res = await API.post("/auth/login", data); 
  
  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function registerUser(data: any) {
  // Chama a rota /auth/register
  const res = await API.post("/auth/register", data);
  if (res.data.user) {
    // Também salva o usuário no login
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
}

/**
 * Faz logout.
 */
export async function logoutUser() {
  localStorage.removeItem("user");
  // Chama a rota de logout para o backend invalidar os cookies
  await API.post("/auth/logout");
}

/**
 * Pega os dados do usuário logado do localStorage.
 */
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

// Funções da Aplicação 

/**
 * Busca dados do usuário logado.
 * Usa a rota GET /auth/me (que é melhor que /usuarios)
 */
export async function getMe() {
  const res = await API.get("/auth/me");
  return res.data.user;
}

/**
 * Busca faturas do usuário LOGADO.
 * (Usa a rota GET /faturas/ do seu routes.py)
 */
export async function getFaturasDoUsuario() {
  const res = await API.get("/faturas/");
  return res.data.faturas;
}

/**
 * Envia extratos (arquivos) para o usuário.
 * (Usa a rota POST /faturas/usuario/<userId> do seu routes.py)
 */
export async function uploadExtratos(userId: string, files: FileList) {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append("file", f));

  const res = await API.post(`/faturas/usuario/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * Obtém uma fatura completa pelo ID.
 */
export async function obterFatura(faturaId: string) {
  const res = await API.get(`/faturas/${faturaId}`);
  return res.data.fatura;
}

export default API;