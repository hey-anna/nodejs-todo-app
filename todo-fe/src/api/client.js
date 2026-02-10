import axios from "axios";
import { STORAGE_KEY } from "../constants/storage";

/**
 * Axios instance (Vite)
 * - env: VITE_BACKEND_URL (e.g., http://localhost:5050)
 * - baseURL: `${VITE_BACKEND_URL}/api`
 */

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Request interceptor: attach token + log request */
api.interceptors.request.use(
  (config) => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const token = parsed?.token;

        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore invalid JSON
    }

    if (import.meta.env.DEV) console.log("Starting Request", config);
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor: log response (dev) + normalize errors
 * - If server responds: reject with `error.response.data`
 * - If no response (network/CORS): reject with original error
 */
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) console.log("Response:", response);
    return response;
  },
  (error) => {
    const payload = error?.response?.data ?? error;
    if (import.meta.env.DEV) console.log("RESPONSE ERROR", payload);
    return Promise.reject(payload);
  },
);

export default api;
