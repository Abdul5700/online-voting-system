import axios from "axios";

// One stable API URL for every environment. Vite proxies this locally and
// Vercel rewrites it to Render in production (see vercel.json).
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
