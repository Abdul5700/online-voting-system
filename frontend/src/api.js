import axios from "axios";

// Use the local API while developing and the Render API in production.
// Keeping this explicit avoids any Vercel rewrite or environment-variable
// mismatch changing auth requests into same-origin 404s.
const apiBaseUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://online-voting-api-1obd.onrender.com/api";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
