import axios from "axios";

// Normalise the build-time URL so every browser request always targets /api.
const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const trimmedApiUrl = configuredApiUrl.replace(/\/+$/, "");
const apiBaseUrl = trimmedApiUrl.endsWith("/api") ? trimmedApiUrl : `${trimmedApiUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
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
